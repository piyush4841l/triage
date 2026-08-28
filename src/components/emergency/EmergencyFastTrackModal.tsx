"use client";

import React, { useState } from "react";
import { 
  AlertOctagon, 
  HeartPulse, 
  Wind, 
  Flame, 
  Mic, 
  MicOff, 
  CheckCircle2, 
  ArrowRight, 
  X,
  ShieldAlert,
  User,
  CreditCard,
  Phone,
  Lock,
  Ambulance
} from "lucide-react";
import { Language, translations } from "@/lib/i18n";
import { computeTriage } from "@/lib/triage";
import { addToken, StoredToken } from "@/lib/store";
import { globalSpeechRecognizer, speakText } from "@/lib/speech";
import { VOICE_PROMPTS } from "@/lib/speech-prompts";

interface EmergencyFastTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  voiceGuide: boolean;
  onTokenGenerated: (token: StoredToken) => void;
}

export const EmergencyFastTrackModal: React.FC<EmergencyFastTrackModalProps> = ({
  isOpen,
  onClose,
  lang,
  voiceGuide,
  onTokenGenerated,
}) => {
  const t = translations[lang] || translations.en;
  const [selectedCondition, setSelectedCondition] = useState<"cardiac" | "breathing" | "accident" | "fever_trauma">("cardiac");
  const [patientName, setPatientName] = useState("");
  const [abhaId, setAbhaId] = useState("");
  const [phone, setPhone] = useState("");
  const [abhaPassword, setAbhaPassword] = useState("");
  const [isListeningPhone, setIsListeningPhone] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleMicPhone = () => {
    if (isListeningPhone) {
      globalSpeechRecognizer.stopListening();
      setIsListeningPhone(false);
      return;
    }

    setIsListeningPhone(true);
    globalSpeechRecognizer.startListening({
      lang,
      onResult: (transcript) => {
        const digits = transcript.replace(/\D/g, "");
        if (digits.length > 0) {
          setPhone(digits.slice(0, 10));
        } else {
          setPhone(transcript);
        }
        setIsListeningPhone(false);
      },
      onError: () => setIsListeningPhone(false),
      onEnd: () => setIsListeningPhone(false),
    });
  };

  const handleGenerateEmergencyToken = () => {
    setIsGenerating(true);

    const effectivePhone = phone.trim() || "9999999999";
    const effectiveName = patientName.trim() || (lang === "hi" ? "आपातकालीन मरीज" : "Emergency Patient");
    const effectiveAbha = abhaId.trim() || undefined;

    const triageResult = computeTriage({
      patientName: effectiveName,
      age: 45,
      gender: "Male",
      phone: effectivePhone,
      abhaId: effectiveAbha,
      selectedRegions: selectedCondition === "cardiac" || selectedCondition === "breathing" ? ["chest"] : selectedCondition === "accident" ? ["pelvis", "legs_joints"] : ["head_neck"],
      selectedOrgans: selectedCondition === "cardiac" ? ["heart"] : selectedCondition === "breathing" ? ["lungs"] : selectedCondition === "accident" ? ["hip_joint", "knee_joint"] : ["forehead_brain"],
      selectedSymptoms: selectedCondition === "cardiac" ? ["chest_pressure_severe"] : selectedCondition === "breathing" ? ["breathlessness"] : selectedCondition === "accident" ? ["joint_swelling"] : ["high_fever_chills"],
      isDontKnow: false,
      painSeverity: 10,
      duration: "today",
      isEmergencyOverride: true,
      emergencyConditionType: selectedCondition,
    });

    const newStoredToken: StoredToken = {
      id: triageResult.tokenId,
      result: triageResult,
      input: {
        patientName: effectiveName,
        age: 45,
        gender: "Male",
        phone: effectivePhone,
        abhaId: effectiveAbha,
        selectedRegions: ["chest"],
        selectedOrgans: [],
        selectedSymptoms: [],
        isDontKnow: false,
        painSeverity: 10,
        duration: "today",
        isEmergencyOverride: true,
        emergencyConditionType: selectedCondition,
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
      setIsGenerating(false);
      onTokenGenerated(newStoredToken);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-900 dark:to-red-950/50 border-2 border-red-500 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative text-slate-900 dark:text-white space-y-6">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Emergency Header */}
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-600/20 border-2 border-red-500 flex items-center justify-center animate-pulse">
            <AlertOctagon className="w-8 h-8 text-red-600 dark:text-red-500" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-red-600 dark:text-red-400 tracking-tight flex items-center gap-2">
              <span>{t.emergencyModalTitle}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
              {t.emergencyModalSubtitle}
            </p>
          </div>
        </div>

        {/* Critical Condition Selector (4 Conditions) */}
        <div className="space-y-3">
          <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-red-700 dark:text-red-300">
            {t.criticalConditions}
          </label>

          <div className="grid grid-cols-1 gap-2.5">
            
            {/* Condition 1: Cardiac */}
            <button
              type="button"
              onClick={() => setSelectedCondition("cardiac")}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-start space-x-3.5 ${
                selectedCondition === "cardiac"
                  ? "bg-red-50 dark:bg-red-950/80 border-red-500 ring-2 ring-red-500/30 shadow-md"
                  : "bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-red-300"
              }`}
            >
              <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-600/20 border border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-400 mt-0.5">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">{t.conditionCardiac}</h4>
                  {selectedCondition === "cardiac" && (
                    <CheckCircle2 className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{t.conditionCardiacDesc}</p>
              </div>
            </button>

            {/* Condition 2: Breathing */}
            <button
              type="button"
              onClick={() => setSelectedCondition("breathing")}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-start space-x-3.5 ${
                selectedCondition === "breathing"
                  ? "bg-red-50 dark:bg-red-950/80 border-red-500 ring-2 ring-red-500/30 shadow-md"
                  : "bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-red-300"
              }`}
            >
              <div className="p-2.5 rounded-xl bg-cyan-100 dark:bg-cyan-600/20 border border-cyan-300 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-400 mt-0.5">
                <Wind className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">{t.conditionBreathing}</h4>
                  {selectedCondition === "breathing" && (
                    <CheckCircle2 className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{t.conditionBreathingDesc}</p>
              </div>
            </button>

            {/* Condition 3: Accident / Road Collision */}
            <button
              type="button"
              onClick={() => setSelectedCondition("accident")}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-start space-x-3.5 ${
                selectedCondition === "accident"
                  ? "bg-red-50 dark:bg-red-950/80 border-red-500 ring-2 ring-red-500/30 shadow-md"
                  : "bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-red-300"
              }`}
            >
              <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-600/20 border border-rose-300 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 mt-0.5">
                <Ambulance className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">{t.conditionAccident}</h4>
                  {selectedCondition === "accident" && (
                    <CheckCircle2 className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{t.conditionAccidentDesc}</p>
              </div>
            </button>

            {/* Condition 4: Fever / Trauma */}
            <button
              type="button"
              onClick={() => setSelectedCondition("fever_trauma")}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-start space-x-3.5 ${
                selectedCondition === "fever_trauma"
                  ? "bg-red-50 dark:bg-red-950/80 border-red-500 ring-2 ring-red-500/30 shadow-md"
                  : "bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-red-300"
              }`}
            >
              <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-600/20 border border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 mt-0.5">
                <Flame className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">{t.conditionFeverTrauma}</h4>
                  {selectedCondition === "fever_trauma" && (
                    <CheckCircle2 className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{t.conditionFeverTraumaDesc}</p>
              </div>
            </button>

          </div>
        </div>

        {/* 4 Patient Details in Emergency Section */}
        <div className="space-y-3 pt-1">
          <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-red-700 dark:text-red-400 block">
            Emergency Patient Details
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* 1. Full Name */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1">
                <User className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                <span>{t.fullName}</span>
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-red-500 focus:outline-none"
              />
            </div>

            {/* 2. ABHA ID / Aadhaar */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1">
                <CreditCard className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                <span>{t.abhaId}</span>
              </label>
              <input
                type="text"
                value={abhaId}
                onChange={(e) => setAbhaId(e.target.value)}
                placeholder="14-digit ABHA ID or Aadhaar"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-red-500 focus:outline-none"
              />
            </div>

            {/* 3. Mobile No. */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1">
                <Phone className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                <span>{t.phone}</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit Mobile No."
                  className="w-full h-11 pl-3.5 pr-10 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-red-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleMicPhone}
                  className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
                    isListeningPhone
                      ? "bg-red-600 text-white animate-pulse"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                  title="Speak Phone Number"
                >
                  {isListeningPhone ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* 4. ABHA Password / PIN */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1">
                <Lock className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                <span>{t.abhaPassword}</span>
              </label>
              <input
                type="password"
                value={abhaPassword}
                onChange={(e) => setAbhaPassword(e.target.value)}
                placeholder={t.abhaPasswordPlaceholder}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-red-500 focus:outline-none"
              />
            </div>

          </div>
        </div>

        {/* Warning Note */}
        <div className="flex items-start space-x-2.5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 text-xs text-red-800 dark:text-red-200">
          <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p>{t.emergencyWarning}</p>
        </div>

        {/* Generate Token CTA */}
        <button
          type="button"
          onClick={handleGenerateEmergencyToken}
          disabled={isGenerating}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-lg shadow-lg shadow-red-500/30 active:scale-95 transition-all flex items-center justify-center space-x-3"
        >
          <span>{isGenerating ? "Dispatching Token..." : t.generateEmergencyToken}</span>
          <ArrowRight className="w-6 h-6" />
        </button>

      </div>
    </div>
  );
};
