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

let currentUtterance: SpeechSynthesisUtterance | null = null;

/**
 * Web Speech API Text-to-Speech (TTS) Voice Synthesis
 */
export function speakText(text: string, lang: Language = "en", onEnd?: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("Web Speech Synthesis not supported in this browser environment.");
    if (onEnd) onEnd();
    return;
  }

  // Cancel any ongoing speech immediately
  window.speechSynthesis.cancel();
  currentUtterance = null;

  // Short timeout prevents Chrome/Safari bug where cancel() followed immediately by speak() drops audio
  setTimeout(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    currentUtterance = utterance;
    utterance.rate = 0.95; // Slightly slower for clear kiosk audibility
    utterance.pitch = 1.0;
    
    const targetLocale = LANG_LOCALE_MAP[lang] || "en-IN";
    utterance.lang = targetLocale;

    // Try to find a natural native voice for the selected language
    const voices = window.speechSynthesis.getVoices();
    
    let targetVoice = null;
    
    if (lang === "hi") {
      targetVoice = voices.find(v => 
        v.lang.toLowerCase() === "hi-in" || 
        v.lang.toLowerCase().startsWith("hi") || 
        v.name.toLowerCase().includes("hindi")
      );
    } else {
      // Default to English (India) if possible, else any English
      targetVoice = voices.find(v => v.lang.toLowerCase() === "en-in" || v.name.toLowerCase().includes("india")) || 
                    voices.find(v => v.lang.toLowerCase().startsWith("en"));
    }

    if (targetVoice) {
      utterance.voice = targetVoice;
    }

    utterance.onend = () => {
      currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      currentUtterance = null;
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }, 30);
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
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
      console.error("Failed to start speech recognition:", e);
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
