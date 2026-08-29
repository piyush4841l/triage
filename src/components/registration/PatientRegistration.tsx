"use client";

import React, { useState } from "react";
import { 
  User, 
  Calendar, 
  Phone, 
  CreditCard, 
  Mic, 
  MicOff, 
  ArrowRight, 
  Sparkles, 
  AlertCircle,
  Keyboard,
  AlertOctagon,
  HeartPulse,
  Wind,
  Flame,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Ambulance
} from "lucide-react";
import { Language, translations } from "@/lib/i18n";
import { speakText, globalSpeechRecognizer } from "@/lib/speech";
import { VOICE_PROMPTS } from "@/lib/speech-prompts";
import { VirtualKeypad } from "@/components/kiosk/VirtualKeypad";
import { computeTriage } from "@/lib/triage";
import { addToken, StoredToken } from "@/lib/store";

export interface PatientRegistrationData {
  patientName: string;
  age: number;
  gender: string;
  phone: string;
  abhaId?: string;
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
  onEmergencyTokenGenerated,
  lang,
  voiceGuide,
}) => {
  const t = translations[lang] || translations.en;

  // Standard Registration Form State
  const [patientName, setPatientName] = useState(initialData?.patientName || "");
  const [age, setAge] = useState(initialData?.age ? initialData.age.toString() : "");
  const [gender, setGender] = useState(initialData?.gender || "Male");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [abhaId, setAbhaId] = useState(initialData?.abhaId || "");

  const [errors, setErrors] = useState<{ name?: string; age?: string; phone?: string; abha?: string }>({});
  const [activeListeningField, setActiveListeningField] = useState<string | null>(null);
  const [showKeypadFor, setShowKeypadFor] = useState<"phone" | "age" | null>(null);

  // Emergency Station State with 4 patient details & Accident condition
  const [selectedEmergencyCondition, setSelectedEmergencyCondition] = useState<"cardiac" | "breathing" | "accident" | "fever_trauma">("cardiac");
  const [emergencyPatientName, setEmergencyPatientName] = useState("");
  const [emergencyAbhaId, setEmergencyAbhaId] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyAbhaPassword, setEmergencyAbhaPassword] = useState("");
  const [isListeningEmergencyPhone, setIsListeningEmergencyPhone] = useState(false);
  const [isDispatchingEmergency, setIsDispatchingEmergency] = useState(false);

  // Quick Demo Profiles
  const loadDemoRamesh = () => {
    setPatientName("Ramesh Kumar");
    setAge("48");
    setGender("Male");
    setPhone("9876543210");
    setAbhaId("14-8890-4432-1102");
    setErrors({});
  };

  const loadDemoSunita = () => {
    setPatientName("Sunita Devi");
    setAge("36");
    setGender("Female");
    setPhone("9123456780");
    setAbhaId("91-4521-8890-1234");
    setErrors({});
  };

  // Handle Speech-to-Text Voice Dictation for inputs
  const handleVoiceInput = (field: "name" | "age" | "phone" | "abha") => {
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
        } else if (field === "age") {
          const numbers = transcript.match(/\d+/g);
          if (numbers) setAge(numbers[0]);
        } else if (field === "phone") {
          const numbers = transcript.replace(/\D/g, "");
          if (numbers.length >= 10) setPhone(numbers.slice(-10));
          else if (numbers.length > 0) setPhone(numbers);
        } else if (field === "abha") {
          setAbhaId(transcript.toUpperCase().replace(/\s+/g, ""));
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

  // Emergency Phone Voice Dictation
  const handleEmergencyMicPhone = () => {
    if (isListeningEmergencyPhone) {
      globalSpeechRecognizer.stopListening();
      setIsListeningEmergencyPhone(false);
      return;
    }

    setIsListeningEmergencyPhone(true);
    globalSpeechRecognizer.startListening({
      lang,
      onResult: (transcript) => {
        const digits = transcript.replace(/\D/g, "");
        if (digits.length > 0) {
          setEmergencyPhone(digits.slice(0, 10));
        } else {
          setEmergencyPhone(transcript);
        }
        setIsListeningEmergencyPhone(false);
      },
      onError: () => setIsListeningEmergencyPhone(false),
      onEnd: () => setIsListeningEmergencyPhone(false),
    });
  };

  // Form Validation & Next Step (ABHA / Aadhaar is compulsory)
  const handleValidateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; age?: string; phone?: string; abha?: string } = {};

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

    if (!abhaId.trim()) {
      newErrors.abha = t.pleaseEnterAbha || "Please enter ABHA Health ID or Aadhaar";
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
    onProceed({
      patientName: patientName.trim(),
      age: ageNum,
      gender,
      phone: cleanPhone,
      abhaId: abhaId.trim(),
    });
  };

  // Emergency Direct Dispatch Execution
  const handleDispatchEmergencyToken = () => {
    setIsDispatchingEmergency(true);

    const effectiveName = emergencyPatientName.trim() || patientName.trim() || (lang === "en" ? "Emergency Patient" : "आपातकालीन मरीज");
    const effectivePhone = emergencyPhone.trim() || phone.trim() || "9999999999";
    const effectiveAbha = emergencyAbhaId.trim() || abhaId.trim() || undefined;

    const triageResult = computeTriage({
      patientName: effectiveName,
      age: parseInt(age, 10) || 45,
      gender: gender || "Male",
      phone: effectivePhone,
      abhaId: effectiveAbha,
      selectedRegions: selectedEmergencyCondition === "cardiac" || selectedEmergencyCondition === "breathing" ? ["chest"] : selectedEmergencyCondition === "accident" ? ["pelvis", "legs_joints"] : ["head_neck"],
      selectedOrgans: selectedEmergencyCondition === "cardiac" ? ["heart"] : selectedEmergencyCondition === "breathing" ? ["lungs"] : selectedEmergencyCondition === "accident" ? ["hip_joint", "knee_joint"] : ["forehead_brain"],
      selectedSymptoms: selectedEmergencyCondition === "cardiac" ? ["chest_pressure_severe"] : selectedEmergencyCondition === "breathing" ? ["breathlessness"] : selectedEmergencyCondition === "accident" ? ["joint_swelling"] : ["high_fever_chills"],
      isDontKnow: false,
      painSeverity: 10,
      duration: "today",
      isEmergencyOverride: true,
      emergencyConditionType: selectedEmergencyCondition,
    });

    const newStoredToken: StoredToken = {
      id: triageResult.tokenId,
      result: triageResult,
      input: {
        patientName: effectiveName,
        age: parseInt(age, 10) || 45,
        gender: gender || "Male",
        phone: effectivePhone,
        abhaId: effectiveAbha,
        selectedRegions: ["chest"],
        selectedOrgans: [],
        selectedSymptoms: [],
        isDontKnow: false,
        painSeverity: 10,
        duration: "today",
        isEmergencyOverride: true,
        emergencyConditionType: selectedEmergencyCondition,
      },
      status: "WAITING",
      createdAt: new Date().toISOString(),
    };

    addToken(newStoredToken);

    if (voiceGuide) {
      const prompts = VOICE_PROMPTS[lang] || VOICE_PROMPTS.en;
      speakText(prompts.emergencyIssued(triageResult.tokenNumber), lang);
    }

    setTimeout(() => {
      setIsDispatchingEmergency(false);
      if (onEmergencyTokenGenerated) {
        onEmergencyTokenGenerated(newStoredToken);
      }
    }, 500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      
      {/* 1. Header Information & Quick Demo Card */}
      <div className="bg-white/95 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-3 relative overflow-hidden transition-colors">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {t.step1Title}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto font-medium">
          {t.step1Subtitle}
        </p>

        {/* Demo Quick Fill Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center font-bold mr-1">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />
            {t.quickFillDemo}:
          </span>
          <button
            type="button"
            onClick={loadDemoRamesh}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 text-xs font-bold text-emerald-700 dark:text-emerald-300 transition-all shadow-sm"
          >
            👨‍💼 {t.demoPatientChest}
          </button>
          <button
            type="button"
            onClick={loadDemoSunita}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/60 border border-slate-200 dark:border-slate-700 hover:border-teal-300 text-xs font-bold text-teal-700 dark:text-teal-300 transition-all shadow-sm"
          >
            👩‍💼 {t.demoPatientStomach}
          </button>
        </div>
      </div>

      {/* 2. Patient Registration Form Container */}
      <form onSubmit={handleValidateAndSubmit} className="bg-white/95 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 transition-colors">
        
        {/* Full Name */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
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
              className={`w-full h-14 pl-4 pr-14 rounded-2xl bg-slate-50 dark:bg-slate-950/90 border text-base sm:text-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all ${
                errors.name
                  ? "border-red-500 ring-2 ring-red-500/30"
                  : "border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
              }`}
            />
            <button
              type="button"
              onClick={() => handleVoiceInput("name")}
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                activeListeningField === "name"
                  ? "bg-emerald-600 text-white animate-bounce shadow-lg shadow-emerald-600/40 ring-2 ring-emerald-400"
                  : "bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-300 dark:hover:bg-slate-700"
              }`}
              title={t.voiceInputTooltip}
            >
              {activeListeningField === "name" ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          </div>
          {errors.name && (
            <p className="text-xs font-bold text-red-500 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Age and Gender Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Age */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
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
                min="1"
                max="125"
                value={age}
                onChange={(e) => {
                  setAge(e.target.value);
                  if (errors.age) setErrors({ ...errors, age: undefined });
                }}
                placeholder={t.agePlaceholder}
                className={`w-full h-14 pl-4 pr-24 rounded-2xl bg-slate-50 dark:bg-slate-950/90 border text-base sm:text-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all ${
                  errors.age
                    ? "border-red-500 ring-2 ring-red-500/30"
                    : "border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                }`}
              />
              <div className="absolute right-2 flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setShowKeypadFor(showKeypadFor === "age" ? null : "age")}
                  className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
                  title="Open Keypad"
                >
                  <Keyboard className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleVoiceInput("age")}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    activeListeningField === "age"
                      ? "bg-emerald-600 text-white animate-bounce shadow-lg shadow-emerald-600/40 ring-2 ring-emerald-400"
                      : "bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-300 dark:hover:bg-slate-700"
                  }`}
                  title={t.voiceInputTooltip}
                >
                  {activeListeningField === "age" ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {errors.age && (
              <p className="text-xs font-bold text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.age}
              </p>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="text-sm font-extrabold text-slate-800 dark:text-slate-200 block">
              {t.gender}
            </label>
            <div className="grid grid-cols-3 gap-2 h-14">
              {["Male", "Female", "Other"].map((g) => {
                const label = g === "Male" ? t.male : g === "Female" ? t.female : t.other;
                const isSelected = gender === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`rounded-2xl border font-extrabold text-sm sm:text-base transition-all flex items-center justify-center ${
                      isSelected
                        ? "bg-gradient-to-r from-emerald-600 to-teal-500 border-transparent text-white shadow-md shadow-emerald-500/25"
                        : "bg-slate-100 dark:bg-slate-950/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Mobile Number */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
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
            <div className="absolute left-4 text-slate-500 dark:text-slate-400 font-black text-base select-none">
              +91
            </div>
            <input
              type="tel"
              maxLength={10}
              value={phone}
              onChange={(e) => {
                const clean = e.target.value.replace(/\D/g, "").slice(0, 10);
                setPhone(clean);
                if (errors.phone) setErrors({ ...errors, phone: undefined });
              }}
              placeholder={t.phonePlaceholder}
              className={`w-full h-14 pl-14 pr-24 rounded-2xl bg-slate-50 dark:bg-slate-950/90 border text-base sm:text-lg tracking-wider text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all ${
                errors.phone
                  ? "border-red-500 ring-2 ring-red-500/30"
                  : "border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
              }`}
            />
            <div className="absolute right-2 flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setShowKeypadFor(showKeypadFor === "phone" ? null : "phone")}
                className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
                title="Open Keypad"
              >
                <Keyboard className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleVoiceInput("phone")}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  activeListeningField === "phone"
                    ? "bg-emerald-600 text-white animate-bounce shadow-lg shadow-emerald-600/40 ring-2 ring-emerald-400"
                    : "bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-300 dark:hover:bg-slate-700"
                }`}
                title={t.voiceInputTooltip}
              >
                {activeListeningField === "phone" ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {errors.phone && (
            <p className="text-xs font-bold text-red-500 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.phone}
            </p>
          )}
        </div>

        {/* ABHA ID / Aadhaar (Now Compulsory) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t.abhaId}</span>
              <span className="text-red-500 font-bold">*</span>
            </label>
            {activeListeningField === "abha" && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">
                🎙️ {t.listeningVoice}
              </span>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              value={abhaId}
              onChange={(e) => {
                setAbhaId(e.target.value);
                if (errors.abha) setErrors({ ...errors, abha: undefined });
              }}
              placeholder={t.abhaIdPlaceholder}
              className={`w-full h-14 pl-4 pr-14 rounded-2xl bg-slate-50 dark:bg-slate-950/90 border text-base sm:text-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all ${
                errors.abha
                  ? "border-red-500 ring-2 ring-red-500/30"
                  : "border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
              }`}
            />
            <button
              type="button"
              onClick={() => handleVoiceInput("abha")}
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                activeListeningField === "abha"
                  ? "bg-emerald-600 text-white animate-bounce shadow-lg shadow-emerald-600/40 ring-2 ring-emerald-400"
                  : "bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-300 dark:hover:bg-slate-700"
              }`}
              title={t.voiceInputTooltip}
            >
              {activeListeningField === "abha" ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
          {errors.abha && (
            <p className="text-xs font-bold text-red-500 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.abha}
            </p>
          )}
        </div>

        {/* Virtual Keypad Drawer (if open) */}
        {showKeypadFor && (
          <div className="pt-2 animate-in fade-in zoom-in-95 duration-150">
            <VirtualKeypad
              onKeyPress={(digit) => {
                if (showKeypadFor === "phone") {
                  if (phone.length < 10) setPhone(phone + digit);
                } else if (showKeypadFor === "age") {
                  if (age.length < 3) setAge(age + digit);
                }
              }}
              onDelete={() => {
                if (showKeypadFor === "phone") setPhone(phone.slice(0, -1));
                else if (showKeypadFor === "age") setAge(age.slice(0, -1));
              }}
              onClear={() => {
                if (showKeypadFor === "phone") setPhone("");
                else if (showKeypadFor === "age") setAge("");
              }}
              onDone={() => setShowKeypadFor(null)}
            />
          </div>
        )}

        {/* Submit / Next Step CTA */}
        <button
          type="submit"
          className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-lg sm:text-xl shadow-lg shadow-emerald-600/30 active:scale-[0.98] transition-all flex items-center justify-center space-x-3"
        >
          <span>{t.nextStep}</span>
          <ArrowRight className="w-6 h-6" />
        </button>

      </form>



    </div>
  );
};
