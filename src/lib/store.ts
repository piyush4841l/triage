import { db } from "./firebase";
import { collection, doc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { TriageResult, TriageInput } from "./triage";

export type QueueStatus = "WAITING" | "CALLED" | "IN_CONSULTATION" | "COMPLETED" | "TRANSFERRED";

export interface StoredToken {
  id: string;
  result: TriageResult;
  input: TriageInput;
  status: QueueStatus;
  createdAt: string;
  calledAt?: string;
  completedAt?: string;
  ocrDetails?: {
    diagnoses: string[];
    medications: string[];
    allergies: string[];
    rawText: string;
  };
}

const STORAGE_KEY = "sih_opd_tokens_queue_v2";

export const INITIAL_PRELOADED_TOKENS: StoredToken[] = [];

export function getStoredTokens(): StoredToken[] {
  if (typeof window === "undefined") return INITIAL_PRELOADED_TOKENS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRELOADED_TOKENS));
      return INITIAL_PRELOADED_TOKENS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_PRELOADED_TOKENS;
  }
}

export function saveStoredTokens(tokens: StoredToken[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
    window.dispatchEvent(new Event("opd_queue_updated"));
  } catch (e) {
    console.error("Failed to save tokens:", e);
  }
}

export function addToken(token: StoredToken): StoredToken[] {
  const existing = getStoredTokens();
  const updated = token.result.priorityTier === "RED" ? [token, ...existing] : [...existing, token];
  saveStoredTokens(updated);

  // Realtime Cloud Sync via Firebase Firestore (sanitize undefined fields)
  try {
    const cleanToken = JSON.parse(JSON.stringify(token));
    const docRef = doc(db, "tokens", token.id);
    setDoc(docRef, cleanToken).catch((err) => console.error("Firestore setDoc error:", err));
  } catch (e) {
    console.error("Firebase sync error:", e);
  }

  return updated;
}

export function updateTokenStatus(tokenId: string, newStatus: QueueStatus): StoredToken[] {
  const existing = getStoredTokens();
  const updated = existing.map((t) => {
    if (t.id === tokenId || t.result.tokenId === tokenId) {
      const copy = { ...t, status: newStatus };
      if (newStatus === "CALLED") copy.calledAt = new Date().toISOString();
      if (newStatus === "COMPLETED") copy.completedAt = new Date().toISOString();
      return copy;
    }
    return t;
  });
  saveStoredTokens(updated);

  // Realtime Cloud Sync via Firebase Firestore
  try {
    const targetToken = updated.find((t) => t.id === tokenId || t.result.tokenId === tokenId);
    if (targetToken) {
      const cleanToken = JSON.parse(JSON.stringify(targetToken));
      const docRef = doc(db, "tokens", targetToken.id);
      setDoc(docRef, cleanToken).catch((err) => console.error("Firestore setDoc update error:", err));
    }
  } catch (e) {
    console.error("Firebase status sync error:", e);
  }

  return updated;
}

export function getTokenById(tokenId: string): StoredToken | undefined {
  const tokens = getStoredTokens();
  return tokens.find((t) => t.id === tokenId || t.result.tokenId === tokenId || t.result.tokenNumber === tokenId);
}

/**
 * Real-time Multi-Tab & Firebase Firestore Listener
 */
export function subscribeToTokens(onUpdate: (tokens: StoredToken[]) => void): () => void {
  if (typeof window === "undefined") return () => {};

  // 1. Instant cross-tab sync on same machine via localStorage event
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      onUpdate(getStoredTokens());
    }
  };
  const handleCustomEvent = () => {
    onUpdate(getStoredTokens());
  };

  window.addEventListener("storage", handleStorageChange);
  window.addEventListener("opd_queue_updated", handleCustomEvent);

  // 2. Realtime Firestore cloud sync across different machines
  let unsubscribeFirestore = () => {};
  try {
    const tokensRef = collection(db, "tokens");
    unsubscribeFirestore = onSnapshot(
      tokensRef,
      (snapshot) => {
        const remoteTokens: StoredToken[] = [];
        snapshot.forEach((doc) => {
          remoteTokens.push(doc.data() as StoredToken);
        });

        if (remoteTokens.length > 0) {
          // Sort tokens: Emergency RED first, then newest creation date
          remoteTokens.sort((a, b) => {
            if (a.result.priorityTier === "RED" && b.result.priorityTier !== "RED") return -1;
            if (b.result.priorityTier === "RED" && a.result.priorityTier !== "RED") return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          saveStoredTokens(remoteTokens);
          onUpdate(remoteTokens);
        }
      },
      (error) => {
        console.warn("Firestore subscription error (check Security Rules in Firebase console):", error);
      }
    );
  } catch (e) {
    console.warn("Firestore listener init error:", e);
  }

  return () => {
    window.removeEventListener("storage", handleStorageChange);
    window.removeEventListener("opd_queue_updated", handleCustomEvent);
    unsubscribeFirestore();
  };
}
