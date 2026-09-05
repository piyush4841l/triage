"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  User, 
  Calendar, 
  Phone, 
  CreditCard, 
  Fingerprint,
  Mic, 
  MicOff, 
  ArrowRight, 
  AlertCircle, CheckCircle,
  Keyboard,
  ShieldCheck,
  Lock,
  Loader2 } from "lucide-react";
import { Language, translations, getIdentityLabels } from "@/lib/i18n";
import { MOCK_ABHA_DATABASE } from "@/lib/mock-abha";
import { speakText, globalSpeechRecognizer } from "@/lib/speech";
import { VOICE_PROMPTS } from "@/lib/speech-prompts";
import { VirtualKeypad } from "@/components/kiosk/VirtualKeypad";
import { StoredToken } from "@/lib/store";

export interface PatientRegistrationData {
  patientName: string;
  age: number;
  gender: string;
  phone: string;
  abhaId?: string;
  aadhaarId?: string;
  mockAbhaProfile?: any;
}

interface PatientRegistrationProps {
  initialData?: PatientRegistrationData;
  onProceed: (data: PatientRegistrationData) => void;
  onEmergencyTokenGenerated?: (token: StoredToken) => void;
  lang: Language;
  voiceGuide: boolean;
}

export const PatientRegistration: React.FC<PatientRegistrationProps> = ({
  initialData,
  onProceed,
  lang,
  voiceGuide,
}) => {
  const t = translations[lang] || translations.en;
  const idLabels = getIdentityLabels(lang);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Standard Registration Form State
  const [patientName, setPatientName] = useState(initialData?.patientName || "");
  const [age, setAge] = useState(initialData?.age ? initialData.age.toString() : "");
  const [gender, setGender] = useState(initialData?.gender || "Male");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [idType, setIdType] = useState<"abha" | "aadhaar">(initialData?.aadhaarId ? "aadhaar" : "abha");
  const [abhaId, setAbhaId] = useState(initialData?.abhaId || "");
  const [aadhaarId, setAadhaarId] = useState(initialData?.aadhaarId || "");

  const [errors, setErrors] = useState<{
    name?: string;
    age?: string;
    phone?: string;
    abha?: string;
    aadhaar?: string;
    identity?: string;
  }>({});
  const [activeListeningField, setActiveListeningField] = useState<string | null>(null);
  const [showKeypadFor, setShowKeypadFor] = useState<"phone" | "age" | null>(null);

  // Verification States (ABHA / Aadhaar)
  const [isVerified, setIsVerified] = useState(false);
  const [verificationState, setVerificationState] = useState<"idle" | "method_select" | "awaiting_otp" | "awaiting_pass">("idle");
  const [authMethod, setAuthMethod] = useState<"otp" | "pass">("otp");
  const [otpInput, setOtpInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStartVerification = () => {
    const cleanId = idType === "abha" ? abhaId.replace(/\D/g, "") : aadhaarId.replace(/\D/g, "");
    const requiredLength = idType === "abha" ? 14 : 12;
    if (cleanId.length !== requiredLength) {
      if (idType === "abha") {
        setErrors((prev) => ({ ...prev, abha: lang === "hi" ? "कृपया पहले 14 अंक दर्ज करें" : "Enter full 14 digits first" }));
      } else {
        setErrors((prev) => ({ ...prev, aadhaar: lang === "hi" ? "कृपया पहले 12 अंक दर्ज करें" : "Enter full 12 digits first" }));
      }
      return;
    }
    setOtpInput("");
    setPassInput("");
    setVerifyError("");
    setVerificationState("method_select");
    speakText(
      lang === "hi"
        ? "कृपया सत्यापन विधि चुनें, ओटीपी या पासवर्ड"
        : "Please select your verification method, Mobile OTP or Password.",
      lang
    );
  };

  const handleSelectMethod = (method: "otp" | "pass") => {
    setAuthMethod(method);
    setVerifyError("");
    if (method === "otp") {
      setVerificationState("awaiting_otp");
      speakText(
        lang === "hi"
          ? "आपके पंजीकृत मोबाइल नंबर पर एक ओटीपी भेजा गया है।"
          : "An OTP has been sent to your registered mobile number. Please enter it.",
        lang
      );
    } else {
      setVerificationState("awaiting_pass");
      speakText(
        lang === "hi"
          ? "कृपया अपना पासवर्ड दर्ज करें।"
          : "Please enter your password.",
        lang
      );
    }
  };

  const handleVerifyAuth = () => {
    if (authMethod === "otp" && !otpInput.trim()) {
      setVerifyError(lang === "hi" ? "कृपया 4-अंकीय ओटीपी दर्ज करें" : "Please enter 4-digit OTP");
      return;
    }
    if (authMethod === "pass" && !passInput.trim()) {
      setVerifyError(lang === "hi" ? "कृपया अपना पासवर्ड दर्ज करें" : "Please enter your password");
      return;
    }
    setIsVerifying(true);
    setVerifyError("");
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      setVerificationState("idle");
      speakText(
        lang === "hi"
          ? "सत्यापन सफल।"
          : "Verification successful.",
        lang
      );

      if (idType === "abha") {
        const strippedAbha = abhaId.replace(/\D/g, "");
        const profile = MOCK_ABHA_DATABASE[strippedAbha];
        if (profile) {
          if (!patientName) setPatientName(profile.name);
          if (!age) setAge(profile.age.toString());
          if (!gender) setGender(profile.gender);
          if (!phone) setPhone(profile.phone);
        }
      }

      setErrors((prev) => {
        const next = { ...prev };
        delete next.identity;
        delete next.abha;
        delete next.aadhaar;
        return next;
      });
    }, 600);
  };


  // Handle Speech-to-Text Voice Dictation for inputs
  const handleVoiceInput = (field: "name" | "age" | "phone" | "abha" | "aadhaar") => {
    if (activeListeningField === field) {
      globalSpeechRecognizer.stopListening();
      setActiveListeningField(null);
      return;
    }

    setActiveListeningField(field);

    const started = globalSpeechRecognizer.startListening({
      lang,
      onResult: (transcript) => {
        if (field === "name") {
          const cleanName = transcript.replace(/[0-9\u0966-\u096F]/g, "");
          setPatientName(cleanName);
          if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
        } else if (field === "age") {
          const digits = transcript.replace(/\D/g, "");
          if (digits) {
            setAge(digits.slice(0, 3));
            if (errors.age) setErrors((prev) => ({ ...prev, age: undefined }));
          }
        } else if (field === "phone") {
          const digits = transcript.replace(/\D/g, "");
          if (digits) {
            setPhone(digits.slice(0, 10));
            if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
          }
        } else if (field === "abha") {
          const digits = transcript.replace(/\D/g, "");
          if (digits) {
            setAbhaId(formatAbha(digits.slice(0, 14)));
            if (errors.abha || errors.identity) setErrors((prev) => ({ ...prev, abha: undefined, identity: undefined }));
          }
        } else if (field === "aadhaar") {
          const digits = transcript.replace(/\D/g, "");
          if (digits) {
            setAadhaarId(digits.slice(0, 12));
            if (errors.aadhaar || errors.identity) setErrors((prev) => ({ ...prev, aadhaar: undefined, identity: undefined }));
          }
        }
        setActiveListeningField(null);
      },
      onError: () => {
        setActiveListeningField(null);
      },
      onEnd: () => {
        setActiveListeningField(null);
      },
    });

    if (!started) {
      setActiveListeningField(null);
    }
  };

  const formatAbha = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 14);
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    if (digits.length <= 10) return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}-${digits.slice(10, 14)}`;
  };

  // Form Validation & Next Step
  const handleValidateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    const newErrors: {
      name?: string;
      age?: string;
      phone?: string;
      abha?: string;
      aadhaar?: string;
      identity?: string;
    } = {};

    if (!patientName.trim()) {
      newErrors.name = t.pleaseEnterName;
    } else if (/[0-9\u0966-\u096F]/.test(patientName)) {
      newErrors.name = lang === "hi" ? "नाम में संख्याएं नहीं हो सकतीं" : "Name cannot contain numbers";
    }

    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 125 || age.length > 3) {
      newErrors.age = t.pleaseEnterAge;
    }

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      newErrors.phone = t.pleaseEnterPhone;
    }

    const cleanAbha = abhaId.replace(/\D/g, "");
    const cleanAadhaar = aadhaarId.replace(/\D/g, "");

    if (idType === "abha") {
      if (!cleanAbha) {
        newErrors.abha = lang === "hi" ? "कृपया 14 अंकों की आभा आईडी दर्ज करें" : (lang === "en" ? "Please enter 14-digit ABHA ID" : idLabels.abhaInputLabel);
      } else if (cleanAbha.length !== 14) {
        newErrors.abha = lang === "hi" ? "आभा आईडी 14 अंकों की होनी चाहिए" : (lang === "en" ? "ABHA ID must be exactly 14 digits" : idLabels.abhaInputLabel);
      }
    } else {
      if (!cleanAadhaar) {
        newErrors.aadhaar = lang === "hi" ? "कृपया 12 अंकों का आधार नंबर दर्ज करें" : (lang === "en" ? "Please enter 12-digit Aadhaar Number" : idLabels.aadhaarInputLabel);
      } else if (cleanAadhaar.length !== 12) {
        newErrors.aadhaar = lang === "hi" ? "आधार नंबर 12 अंकों का होना चाहिए" : (lang === "en" ? "Aadhaar must be exactly 12 digits" : idLabels.aadhaarInputLabel);
      }
    }

    if (!isVerified) {
      newErrors.identity = lang === "hi" ? "कृपया आगे बढ़ने से पहले पहचान सत्यापित करें" : (lang === "en" ? "Please verify your ID to proceed" : idLabels.verifyModalTitle);
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (voiceGuide) {
        const prompts = VOICE_PROMPTS[lang] || VOICE_PROMPTS.en;
        speakText(prompts.step1, lang);
      }
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    const effectiveAbha = abhaId.trim() || (cleanAadhaar ? `AADHAAR-${cleanAadhaar}` : undefined);
    const strippedAbha = effectiveAbha ? effectiveAbha.replace(/\D/g, "") : "";
    const profile = MOCK_ABHA_DATABASE[strippedAbha];

    onProceed({
      patientName: patientName.trim(),
      age: ageNum,
      gender,
      phone: cleanPhone,
      abhaId: effectiveAbha,
      aadhaarId: cleanAadhaar,
      mockAbhaProfile: profile || undefined,
    });
    setTimeout(() => setIsSubmitting(false), 800);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3 animate-in fade-in duration-300">
      
      <div className="text-center pt-1 pb-0.5 relative">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {lang === "hi" ? "पंजीकरण" : "Registration"}
        </h2>
      </div>

      <form 
        onSubmit={handleValidateAndSubmit} 
        className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 transition-all"
      >
        
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{t.fullName}</span>
            </label>
            {activeListeningField === "name" && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">
                🎙️ {t.listeningVoice}
              </span>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              value={patientName}
              onKeyDown={(e) => {
                if (/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[0-9\u0966-\u096F]/g, "");
                setPatientName(cleaned);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              placeholder={t.fullNamePlaceholder}
              className={`w-full h-10 sm:h-11 pl-3.5 pr-10 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all ${
                errors.name
                  ? "border-red-500 ring-2 ring-red-500/30"
                  : "border-slate-200/80 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
              }`}
            />
            <button
              type="button"
              onClick={() => handleVoiceInput("name")}
              className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                activeListeningField === "name"
                  ? "bg-emerald-600 text-white animate-bounce shadow-lg shadow-emerald-600/40 ring-2 ring-emerald-400"
                  : "bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-300 dark:hover:bg-slate-700"
              }`}
              title={t.voiceInputTooltip}
            >
              {activeListeningField === "name" ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>
          </div>
          {errors.name && (
            <p className="text-[11px] font-bold text-red-500 flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.name}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{t.age}</span>
              </label>
              {activeListeningField === "age" && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">
                  🎙️ {t.listeningVoice}
                </span>
              )}
            </div>
            <div className="relative flex items-center">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={3}
                value={age}
                onKeyDown={(e) => {
                  if (
                    !/[0-9]/.test(e.key) &&
                    !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
                  ) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 3);
                  setAge(val);
                  if (errors.age) setErrors({ ...errors, age: undefined });
                }}
                placeholder={t.agePlaceholder}
                className={`w-full h-10 sm:h-11 pl-3.5 pr-16 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all ${
                  errors.age
                    ? "border-red-500 ring-2 ring-red-500/30"
                    : "border-slate-200/80 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowKeypadFor(showKeypadFor === "age" ? null : "age")}
                className={`absolute right-8 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors ${
                  showKeypadFor === "age" ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50" : ""
                }`}
                title="Virtual Keypad"
              >
                <Keyboard className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleVoiceInput("age")}
                className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                  activeListeningField === "age"
                    ? "bg-emerald-600 text-white animate-bounce shadow-lg shadow-emerald-600/40 ring-2 ring-emerald-400"
                    : "bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-300 dark:hover:bg-slate-700"
                }`}
                title={t.voiceInputTooltip}
              >
                {activeListeningField === "age" ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>
            </div>
            {errors.age && (
              <p className="text-[11px] font-bold text-red-500 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.age}
              </p>
            )}

            {/* Virtual keypad dropdown for Age */}
            {showKeypadFor === "age" && (
              <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg mt-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="grid grid-cols-3 gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        if (age.length < 3) {
                          setAge(age + num.toString());
                        }
                      }}
                      className="h-9 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 font-bold text-sm text-slate-700 dark:text-slate-200 transition-colors"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setAge("")}
                    className="h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-xs hover:bg-slate-200 transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setAge(age.slice(0, -1))}
                    className="h-9 rounded-lg bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-300 font-bold text-xs hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"
                  >
                    ⌫
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <span>{t.gender}</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {["Male", "Female", "Other"].map((g) => {
                const isSelected = gender === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`h-10 sm:h-11 rounded-xl font-semibold text-xs transition-all flex items-center justify-center shadow-sm ${
                      isSelected
                        ? "bg-emerald-600 text-white shadow-emerald-600/20 font-bold"
                        : "bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500"
                    }`}
                  >
                    {t[g.toLowerCase() as "male" | "female" | "other"]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{t.phone}</span>
            </label>
            {activeListeningField === "phone" && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">
                🎙️ {t.listeningVoice}
              </span>
            )}
          </div>
          <div className="relative flex items-center">
            <div className="absolute left-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 font-semibold text-xs">
              <span>+91</span>
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                if (errors.phone) setErrors({ ...errors, phone: undefined });
              }}
              placeholder={t.phonePlaceholder}
              className={`w-full h-10 sm:h-11 pl-12 pr-16 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all tracking-wide ${
                errors.phone
                  ? "border-red-500 ring-2 ring-red-500/30"
                  : "border-slate-200/80 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
              }`}
            />
            <div className="absolute right-1.5 flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setShowKeypadFor(showKeypadFor === "phone" ? null : "phone")}
                className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
                title="Open Keypad"
              >
                <Keyboard className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => handleVoiceInput("phone")}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                  activeListeningField === "phone"
                    ? "bg-emerald-600 text-white animate-bounce shadow-lg shadow-emerald-600/40 ring-2 ring-emerald-400"
                    : "bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-300 dark:hover:bg-slate-700"
                }`}
                title={t.voiceInputTooltip}
              >
                {activeListeningField === "phone" ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
              </button>
            </div>
          </div>
          {errors.phone && (
            <p className="text-[11px] font-bold text-red-500 flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3 h-3" />
              {errors.phone}
            </p>
          )}
          {showKeypadFor === "phone" && (
            <div className="absolute z-20 mt-1 left-0 bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 shadow-2xl">
              <div className="grid grid-cols-3 gap-1.5 w-44">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      if (phone.length < 10) setPhone(phone + num.toString());
                    }}
                    className={`h-9 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-bold text-sm hover:bg-emerald-500 hover:text-white transition-colors ${num === 0 ? "col-span-2" : ""}`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPhone(phone.slice(0, -1))}
                  className="h-9 rounded-lg bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-300 font-bold text-xs hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"
                >
                  ⌫
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Selectable ABHA ID or Aadhaar Option ── */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{idLabels.identityTitle}</span>
          </label>

          {/* Toggle buttons: Select ABHA ID or Aadhaar */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setIdType("abha");
                setAadhaarId("");
                setIsVerified(false);
                if (errors.identity || errors.aadhaar) setErrors((prev) => ({ ...prev, identity: undefined, aadhaar: undefined }));
              }}
              className={`h-10 sm:h-11 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
                idType === "abha"
                  ? "bg-emerald-600 text-white shadow-emerald-600/30 ring-2 ring-emerald-400"
                  : "bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:bg-slate-100"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>{idLabels.abhaTab}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIdType("aadhaar");
                setAbhaId("");
                setIsVerified(false);
                if (errors.identity || errors.abha) setErrors((prev) => ({ ...prev, identity: undefined, abha: undefined }));
              }}
              className={`h-10 sm:h-11 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
                idType === "aadhaar"
                  ? "bg-emerald-600 text-white shadow-emerald-600/30 ring-2 ring-emerald-400"
                  : "bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:bg-slate-100"
              }`}
            >
              <Fingerprint className="w-4 h-4" />
              <span>{idLabels.aadhaarTab}</span>
            </button>
          </div>

          {/* Conditional Input Box based on selected ID */}
          {idType === "abha" && (
            <div className="space-y-1 pt-1 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>{idLabels.abhaInputLabel}</span>
                </label>
                {activeListeningField === "abha" && (
                  <span className="text-[10px] text-emerald-600 font-bold animate-pulse">🎙️ {t.listeningVoice}</span>
                )}
              </div>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={abhaId}
                  onChange={(e) => {
                    setAbhaId(formatAbha(e.target.value));
                    setIsVerified(false);
                    if (errors.abha || errors.identity) setErrors((prev) => ({ ...prev, abha: undefined, identity: undefined }));
                  }}
                  maxLength={17}
                  placeholder="e.g. 14-8890-4432-1102"
                  className={`w-full h-10 sm:h-11 pl-3 pr-28 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all tracking-wide ${
                    errors.abha || errors.identity
                      ? "border-red-500 ring-2 ring-red-500/30"
                      : "border-slate-200/80 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
                  }`}
                />
                
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {isVerified ? (
                    <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-lg text-xs font-bold border border-emerald-300 dark:border-emerald-800 animate-in fade-in">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{idLabels.verifiedBadge}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStartVerification}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-sm active:scale-95 ${
                        abhaId.replace(/\D/g, "").length === 14
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600"
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{idLabels.verifyBtn}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleVoiceInput("abha")}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                      activeListeningField === "abha"
                        ? "bg-emerald-600 text-white animate-bounce shadow-lg shadow-emerald-600/40 ring-2 ring-emerald-400"
                        : "bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-300 dark:hover:bg-slate-700"
                    }`}
                    title={t.voiceInputTooltip}
                  >
                    {activeListeningField === "abha" ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              {errors.abha && (
                <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.abha}
                </p>
              )}
            </div>
          )}

          {idType === "aadhaar" && (
            <div className="space-y-1 pt-1 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Fingerprint className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>{idLabels.aadhaarInputLabel}</span>
                </label>
                {activeListeningField === "aadhaar" && (
                  <span className="text-[10px] text-emerald-600 font-bold animate-pulse">🎙️ {t.listeningVoice}</span>
                )}
              </div>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={aadhaarId}
                  onChange={(e) => {
                    setAadhaarId(e.target.value.replace(/\D/g, "").slice(0, 12));
                    setIsVerified(false);
                    if (errors.aadhaar || errors.identity) setErrors((prev) => ({ ...prev, aadhaar: undefined, identity: undefined }));
                  }}
                  maxLength={12}
                  placeholder={idLabels.aadhaarInputLabel}
                  className={`w-full h-10 sm:h-11 pl-3 pr-28 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all tracking-widest ${
                    errors.aadhaar || errors.identity
                      ? "border-red-500 ring-2 ring-red-500/30"
                      : "border-slate-200/80 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
                  }`}
                />
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {isVerified ? (
                    <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-lg text-xs font-bold border border-emerald-300 dark:border-emerald-800 animate-in fade-in">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{idLabels.verifiedBadge}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStartVerification}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-sm active:scale-95 ${
                        aadhaarId.replace(/\D/g, "").length === 12
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600"
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{idLabels.verifyBtn}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleVoiceInput("aadhaar")}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                      activeListeningField === "aadhaar"
                        ? "bg-emerald-600 text-white animate-bounce shadow-lg shadow-emerald-600/40 ring-2 ring-emerald-400"
                        : "bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-300 dark:hover:bg-slate-700"
                    }`}
                    title={t.voiceInputTooltip}
                  >
                    {activeListeningField === "aadhaar" ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              {errors.aadhaar && (
                <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.aadhaar}
                </p>
              )}
            </div>
          )}

          {errors.identity && (
            <p className="text-xs text-red-500 font-bold mt-1">
              {errors.identity}
            </p>
          )}
        </div>

        {/* Primary Proceed CTA Button - only appears after verification */}
        {isVerified && (
          <div className="pt-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full h-11 py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/20 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 ${
                isSubmitting ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              <span>{t.nextStep}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      {/* ── Verification Modal (Rendered via Portal to cover entire screen edge-to-edge) ── */}
      {mounted && verificationState !== "idle" && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl max-w-sm w-full space-y-4 animate-in zoom-in-95 duration-200">
            {verificationState === "method_select" && (
              <>
                <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {idLabels.verifyModalTitle}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {idType === "abha"
                      ? idLabels.chooseMethodAbha
                      : idLabels.chooseMethodAadhaar}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleSelectMethod("otp")}
                    className="p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-200 transition-all flex flex-col items-center gap-2 group"
                  >
                    <Phone className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                    <span>{idLabels.verifyByOtp}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectMethod("pass")}
                    className="p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-200 transition-all flex flex-col items-center gap-2 group"
                  >
                    <Lock className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                    <span>{idLabels.usePassword}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setVerificationState("idle")}
                  className="w-full text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 pt-1 text-center"
                >
                  {idLabels.cancel}
                </button>
              </>
            )}

            {(verificationState === "awaiting_otp" || verificationState === "awaiting_pass") && (
              <>
                <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  {verificationState === "awaiting_otp" ? <Phone className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {verificationState === "awaiting_otp" 
                      ? idLabels.enterOtpTitle 
                      : idLabels.enterPassTitle}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {verificationState === "awaiting_otp"
                      ? idLabels.enterOtpDesc
                      : idLabels.enterPassDesc}
                  </p>
                </div>

                <div className="space-y-2">
                  <input
                    type={verificationState === "awaiting_otp" ? "text" : "password"}
                    value={verificationState === "awaiting_otp" ? otpInput : passInput}
                    onChange={(e) => {
                      if (verificationState === "awaiting_otp") {
                        setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 4));
                      } else {
                        setPassInput(e.target.value);
                      }
                      setVerifyError("");
                    }}
                    maxLength={verificationState === "awaiting_otp" ? 4 : 30}
                    placeholder={verificationState === "awaiting_otp" ? "1234" : "Password"}
                    className="w-full text-center tracking-widest font-mono text-lg sm:text-xl p-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                    autoFocus
                  />
                  {verifyError && <p className="text-xs text-red-500 text-center font-bold">{verifyError}</p>}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setVerificationState("method_select");
                      setVerifyError("");
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    {idLabels.back}
                  </button>
                  <button
                    type="button"
                    onClick={handleVerifyAuth}
                    disabled={isVerifying}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : idLabels.verifyBtn}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>,
        document.body
      )}

      </form>

    </div>
  );
};
