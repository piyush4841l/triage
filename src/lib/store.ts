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
  // Insert emergencies at top, others appended
  const updated = token.result.priorityTier === "RED" ? [token, ...existing] : [...existing, token];
  saveStoredTokens(updated);
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
  return updated;
}

export function getTokenById(tokenId: string): StoredToken | undefined {
  const tokens = getStoredTokens();
  return tokens.find((t) => t.id === tokenId || t.result.tokenId === tokenId || t.result.tokenNumber === tokenId);
}
