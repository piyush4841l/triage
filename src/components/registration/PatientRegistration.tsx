"use client";

import React, { useState } from "react";
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
  Keyboard
, Loader2 } from "lucide-react";
import { Language, translations } from "@/lib/i18n";
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

  // ABHA Verification Flow States
  const [abhaVerificationState, setAbhaVerificationState] = useState<"idle" | "method_select" | "awaiting_otp" | "awaiting_pass" | "requesting_consent" | "verified">("idle");
  const [authMethod, setAuthMethod] = useState<"otp" | "pass">("otp");
  const [otpInput, setOtpInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleStartVerification = () => {
    if (abhaId.replace(/\D/g, "").length !== 14) {
      setErrors((prev) => ({ ...prev, abha: "Enter full 14 digits first" }));
      return;
    }
    setAbhaVerificationState("method_select");
    speakText(lang === "hi" ? "कृपया सत्यापन विधि चुनें, ओटीपी या पासवर्ड" : "Please select your verification method, Mobile OTP or Password.", lang);
  };

  const handleSelectMethod = (method: "otp" | "pass") => {
    setAuthMethod(method);
    if (method === "otp") {
      setAbhaVerificationState("awaiting_otp");
      speakText(lang === "hi" ? "आपके आधार लिंक मोबाइल नंबर पर एक ओटीपी भेजा गया है।" : "An OTP has been sent to your Aadhaar-linked mobile number. Please enter it.", lang);
    } else {
      setAbhaVerificationState("awaiting_pass");
      speakText(lang === "hi" ? "कृपया अपना ABHA पासवर्ड दर्ज करें।" : "Please enter your ABHA password.", lang);
    }
  };

  const handleVerifyAuth = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setAbhaVerificationState("requesting_consent");
      speakText(lang === "hi" ? "क्या आप अपने पिछले स्वास्थ्य रिकॉर्ड इस अस्पताल के साथ साझा करने की सहमति देते हैं?" : "Do you give consent to share your past health records with this hospital?", lang);
    }, 1500); // Mock network delay
  };

  const handleConsent = (approved: boolean) => {
    if (approved) {
      setAbhaVerificationState("verified");
      speakText(lang === "hi" ? "सत्यापन सफल। आपका विवरण स्वतः भर गया है।" : "Verification successful. Your details have been auto-filled.", lang);
      
      const strippedAbha = abhaId.replace(/\D/g, "");
      const profile = MOCK_ABHA_DATABASE[strippedAbha];
      
      if (profile) {
        setPatientName(profile.name);
        setAge(profile.age.toString());
        setGender(profile.gender);
        setPhone(profile.phone);
      } else {
        // Auto-fill mock data for unknown ABHA
        setPatientName("Rahul Sharma");
        setAge("34");
        setGender("Male");
        setPhone("9876543210");
      }
    } else {
      setAbhaVerificationState("idle");
    }
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
          setPatientName(transcript);
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
    }

    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 125) {
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
        newErrors.abha = lang === "hi" ? "कृपया 14 अंकों का ABHA ID दर्ज करें" : "Please enter 14-digit ABHA ID";
      } else if (cleanAbha.length !== 14) {
        newErrors.abha = lang === "hi" ? "ABHA ID 14 अंकों का होना चाहिए" : "ABHA ID must be exactly 14 digits";
      }
    } else {
      if (!cleanAadhaar) {
        newErrors.aadhaar = lang === "hi" ? "कृपया 12 अंकों का आधार नंबर दर्ज करें" : "Please enter 12-digit Aadhaar Number";
      } else if (cleanAadhaar.length !== 12) {
        newErrors.aadhaar = lang === "hi" ? "आधार नंबर 12 अंकों का होना चाहिए" : "Aadhaar must be exactly 12 digits";
      }
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
              <span className="text-red-500 font-bold">*</span>
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
              onChange={(e) => {
                setPatientName(e.target.value);
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
              <AlertCircle className="w-3 h-3" />
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
                <span className="text-red-500 font-bold">*</span>
              </label>
              {activeListeningField === "age" && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">
                  🎙️ {t.listeningVoice}
                </span>
              )}
            </div>
            <div className="relative flex items-center">
              <input
                type="number"
                value={age}
                onChange={(e) => {
                  setAge(e.target.value);
                  if (errors.age) setErrors({ ...errors, age: undefined });
                }}
                placeholder={t.agePlaceholder}
                className={`w-full h-10 sm:h-11 pl-3.5 pr-16 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all ${
                  errors.age
                    ? "border-red-500 ring-2 ring-red-500/30"
                    : "border-slate-200/80 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
                }`}
              />
              <div className="absolute right-1.5 flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setShowKeypadFor(showKeypadFor === "age" ? null : "age")}
                  className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
                  title="Open Keypad"
                >
                  <Keyboard className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleVoiceInput("age")}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                    activeListeningField === "age"
                      ? "bg-emerald-600 text-white animate-bounce shadow-lg shadow-emerald-600/40 ring-2 ring-emerald-400"
                      : "bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-300 dark:hover:bg-slate-700"
                  }`}
                  title={t.voiceInputTooltip}
                >
                  {activeListeningField === "age" ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                </button>
              </div>
            </div>
            {errors.age && (
              <p className="text-[11px] font-bold text-red-500 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3" />
                {errors.age}
              </p>
            )}
            {showKeypadFor === "age" && (
              <div className="absolute z-20 mt-1 left-0 bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 shadow-2xl">
                <div className="grid grid-cols-3 gap-1.5 w-44">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        if (age.length < 3) setAge(age + num.toString());
                      }}
                      className={`h-9 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-bold text-sm hover:bg-emerald-500 hover:text-white transition-colors ${num === 0 ? "col-span-2" : ""}`}
                    >
                      {num}
                    </button>
                  ))}
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
              <span className="text-red-500 font-bold">*</span>
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
              <span className="text-red-500 font-bold">*</span>
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
            <span>{lang === "hi" ? "पहचान पत्र (ABHA / आधार)" : "Identity Verification (ABHA / Aadhaar)"}</span>
            <span className="text-red-500 font-bold">*</span>
          </label>

          {/* Toggle buttons: Select ABHA ID or Aadhaar */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setIdType("abha");
                setAadhaarId("");
                if (errors.identity || errors.aadhaar) setErrors((prev) => ({ ...prev, identity: undefined, aadhaar: undefined }));
              }}
              className={`h-10 sm:h-11 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
                idType === "abha"
                  ? "bg-emerald-600 text-white shadow-emerald-600/30 ring-2 ring-emerald-400"
                  : "bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:bg-slate-100"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>{lang === "hi" ? "आभा आईडी (ABHA ID)" : "ABHA ID"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIdType("aadhaar");
                setAbhaId("");
                if (errors.identity || errors.abha) setErrors((prev) => ({ ...prev, identity: undefined, abha: undefined }));
              }}
              className={`h-10 sm:h-11 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
                idType === "aadhaar"
                  ? "bg-emerald-600 text-white shadow-emerald-600/30 ring-2 ring-emerald-400"
                  : "bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:bg-slate-100"
              }`}
            >
              <Fingerprint className="w-4 h-4" />
              <span>{lang === "hi" ? "आधार नंबर (Aadhaar)" : "Aadhaar Number"}</span>
            </button>
          </div>

          {/* Conditional Input Box based on selected ID */}
          {idType === "abha" && (
            <div className="space-y-1 pt-1 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>{lang === "hi" ? "आभा आईडी (14 अंक)" : "ABHA ID (14 digits)"}</span>
                  <span className="text-red-500 font-bold">*</span>
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
                    if (errors.abha || errors.identity) setErrors((prev) => ({ ...prev, abha: undefined, identity: undefined }));
                  }}
                  maxLength={17}
                  placeholder="e.g. 14-8890-4432-1102"
                  className={`w-full h-10 sm:h-11 pl-3 pr-[80px] rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all tracking-wide ${
                    errors.abha || errors.identity
                      ? "border-red-500 ring-2 ring-red-500/30"
                      : "border-slate-200/80 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
                  }`}
                  disabled={abhaVerificationState === "verified"}
                />
                
                {abhaVerificationState === "verified" ? (
                  <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md text-[10px] font-bold">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleStartVerification}
                    className="absolute right-10 top-1/2 -translate-y-1/2 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold px-2 py-1.5 rounded-lg transition-colors"
                  >
                    Verify
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleVoiceInput("abha")}
                  className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                    activeListeningField === "abha"
                      ? "bg-emerald-600 text-white animate-bounce shadow-lg shadow-emerald-600/40 ring-2 ring-emerald-400"
                      : "bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-300 dark:hover:bg-slate-700"
                  }`}
                  title={t.voiceInputTooltip}
                >
                  {activeListeningField === "abha" ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                </button>
              </div>
              {errors.abha && (
                <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" /> {errors.abha}
                </p>
              )}
            </div>
          )}

          {idType === "aadhaar" && (
            <div className="space-y-1 pt-1 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Fingerprint className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>{lang === "hi" ? "आधार नंबर (12 अंक)" : "Aadhaar Number (12 digits)"}</span>
                  <span className="text-red-500 font-bold">*</span>
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
                    if (errors.aadhaar || errors.identity) setErrors((prev) => ({ ...prev, aadhaar: undefined, identity: undefined }));
                  }}
                  maxLength={12}
                  placeholder="12-digit Aadhaar"
                  className={`w-full h-10 sm:h-11 pl-3 pr-10 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all tracking-widest ${
                    errors.aadhaar || errors.identity
                      ? "border-red-500 ring-2 ring-red-500/30"
                      : "border-slate-200/80 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => handleVoiceInput("aadhaar")}
                  className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                    activeListeningField === "aadhaar"
                      ? "bg-emerald-600 text-white animate-bounce shadow-lg shadow-emerald-600/40 ring-2 ring-emerald-400"
                      : "bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-300 dark:hover:bg-slate-700"
                  }`}
                  title={t.voiceInputTooltip}
                >
                  {activeListeningField === "aadhaar" ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                </button>
              </div>
              {errors.aadhaar && (
                <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" /> {errors.aadhaar}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Primary Proceed CTA Button */}
        <div className="pt-1">
          <button
            type="submit"
            className="w-full h-11 py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/20 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
          >
            <span>{t.nextStep}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>


      {/* ABHA Verification Modals */}
      {abhaVerificationState !== "idle" && abhaVerificationState !== "verified" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl max-w-sm w-full border border-slate-200 dark:border-slate-800 space-y-4">
            
            {abhaVerificationState === "method_select" && (
              <>
                <h3 className="text-lg font-black text-slate-900 dark:text-white text-center">Verify Identity</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center">Select authentication method for ABHA ID.</p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button onClick={() => handleSelectMethod("otp")} className="p-3 border rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-500 font-bold text-sm text-slate-700 dark:text-slate-200 transition-all">Mobile OTP</button>
                  <button onClick={() => handleSelectMethod("pass")} className="p-3 border rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-500 font-bold text-sm text-slate-700 dark:text-slate-200 transition-all">Password</button>
                </div>
                <button onClick={() => setAbhaVerificationState("idle")} className="w-full text-xs text-slate-400 hover:text-slate-600 pt-2">Cancel</button>
              </>
            )}

            {(abhaVerificationState === "awaiting_otp" || abhaVerificationState === "awaiting_pass") && (
              <>
                <h3 className="text-lg font-black text-slate-900 dark:text-white text-center">
                  {abhaVerificationState === "awaiting_otp" ? "Enter OTP" : "Enter Password"}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                  {abhaVerificationState === "awaiting_otp" 
                    ? "An OTP was sent to your registered mobile." 
                    : "Enter your secure ABHA password."}
                </p>
                <input 
                  type={abhaVerificationState === "awaiting_otp" ? "text" : "password"}
                  value={abhaVerificationState === "awaiting_otp" ? otpInput : passInput}
                  onChange={(e) => abhaVerificationState === "awaiting_otp" ? setOtpInput(e.target.value) : setPassInput(e.target.value)}
                  placeholder={abhaVerificationState === "awaiting_otp" ? "123456" : "Password"}
                  className="w-full text-center tracking-widest font-mono text-xl p-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setAbhaVerificationState("method_select")} className="flex-1 p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 transition-colors">Back</button>
                  <button onClick={handleVerifyAuth} disabled={isVerifying} className="flex-1 p-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center">
                    {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify"}
                  </button>
                </div>
              </>
            )}

            {abhaVerificationState === "requesting_consent" && (
              <>
                <h3 className="text-lg font-black text-slate-900 dark:text-white text-center">Data Sharing Consent</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center">Do you give consent to share your ABHA profile and health records with this hospital?</p>
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-xs text-slate-600 dark:text-slate-300 space-y-1 border dark:border-slate-700">
                  <div className="flex justify-between"><span>Profile:</span> <strong>Name, Age, Gender</strong></div>
                  <div className="flex justify-between"><span>Records:</span> <strong>Past prescriptions & labs</strong></div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => handleConsent(false)} className="flex-1 p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors">Deny</button>
                  <button onClick={() => handleConsent(true)} className="flex-1 p-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors">I Consent</button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      </form>

    </div>
  );
};
