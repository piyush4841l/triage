"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Check, 
  HelpCircle, 
  Flame, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  X
} from "lucide-react";
import { BodyRegionId, BODY_REGIONS, SubOrgan, SymptomItem } from "@/lib/anatomy-data";
import { Language, translations } from "@/lib/i18n";
import { speakText } from "@/lib/speech";
import { VOICE_PROMPTS } from "@/lib/speech-prompts";

export interface SymptomDrillDownData {
  selectedOrgans: string[];
  selectedSymptoms: string[];
  isDontKnow: boolean;
  painSeverity: number;
  duration: "today" | "few_days" | "more_than_week" | "chronic";
}

interface OrganDrillDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRegions: BodyRegionId[];
  initialData: SymptomDrillDownData;
  onSave: (data: SymptomDrillDownData) => void;
  lang: Language;
  voiceGuide: boolean;
  patientGender?: string;
}

export const OrganDrillDownModal: React.FC<OrganDrillDownModalProps> = ({
  isOpen,
  onClose,
  selectedRegions,
  initialData,
  onSave,
  lang,
  voiceGuide,
  patientGender,
}) => {
  const t = translations[lang];

  const [selectedOrgans, setSelectedOrgans] = useState<string[]>(initialData.selectedOrgans || []);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(initialData.selectedSymptoms || []);
  const [isDontKnow, setIsDontKnow] = useState<boolean>(initialData.isDontKnow || false);
  const [painSeverity, setPainSeverity] = useState<number>(initialData.painSeverity || 5);
  const [duration, setDuration] = useState<"today" | "few_days" | "more_than_week" | "chronic">(
    initialData.duration || "few_days"
  );
  const hasSpokenRef = useRef(false);

  useEffect(() => {
    if (isOpen && voiceGuide && !hasSpokenRef.current) {
      hasSpokenRef.current = true;
      const prompts = VOICE_PROMPTS[lang] || VOICE_PROMPTS.en;
      speakText(prompts.modal, lang);
    }
    if (!isOpen) {
      hasSpokenRef.current = false;
    }
  }, [isOpen, voiceGuide, lang]);

  if (!isOpen) return null;

  const toggleOrgan = (organId: string) => {
    setIsDontKnow(false);
    setSelectedOrgans((prev) =>
      prev.includes(organId) ? prev.filter((id) => id !== organId) : [...prev, organId]
    );
  };

  const toggleSymptom = (symptomId: string) => {
    setIsDontKnow(false);
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId) ? prev.filter((id) => id !== symptomId) : [...prev, symptomId]
    );
  };

  const handleDontKnowToggle = () => {
    const next = !isDontKnow;
    setIsDontKnow(next);
    if (next) {
      setSelectedOrgans([]);
      setSelectedSymptoms([]);
      if (voiceGuide) {
        speakText(
          lang === "hi"
            ? "चिंता न करें, डॉक्टर सामान्य जांच करके आपकी बीमारी का पता लगाएंगे।"
            : "No worries, the consulting physician will perform a comprehensive physical triage examination.",
          lang
        );
      }
    }
  };

  const handleConfirm = () => {
    onSave({
      selectedOrgans,
      selectedSymptoms,
      isDontKnow,
      painSeverity,
      duration,
    });
    onClose();
  };

  const availableOrgans: SubOrgan[] = [];
  const availableSymptoms: SymptomItem[] = [];

  selectedRegions.forEach((regId) => {
    const region = BODY_REGIONS[regId];
    if (region) {
      region.organs.forEach((o) => {
        if (o.genderSpecific && o.genderSpecific !== patientGender) return;
        if (!availableOrgans.some((existing) => existing.id === o.id)) {
          availableOrgans.push(o);
        }
      });
      region.commonSymptoms.forEach((s) => {
        if (s.genderSpecific && s.genderSpecific !== patientGender) return;
        if (!availableSymptoms.some((existing) => existing.id === s.id)) {
          availableSymptoms.push(s);
        }
      });
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl relative text-slate-900 dark:text-white space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-blue-600 dark:text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>{selectedRegions.map((r) => lang === "hi" ? BODY_REGIONS[r]?.nameHi : BODY_REGIONS[r]?.nameEn).join(" • ")}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t.drillDownTitle}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t.drillDownSubtitle}
          </p>
        </div>

        {/* 1. Sub-Organs / Specific Areas */}
        {availableOrgans.length > 0 && (
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200 block">
              {t.selectOrgans}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {availableOrgans.map((organ) => {
                const isSelected = selectedOrgans.includes(organ.id);
                return (
                  <button
                    key={organ.id}
                    type="button"
                    onClick={() => toggleOrgan(organ.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-start space-x-3 ${
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-950/80 border-blue-500 dark:border-cyan-400 ring-2 ring-blue-500/20 text-slate-900 dark:text-white shadow-md"
                        : "bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className="text-2xl">{organ.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {lang === "en" ? organ.nameEn : organ.nameHi}
                        </h4>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {lang === "en" ? organ.descriptionEn : organ.descriptionHi}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. Common Everyday Symptoms */}
        {availableSymptoms.length > 0 && (
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200 block">
              {t.selectSymptoms}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableSymptoms.map((symptom) => {
                const isSelected = selectedSymptoms.includes(symptom.id);
                return (
                  <button
                    key={symptom.id}
                    type="button"
                    onClick={() => toggleSymptom(symptom.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-slate-900 dark:text-white ring-2 ring-emerald-500/20"
                        : "bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className="text-sm font-medium">
                      {lang === "en" ? symptom.nameEn : symptom.nameHi}
                    </span>
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ml-2 ${
                        isSelected
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700"
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5" /> : ""}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Fallback: "I Don't Know / Not Sure" */}
        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-slate-950/90 border border-amber-300 dark:border-amber-500/30">
          <button
            type="button"
            onClick={handleDontKnowToggle}
            className={`w-full text-left flex items-start space-x-3 ${
              isDontKnow ? "text-amber-800 dark:text-amber-300" : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5 ${
                isDontKnow
                  ? "bg-amber-500 text-slate-950"
                  : "bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-500"
              }`}
            >
              {isDontKnow ? <Check className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-amber-900 dark:text-amber-300">
                {t.dontKnowOption}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {t.dontKnowDesc}
              </p>
            </div>
          </button>
        </div>

        {/* 4. Pain Severity Slider (1 to 10) */}
        <div className="space-y-3 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <Flame className={`w-4 h-4 ${painSeverity >= 8 ? "text-red-500" : painSeverity >= 5 ? "text-amber-500" : "text-emerald-500"}`} />
              <span>{t.painSeverity}</span>
            </label>
            <span
              className={`text-sm font-extrabold px-3 py-0.5 rounded-full border ${
                painSeverity >= 8
                  ? "bg-red-100 dark:bg-red-950/80 border-red-300 dark:border-red-500 text-red-700 dark:text-red-300"
                  : painSeverity >= 5
                  ? "bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-500 text-amber-700 dark:text-amber-300"
                  : "bg-emerald-100 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-500 text-emerald-700 dark:text-emerald-300"
              }`}
            >
              {painSeverity} / 10 ({painSeverity >= 8 ? t.severe : painSeverity >= 5 ? t.moderate : t.mild})
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="10"
            value={painSeverity}
            onChange={(e) => setPainSeverity(parseInt(e.target.value, 10))}
            className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-cyan-400"
          />

          <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-bold px-1">
            <span>1 ({t.mild})</span>
            <span>5 ({t.moderate})</span>
            <span>10 ({t.severe})</span>
          </div>
        </div>

        {/* 5. Duration Selector */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <span>{t.duration}</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "today", label: t.today },
              { id: "few_days", label: t.fewDays },
              { id: "more_than_week", label: t.moreThanWeek },
              { id: "chronic", label: t.chronic },
            ].map((dur) => (
              <button
                key={dur.id}
                type="button"
                onClick={() => setDuration(dur.id as any)}
                className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                  duration === dur.id
                    ? "bg-emerald-600 border-emerald-500 text-white shadow-md"
                    : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {dur.label}
              </button>
            ))}
          </div>
        </div>

        {/* Confirm Action */}
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-lg shadow-lg shadow-emerald-600/30 active:scale-95 transition-all flex items-center justify-center space-x-2"
        >
          <span>{t.saveSymptoms}</span>
          <ArrowRight className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
};
