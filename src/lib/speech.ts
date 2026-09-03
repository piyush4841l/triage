import { Language } from "./i18n";

export const LANG_LOCALE_MAP: Record<Language, string> = {
  en: "en-IN",
  as: "as-IN",
  bn: "bn-IN",
  brx: "brx-IN",
  doi: "doi-IN",
  gu: "gu-IN",
  hi: "hi-IN",
  kn: "kn-IN",
  ks: "ks-IN",
  kok: "kok-IN",
  mai: "mai-IN",
  ml: "ml-IN",
  mni: "mni-IN",
  mr: "mr-IN",
  ne: "ne-NP",
  or: "or-IN",
  pa: "pa-IN",
  sa: "sa-IN",
  sat: "sat-IN",
  sd: "sd-IN",
  ta: "ta-IN",
  te: "te-IN",
  ur: "ur-IN",
};

const audioCache = new Map<string, string>();
let currentAudio: HTMLAudioElement | null = null;
let activeSpeechToken = 0;

export function stopSpeaking() {
  activeSpeechToken++; // Cancel any pending speech fetches
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export async function speakText(text: string, lang: Language = "en", onEnd?: () => void) {
  if (typeof window === "undefined") {
    if (onEnd) onEnd();
    return;
  }

  stopSpeaking();
  
  const currentToken = activeSpeechToken;

  const cacheKey = `${lang}_${text}`;
  
  const playBase64Audio = (base64String: string) => {
    // Prevent playback if a newer speech request was started while we were fetching
    if (activeSpeechToken !== currentToken) return;
    
    try {
      const audio = new Audio(`data:audio/wav;base64,${base64String}`);
      currentAudio = audio;
      audio.onended = () => {
        if (activeSpeechToken === currentToken) currentAudio = null;
        if (onEnd) onEnd();
      };
      audio.onerror = () => {
        if (activeSpeechToken === currentToken) currentAudio = null;
        if (onEnd) onEnd();
      };
      audio.play().catch(e => {
        console.warn("Audio playback error:", e);
        if (onEnd) onEnd();
      });
    } catch (e) {
      if (onEnd) onEnd();
    }
  };

  if (audioCache.has(cacheKey)) {
    playBase64Audio(audioCache.get(cacheKey)!);
    return;
  }

  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, lang })
    });
    
    // Prevent proceeding if a newer speech request was started
    if (activeSpeechToken !== currentToken) return;
    
    if (!res.ok) throw new Error("TTS failed");
    
    const data = await res.json();
    
    if (activeSpeechToken !== currentToken) return;
    
    if (data.audio) {
      audioCache.set(cacheKey, data.audio);
      playBase64Audio(data.audio);
    } else {
      throw new Error("No audio returned");
    }
  } catch (error) {
    if (activeSpeechToken !== currentToken) return;
    console.warn("Sarvam API failed, falling back to native:", error);
    
    // Fallback
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = LANG_LOCALE_MAP[lang] || "en-IN";
      utterance.onend = () => { if (onEnd) onEnd(); };
      utterance.onerror = () => { if (onEnd) onEnd(); };
      window.speechSynthesis.speak(utterance);
    } else {
      if (onEnd) onEnd();
    }
  }
}

/**
 * Web Speech API Speech-to-Text (STT) Recognition
 */
export interface VoiceRecognitionOptions {
  lang: Language;
  onResult: (transcript: string) => void;
  onError?: (err: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export class SpeechToTextController {
  private recognition: any = null;
  private isListening = false;

  constructor() {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;
      }
    }
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }

  public startListening(options: VoiceRecognitionOptions): boolean {
    if (!this.recognition) {
      if (options.onError) {
        options.onError("Speech recognition not supported in this browser. Please use text input.");
      }
      return false;
    }

    if (this.isListening) {
      this.stopListening();
    }

    this.recognition.lang = LANG_LOCALE_MAP[options.lang] || "en-IN";

    this.recognition.onstart = () => {
      this.isListening = true;
      if (options.onStart) options.onStart();
    };

    this.recognition.onresult = (event: any) => {
      if (event.results && event.results[0] && event.results[0][0]) {
        const transcript = event.results[0][0].transcript.trim();
        options.onResult(transcript);
      }
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      console.warn("Speech recognition error:", event.error);
      if (options.onError) options.onError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (options.onEnd) options.onEnd();
    };

    try {
      this.recognition.start();
      return true;
    } catch (e) {
      console.warn("Failed to start speech recognition:", e);
      return false;
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }
}

export const globalSpeechRecognizer = new SpeechToTextController();
