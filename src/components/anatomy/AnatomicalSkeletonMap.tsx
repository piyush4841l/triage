"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Check, 
  RotateCw, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  X, 
  HelpCircle,
  Flame,
  Clock,
  Layers
} from "lucide-react";
import { BodyRegionId, BODY_REGIONS, SubOrgan, SymptomItem } from "@/lib/anatomy-data";
import { Language, translations } from "@/lib/i18n";
import { speakText } from "@/lib/speech";
import { VOICE_PROMPTS } from "@/lib/speech-prompts";
import { SymptomDrillDownData } from "@/components/anatomy/OrganDrillDownModal";

interface AnatomicalSkeletonMapProps {
  selectedRegions: BodyRegionId[];
  onToggleRegion: (regionId: BodyRegionId) => void;
  onClearRegions: () => void;
  symptomData: SymptomDrillDownData;
  onUpdateSymptomData: (data: SymptomDrillDownData) => void;
  onProceedToNextStep: (data: SymptomDrillDownData) => void;
  onBack?: () => void;
  lang: Language;
  voiceGuide: boolean;
}

export const AnatomicalSkeletonMap: React.FC<AnatomicalSkeletonMapProps> = ({
  selectedRegions,
  onToggleRegion,
  onClearRegions,
  symptomData,
  onUpdateSymptomData,
  onProceedToNextStep,
  onBack,
  lang,
  voiceGuide,
}) => {
  const t = translations[lang] || translations.en;
  const [view, setView] = useState<"front" | "back">("front");
  const [hoveredRegion, setHoveredRegion] = useState<BodyRegionId | null>(null);
  const [subStep, setSubStep] = useState<"map" | "organs" | "symptoms" | "discomfort">(() => {
    if (selectedRegions.length > 0) {
      return "discomfort";
    }
    return "map";
  });

  // Symptom details local state synced with symptomData
  const [selectedOrgans, setSelectedOrgans] = useState<string[]>(symptomData.selectedOrgans || []);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(symptomData.selectedSymptoms || []);
  const [symptomPage, setSymptomPage] = useState<number>(1);
  const [isDontKnow, setIsDontKnow] = useState<boolean>(symptomData.isDontKnow || false);
  const [painSeverity, setPainSeverity] = useState<number>(symptomData.painSeverity || 5);
  const [duration, setDuration] = useState<"today" | "few_days" | "more_than_week" | "chronic">(
    symptomData.duration || "few_days"
  );

  // Compile ALL available organs and symptoms from all selected regions without cutting any
  const availableOrgans: SubOrgan[] = [];
  const availableSymptoms: SymptomItem[] = [];

  selectedRegions.forEach((regId) => {
    const region = BODY_REGIONS[regId];
    if (region) {
      region.organs.forEach((o) => {
        if (!availableOrgans.some((existing) => existing.id === o.id)) {
          availableOrgans.push(o);
        }
      });
      region.commonSymptoms.forEach((s) => {
        if (!availableSymptoms.some((existing) => existing.id === s.id)) {
          availableSymptoms.push(s);
        }
      });
    }
  });

  const totalSymptomPages = availableSymptoms.length > 16 ? 2 : 1;
  const symptomsPerPage = totalSymptomPages === 2 ? Math.ceil(availableSymptoms.length / 2) : availableSymptoms.length;
  const currentSymptoms = totalSymptomPages === 2
    ? (symptomPage === 1 ? availableSymptoms.slice(0, symptomsPerPage) : availableSymptoms.slice(symptomsPerPage))
    : availableSymptoms;

  const handleRegionClick = (regionId: BodyRegionId) => {
    onToggleRegion(regionId);
    const regionData = BODY_REGIONS[regionId];
    if (regionData && voiceGuide) {
      const isNowSelected = !selectedRegions.includes(regionId);
      if (isNowSelected) {
        speakText(
          lang === "hi"
            ? `${regionData.nameHi} चुना गया।`
            : `${regionData.nameEn} selected.`,
          lang
        );
      }
    }
  };


  useEffect(() => {
    if (!voiceGuide) return;
    const activeVoice = (lang !== "en" && lang !== "hi") ? "en" : lang;
    const prompts = VOICE_PROMPTS[activeVoice] || VOICE_PROMPTS.en;
    
    // When the UI transitions to the symptoms checklist, speak the modal instructions.
    if (subStep === "symptoms") {
      speakText(prompts.modal, activeVoice);
    }
  }, [subStep, voiceGuide, lang]);

  const handleClear = () => {
    onClearRegions();
    setSubStep("map");
  };

  const handleContinueFromMap = () => {
    if (selectedRegions.length === 0) return;
    if (availableOrgans.length > 0) {
      setSubStep("organs");
    } else if (availableSymptoms.length > 0) {
      setSymptomPage(1);
      setSubStep("symptoms");
    } else {
      setSubStep("discomfort");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleContinueFromOrgans = () => {
    if (availableSymptoms.length > 0) {
      setSymptomPage(1);
      setSubStep("symptoms");
    } else {
      setSubStep("discomfort");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackFromOrgans = () => {
    handleBackToMap();
  };

  const handleContinueFromSymptoms = () => {
    if (totalSymptomPages === 2 && symptomPage === 1) {
      setSymptomPage(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setSubStep("discomfort");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBackFromSymptoms = () => {
    if (totalSymptomPages === 2 && symptomPage === 2) {
      setSymptomPage(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (availableOrgans.length > 0) {
      setSubStep("organs");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setSubStep("map");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBackToMap = () => {
    setSubStep("map");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToOrgans = () => {
    if (availableOrgans.length > 0) {
      setSubStep("organs");
    } else {
      setSubStep("map");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToSymptoms = () => {
    if (availableSymptoms.length > 0) {
      setSubStep("symptoms");
      if (totalSymptomPages === 2) {
        setSymptomPage(2);
      }
    } else if (availableOrgans.length > 0) {
      setSubStep("organs");
    } else {
      setSubStep("map");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isSelected = (id: BodyRegionId) => selectedRegions.includes(id);

  const toggleOrgan = (organId: string) => {
    setIsDontKnow(false);
    const updated = selectedOrgans.includes(organId)
      ? selectedOrgans.filter((id) => id !== organId)
      : [...selectedOrgans, organId];
    setSelectedOrgans(updated);
    onUpdateSymptomData({
      selectedOrgans: updated,
      selectedSymptoms,
      isDontKnow: false,
      painSeverity,
      duration,
    });
  };

  const toggleSymptom = (symptomId: string) => {
    setIsDontKnow(false);
    const updated = selectedSymptoms.includes(symptomId)
      ? selectedSymptoms.filter((id) => id !== symptomId)
      : [...selectedSymptoms, symptomId];
    setSelectedSymptoms(updated);
    onUpdateSymptomData({
      selectedOrgans,
      selectedSymptoms: updated,
      isDontKnow: false,
      painSeverity,
      duration,
    });
  };

  const handleDontKnowToggle = () => {
    const next = !isDontKnow;
    setIsDontKnow(next);
    if (next) {
      setSelectedOrgans([]);
      setSelectedSymptoms([]);
      onUpdateSymptomData({
        selectedOrgans: [],
        selectedSymptoms: [],
        isDontKnow: true,
        painSeverity,
        duration,
      });
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

  const handleProceed = () => {
    const finalData: SymptomDrillDownData = {
      selectedOrgans,
      selectedSymptoms,
      isDontKnow,
      painSeverity,
      duration,
    };
    onUpdateSymptomData(finalData);
    onProceedToNextStep(finalData);
  };

  const zoneCountLabel = selectedRegions.length === 1 
    ? (lang === "en" ? "1 zone selected" : `1 ${t.zonesSelectedCount}`)
    : `${selectedRegions.length} ${lang === "en" ? "zones selected" : t.zonesSelectedCount}`;

  // ══════════════════════════════════════════════════════════════════════════
  // SUB-PAGE 1: Specify Specific Body Part / Organs
  // ══════════════════════════════════════════════════════════════════════════
  if (subStep === "organs" && selectedRegions.length > 0 && availableOrgans.length > 0) {
    return (
      <div className="w-full max-w-5xl mx-auto my-auto space-y-2 animate-in fade-in duration-300">
        
        {/* Top Header */}
        <div className="flex flex-col items-center justify-center text-center px-1">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {lang === "hi" ? "क्या आप किसी विशिष्ट अंग को चुनना चाहते हैं?" : "Do you want to specify any body part?"}
          </h2>
        </div>

        {/* Main Card */}
        <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-sm space-y-2.5 text-slate-900 dark:text-white">
          
          {/* Organs Grid Header */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              {lang === "hi" ? "विशिष्ट अंग / भाग" : "Affected Organs / Sub-areas"}
            </label>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2">
              {availableOrgans.map((organ) => {
                const isChecked = selectedOrgans.includes(organ.id);
                return (
                  <button
                    key={organ.id}
                    type="button"
                    onClick={() => toggleOrgan(organ.id)}
                    className={`p-2 px-2.5 rounded-xl border text-left transition-all flex items-center justify-between min-h-[38px] ${
                      isChecked
                        ? "bg-emerald-50/90 dark:bg-emerald-950/70 border-emerald-500 ring-1 ring-emerald-500/20 text-emerald-950 dark:text-emerald-50 shadow-sm font-bold"
                        : "bg-slate-50/70 hover:bg-slate-50 dark:bg-slate-900/60 dark:hover:bg-slate-800/70 border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {lang === "hi" ? organ.nameHi : organ.nameEn}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 ml-1.5 ${
                        isChecked
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}

              {/* Not Sure button */}
              <button
                type="button"
                onClick={handleDontKnowToggle}
                className={`p-2 px-2.5 rounded-xl border text-left transition-all flex items-center justify-between min-h-[38px] ${
                  isDontKnow
                    ? "bg-emerald-50/90 dark:bg-emerald-950/70 border-emerald-500 ring-1 ring-emerald-500/20 text-emerald-950 dark:text-emerald-50 shadow-sm font-bold"
                    : "bg-slate-50/70 hover:bg-slate-50 dark:bg-slate-900/60 dark:hover:bg-slate-800/70 border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 text-slate-700 dark:text-slate-300"
                }`}
              >
                <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {lang === "hi" ? "निश्चित नहीं / Not Sure" : "I Don't Know / Not Sure"}
                </span>
                <div
                  className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 ml-1.5 ${
                    isDontKnow
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                  }`}
                >
                  {isDontKnow && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            </div>
          </div>

          {/* Bottom Action Row with Back and Continue */}
          <div className="pt-2 flex items-center gap-2.5 flex-shrink-0">
            <button
              type="button"
              onClick={handleBackFromOrgans}
              className="h-10 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.99]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === "hi" ? "बॉडी मैप" : "Back"}</span>
            </button>
            <button
              type="button"
              onClick={handleContinueFromOrgans}
              className="flex-1 h-10 py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold text-xs sm:text-sm shadow-sm shadow-emerald-600/20 active:scale-[0.99] transition-all flex items-center justify-center space-x-1.5"
            >
              <span>{lang === "hi" ? "लक्षण विवरण के लिए आगे बढ़ें" : "Continue to Symptoms"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SUB-PAGE 2: Common Symptoms Checklist
  // ══════════════════════════════════════════════════════════════════════════
  if (subStep === "symptoms" && selectedRegions.length > 0) {
    return (
      <div className="w-full max-w-5xl mx-auto my-auto space-y-2 animate-in fade-in duration-300">
        
        {/* Top Header */}
        <div className="flex flex-col items-center justify-center text-center px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {lang === "hi" ? "क्या आपको इनमें से कोई सामान्य लक्षण हैं?" : "Do you have any of these common symptoms?"}
            </h2>
            {totalSymptomPages > 1 && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-black border border-emerald-300 dark:border-emerald-800">
                {lang === "hi" ? `पृष्ठ ${symptomPage}/${totalSymptomPages}` : `Page ${symptomPage} of ${totalSymptomPages}`}
              </span>
            )}
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-sm space-y-2.5 text-slate-900 dark:text-white">
          
          {/* Common Symptoms Grid */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                {lang === "hi" ? "सामान्य लक्षण" : "Common Everyday Symptoms"}
              </label>
              {totalSymptomPages > 1 && (
                <span className="text-[11px] text-slate-400 font-semibold">
                  {lang === "hi"
                    ? `लक्षण ${symptomPage === 1 ? `1 - ${symptomsPerPage}` : `${symptomsPerPage + 1} - ${availableSymptoms.length}`} (कुल ${availableSymptoms.length})`
                    : `Showing ${symptomPage === 1 ? `1 - ${symptomsPerPage}` : `${symptomsPerPage + 1} - ${availableSymptoms.length}`} of ${availableSymptoms.length}`}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2">
              {currentSymptoms.map((symptom) => {
                const isChecked = selectedSymptoms.includes(symptom.id);
                return (
                  <button
                    key={symptom.id}
                    type="button"
                    onClick={() => toggleSymptom(symptom.id)}
                    className={`p-2 px-2.5 rounded-xl border text-left transition-all flex items-center justify-between min-h-[38px] ${
                      isChecked
                        ? "bg-emerald-50/90 dark:bg-emerald-950/70 border-emerald-500 ring-1 ring-emerald-500/20 text-emerald-950 dark:text-emerald-50 font-bold shadow-sm"
                        : "bg-slate-50/70 hover:bg-slate-50 dark:bg-slate-900/60 dark:hover:bg-slate-800/70 border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {lang === "hi" ? symptom.nameHi : symptom.nameEn}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 ml-1.5 ${
                        isChecked
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Row with Back and Next */}
          <div className="pt-2 flex items-center gap-2.5 flex-shrink-0">
            <button
              type="button"
              onClick={handleBackFromSymptoms}
              className="h-10 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.99]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>
                {totalSymptomPages === 2 && symptomPage === 2
                    ? (lang === "hi" ? "पिछला पृष्ठ" : "Previous Page")
                    : availableOrgans.length > 0
                    ? (lang === "hi" ? "अंग चयन" : "Back")
                    : (lang === "hi" ? "बॉडी मैप" : "Back")}
              </span>
            </button>
            <button
              type="button"
              onClick={handleContinueFromSymptoms}
              className="flex-1 h-10 py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold text-xs sm:text-sm shadow-sm shadow-emerald-600/20 active:scale-[0.99] transition-all flex items-center justify-center space-x-1.5"
            >
              <span>
                {totalSymptomPages === 2 && symptomPage === 1
                  ? (lang === "hi" ? "अन्य लक्षण देखें (पृष्ठ 2)" : "Continue to More Symptoms (Page 2)")
                  : (lang === "hi" ? "तकलीफ और अवधि दर्ज करें" : "Continue to Discomfort & Duration")}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SUB-PAGE 3: Level of Discomfort & Duration
  // ══════════════════════════════════════════════════════════════════════════
  if (subStep === "discomfort" && selectedRegions.length > 0) {
    return (
      <div className="w-full max-w-4xl mx-auto my-auto space-y-2.5 animate-in fade-in duration-300">
        
        {/* Top Header */}
        <div className="flex flex-col items-center justify-center text-center px-1">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {lang === "hi" ? "तकलीफ का स्तर और अवधि बताएं" : "Level of Discomfort & Duration"}
          </h2>
        </div>

        {/* Main Card */}
        <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5 text-slate-900 dark:text-white">
          
          {/* 1. Level of Discomfort Box */}
          <div className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
            <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>{lang === "hi" ? "तकलीफ का स्तर" : "Level of Discomfort"}</span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "mild", score: 2, label: lang === "hi" ? "हल्का (Mild)" : "Mild" },
                { id: "moderate", score: 5, label: lang === "hi" ? "मध्यम (Moderate)" : "Moderate" },
                { id: "severe", score: 9, label: lang === "hi" ? "गंभीर (Severe)" : "Severe" },
              ].map((item) => {
                const isSelected = item.id === "mild" ? painSeverity <= 3 : item.id === "moderate" ? (painSeverity > 3 && painSeverity < 8) : painSeverity >= 8;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setPainSeverity(item.score);
                      onUpdateSymptomData({
                        selectedOrgans,
                        selectedSymptoms,
                        isDontKnow,
                        painSeverity: item.score,
                        duration,
                      });
                    }}
                    className={`h-11 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all text-center flex items-center justify-center ${
                      isSelected
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-sm font-bold active:scale-[0.99]"
                        : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-emerald-300"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Duration Box */}
          <div className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
            <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{lang === "hi" ? "यह समस्या कब से है? (अवधि)" : "Duration"}</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "today", label: lang === "hi" ? "आज से" : "Since Today" },
                { id: "few_days", label: lang === "hi" ? "2 - 3 दिन" : "2 - 3 Days" },
                { id: "more_than_week", label: lang === "hi" ? "1 सप्ताह +" : "Over 1 Week" },
                { id: "chronic", label: lang === "hi" ? "लंबे समय से" : "Chronic" },
              ].map((item) => {
                const isSelected = duration === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setDuration(item.id as any);
                      onUpdateSymptomData({
                        selectedOrgans,
                        selectedSymptoms,
                        isDontKnow,
                        painSeverity,
                        duration: item.id as any,
                      });
                    }}
                    className={`h-11 px-2 rounded-xl border text-xs sm:text-sm font-bold transition-all text-center flex items-center justify-center ${
                      isSelected
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-sm font-bold active:scale-[0.99]"
                        : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-emerald-300"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Row with Back and Next */}
          <div className="pt-2 flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleBackToSymptoms}
              className="h-10 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.99]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === "hi" ? "लक्षण" : "Back"}</span>
            </button>
            <button
              type="button"
              onClick={handleProceed}
              className="flex-1 h-10 py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold text-xs sm:text-sm shadow-sm shadow-emerald-600/20 active:scale-[0.99] transition-all flex items-center justify-center space-x-1.5"
            >
              <span>{lang === "hi" ? "आगे बढ़ें: पर्चा अपलोड करें" : "Next: Upload Prescription"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // BASE SCREEN: Select Body Part & Pain Zones
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="w-full max-w-4xl mx-auto space-y-2.5">
      
      {/* Top Simple Page Header */}
      <div className="px-1 space-y-0.5 text-center">
        <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
          {lang === "hi" ? "शरीर का प्रभावित अंग चुनें" : "Select the Body Part"}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {lang === "hi" ? "मानव शरीर के चित्र पर स्पर्श करें या सूची में से चुनें" : "Tap on the body model or select from the list"}
        </p>
      </div>

      {/* Main Interactive Anatomy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        
        {/* Left/Center: Visual Interactive Anatomical Skeleton SVG Canvas */}
        <div className="lg:col-span-5 bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-sm flex flex-col items-center justify-between relative min-h-[420px] transition-colors">
          
          {/* Top: Bold Title + Refined View Switcher */}
          <div className="w-full flex flex-col items-center justify-center text-center gap-1.5 z-10">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
              {lang === "hi" ? "प्रभावित अंग पर स्पर्श करें" : "Tap on the affected body area"}
            </h3>

            {/* Refined Front View / Back Spine View Segmented Control */}
            <div className="inline-flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/90 dark:border-slate-700 shadow-inner">
              <button
                type="button"
                onClick={() => setView("front")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  view === "front"
                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span>{t.frontView}</span>
              </button>
              <button
                type="button"
                onClick={() => setView("back")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                  view === "back"
                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <RotateCw className="w-3 h-3" />
                <span>{t.backView}</span>
              </button>
            </div>
          </div>

          {/* Interactive Human SVG Anatomy Model (Prominent & Balanced) */}
          <div className="relative w-full max-w-[240px] aspect-[1/1.55] flex items-center justify-center select-none py-0.5">
            <svg
              viewBox="0 0 300 520"
              className="w-full h-full drop-shadow-md max-h-[300px]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="glow-emerald" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="bodyBaseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
              </defs>

              {/* Base Human Silhouette Contour */}
              <g opacity="0.35" stroke="#64748b" strokeWidth="1.5" fill="url(#bodyBaseGrad)">
                <ellipse cx="150" cy="45" rx="30" ry="36" />
                <path d="M 140 80 L 140 98 L 160 98 L 160 80 Z" />
                <path d="M 95 105 Q 150 95 205 105 L 195 240 L 105 240 Z" />
                <path d="M 95 105 L 60 210 L 45 285 L 58 290 L 75 215 L 105 130 Z" />
                <path d="M 205 105 L 240 210 L 255 285 L 242 290 L 225 215 L 195 130 Z" />
                <path d="M 105 240 L 195 240 L 180 370 L 175 480 L 155 480 L 150 330 L 145 480 L 125 480 L 120 370 Z" />
              </g>

              {/* 1. HEAD & NECK HOTSPOT */}
              <g
                className="hotspot-region cursor-pointer transition-all"
                onClick={() => handleRegionClick("head_neck")}
                onMouseEnter={() => setHoveredRegion("head_neck")}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                <ellipse
                  cx="150"
                  cy="45"
                  rx="34"
                  ry="38"
                  fill={isSelected("head_neck") ? "#10b981" : hoveredRegion === "head_neck" ? "#38bdf8" : "#475569"}
                  fillOpacity={isSelected("head_neck") ? "0.75" : hoveredRegion === "head_neck" ? "0.6" : "0.5"}
                  stroke={isSelected("head_neck") ? "#10b981" : hoveredRegion === "head_neck" ? "#38bdf8" : "#94a3b8"}
                  strokeWidth={isSelected("head_neck") ? "3" : "1.5"}
                  filter={isSelected("head_neck") ? "url(#glow-emerald)" : undefined}
                />
                <circle cx="140" cy="40" r="5" fill="#f8fafc" opacity="0.8" />
                <circle cx="160" cy="40" r="5" fill="#f8fafc" opacity="0.8" />
                <path d="M 148 48 L 152 48 L 150 56 Z" fill="#cbd5e1" opacity="0.8" />
                <path d="M 142 64 Q 150 68 158 64" stroke="#f8fafc" strokeWidth="2" fill="none" />
                {isSelected("head_neck") && (
                  <circle cx="150" cy="45" r="12" fill="#10b981" className="animate-ping opacity-75" />
                )}
              </g>

              {/* 2. CHEST & RIBCAGE HOTSPOT */}
              <g
                className="hotspot-region cursor-pointer transition-all"
                onClick={() => handleRegionClick("chest")}
                onMouseEnter={() => setHoveredRegion("chest")}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                <path
                  d="M 105 105 Q 150 98 195 105 L 190 175 Q 150 185 110 175 Z"
                  fill={isSelected("chest") ? "#10b981" : hoveredRegion === "chest" ? "#38bdf8" : "#475569"}
                  fillOpacity={isSelected("chest") ? "0.75" : hoveredRegion === "chest" ? "0.6" : "0.5"}
                  stroke={isSelected("chest") ? "#10b981" : hoveredRegion === "chest" ? "#38bdf8" : "#94a3b8"}
                  strokeWidth={isSelected("chest") ? "3" : "1.5"}
                  filter={isSelected("chest") ? "url(#glow-emerald)" : undefined}
                />
                <circle cx="138" cy="138" r="4.5" fill="#ef4444" className="animate-pulse" />
              </g>

              {/* 3. ABDOMEN & STOMACH HOTSPOT */}
              {view === "front" ? (
                <g
                  className="hotspot-region cursor-pointer transition-all"
                  onClick={() => handleRegionClick("abdomen")}
                  onMouseEnter={() => setHoveredRegion("abdomen")}
                  onMouseLeave={() => setHoveredRegion(null)}
                >
                  <path
                    d="M 110 176 Q 150 185 190 176 L 184 240 Q 150 248 116 240 Z"
                    fill={isSelected("abdomen") ? "#10b981" : hoveredRegion === "abdomen" ? "#38bdf8" : "#475569"}
                    fillOpacity={isSelected("abdomen") ? "0.75" : hoveredRegion === "abdomen" ? "0.6" : "0.5"}
                    stroke={isSelected("abdomen") ? "#10b981" : hoveredRegion === "abdomen" ? "#38bdf8" : "#94a3b8"}
                    strokeWidth={isSelected("abdomen") ? "3" : "1.5"}
                    filter={isSelected("abdomen") ? "url(#glow-emerald)" : undefined}
                  />
                  <circle cx="150" cy="208" r="3" fill="#f8fafc" opacity="0.7" />
                </g>
              ) : (
                /* SPINE & BACK HOTSPOT (BACK VIEW) */
                <g
                  className="hotspot-region cursor-pointer transition-all"
                  onClick={() => handleRegionClick("spine_back")}
                  onMouseEnter={() => setHoveredRegion("spine_back")}
                  onMouseLeave={() => setHoveredRegion(null)}
                >
                  <path
                    d="M 142 98 L 158 98 L 158 290 L 142 290 Z"
                    fill={isSelected("spine_back") ? "#10b981" : hoveredRegion === "spine_back" ? "#38bdf8" : "#475569"}
                    fillOpacity={isSelected("spine_back") ? "0.75" : hoveredRegion === "spine_back" ? "0.6" : "0.5"}
                    stroke={isSelected("spine_back") ? "#10b981" : hoveredRegion === "spine_back" ? "#38bdf8" : "#94a3b8"}
                    strokeWidth={isSelected("spine_back") ? "3" : "1.5"}
                    filter={isSelected("spine_back") ? "url(#glow-emerald)" : undefined}
                  />
                  {[110, 130, 150, 170, 190, 210, 230, 250, 270].map((y) => (
                    <line key={y} x1="144" y1={y} x2="156" y2={y} stroke="#f8fafc" strokeWidth="2" opacity="0.8" />
                  ))}
                </g>
              )}

              {/* 4. ARMS & SHOULDERS HOTSPOT */}
              <g
                className="hotspot-region cursor-pointer transition-all"
                onClick={() => handleRegionClick("arms")}
                onMouseEnter={() => setHoveredRegion("arms")}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                <path
                  d="M 95 105 L 60 210 L 45 285 L 58 290 L 75 215 L 105 130 Z"
                  fill={isSelected("arms") ? "#10b981" : hoveredRegion === "arms" ? "#38bdf8" : "#475569"}
                  fillOpacity={isSelected("arms") ? "0.75" : hoveredRegion === "arms" ? "0.6" : "0.5"}
                  stroke={isSelected("arms") ? "#10b981" : hoveredRegion === "arms" ? "#38bdf8" : "#94a3b8"}
                  strokeWidth={isSelected("arms") ? "3" : "1.5"}
                />
                <path
                  d="M 205 105 L 240 210 L 255 285 L 242 290 L 225 215 L 195 130 Z"
                  fill={isSelected("arms") ? "#10b981" : hoveredRegion === "arms" ? "#38bdf8" : "#475569"}
                  fillOpacity={isSelected("arms") ? "0.75" : hoveredRegion === "arms" ? "0.6" : "0.5"}
                  stroke={isSelected("arms") ? "#10b981" : hoveredRegion === "arms" ? "#38bdf8" : "#94a3b8"}
                  strokeWidth={isSelected("arms") ? "3" : "1.5"}
                />
              </g>

              {/* 5. PELVIS & LOWER ABDOMEN HOTSPOT */}
              <g
                className="hotspot-region cursor-pointer transition-all"
                onClick={() => handleRegionClick("pelvis")}
                onMouseEnter={() => setHoveredRegion("pelvis")}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                <path
                  d="M 116 242 Q 150 250 184 242 L 180 295 Q 150 305 120 295 Z"
                  fill={isSelected("pelvis") ? "#10b981" : hoveredRegion === "pelvis" ? "#38bdf8" : "#475569"}
                  fillOpacity={isSelected("pelvis") ? "0.75" : hoveredRegion === "pelvis" ? "0.6" : "0.5"}
                  stroke={isSelected("pelvis") ? "#10b981" : hoveredRegion === "pelvis" ? "#38bdf8" : "#94a3b8"}
                  strokeWidth={isSelected("pelvis") ? "3" : "1.5"}
                  filter={isSelected("pelvis") ? "url(#glow-emerald)" : undefined}
                />
              </g>

              {/* 6. LEGS & JOINTS HOTSPOT */}
              <g
                className="hotspot-region cursor-pointer transition-all"
                onClick={() => handleRegionClick("legs_joints")}
                onMouseEnter={() => setHoveredRegion("legs_joints")}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                <path
                  d="M 120 296 L 146 296 L 142 480 L 122 480 L 118 370 Z"
                  fill={isSelected("legs_joints") ? "#10b981" : hoveredRegion === "legs_joints" ? "#38bdf8" : "#475569"}
                  fillOpacity={isSelected("legs_joints") ? "0.75" : hoveredRegion === "legs_joints" ? "0.6" : "0.5"}
                  stroke={isSelected("legs_joints") ? "#10b981" : hoveredRegion === "legs_joints" ? "#38bdf8" : "#94a3b8"}
                  strokeWidth={isSelected("legs_joints") ? "3" : "1.5"}
                />
                <circle cx="132" cy="370" r="8" fill="#f8fafc" opacity="0.6" />
                <path
                  d="M 154 296 L 180 296 L 176 370 L 172 480 L 152 480 Z"
                  fill={isSelected("legs_joints") ? "#10b981" : hoveredRegion === "legs_joints" ? "#38bdf8" : "#475569"}
                  fillOpacity={isSelected("legs_joints") ? "0.75" : hoveredRegion === "legs_joints" ? "0.6" : "0.5"}
                  stroke={isSelected("legs_joints") ? "#10b981" : hoveredRegion === "legs_joints" ? "#38bdf8" : "#94a3b8"}
                  strokeWidth={isSelected("legs_joints") ? "3" : "1.5"}
                />
                <circle cx="166" cy="370" r="8" fill="#f8fafc" opacity="0.6" />
              </g>
            </svg>
          </div>

          {/* Bottom: Selected Zones Numbering Badge inside the box */}
          <div className="w-full flex items-center justify-center pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-extrabold text-emerald-700 dark:text-emerald-300 shadow-sm flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{zoneCountLabel}</span>
            </span>
          </div>
        </div>

        {/* Right: Region Selection Checklist with All 8 Options Visible at Once in 2 Columns */}
        <div className="lg:col-span-7 bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-sm flex flex-col justify-between gap-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{t.selectedZones}</span>
                </h3>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {zoneCountLabel}
                </span>
              </div>
              {selectedRegions.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 text-xs font-bold transition-colors flex items-center space-x-1 shadow-sm"
                >
                  <X className="w-3 h-3" />
                  <span>{t.clearSelection}</span>
                </button>
              )}
            </div>

            {/* 2-Column Grid: All 8 Zones Visible at Once (Zero Scrollbar) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.keys(BODY_REGIONS).map((key) => {
                const regId = key as BodyRegionId;
                const region = BODY_REGIONS[regId];
                const active = isSelected(regId);

                return (
                  <button
                    key={regId}
                    type="button"
                    onClick={() => handleRegionClick(regId)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between min-h-[58px] ${
                      active
                        ? "bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 dark:text-emerald-50 shadow-sm"
                        : "bg-slate-50/70 hover:bg-slate-50 dark:bg-slate-900/60 dark:hover:bg-slate-800/70 border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 text-slate-800 dark:text-slate-200 shadow-none"
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 transition-all ${
                          active
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-slate-200/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {active ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : "+"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                          {t[
                            regId === "head_neck" ? "regionHeadNeck" :
                            regId === "chest" ? "regionChest" :
                            regId === "abdomen" ? "regionAbdomen" :
                            regId === "spine_back" ? "regionSpineBack" :
                            regId === "arms" ? "regionArms" :
                            regId === "pelvis" ? "regionPelvis" :
                            regId === "legs_joints" ? "regionLegsJoints" : "regionSkinGeneral"
                          ] || region.nameEn}
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5 font-medium line-clamp-1">
                          {lang === "en" ? region.colloquialEn : region.colloquialHi}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Proceed to Specify Body Part / Symptom Details Button */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="h-10 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.99]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{lang === "hi" ? "पंजीकरण" : "Back"}</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleContinueFromMap}
              disabled={selectedRegions.length === 0}
              className={`flex-1 py-2.5 px-5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 ${
                selectedRegions.length > 0
                  ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-md shadow-emerald-600/25 active:scale-[0.99]"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 border border-slate-200/90 dark:border-slate-700/80 cursor-not-allowed"
              }`}
            >
              <span>
                {selectedRegions.length > 0
                  ? (availableOrgans.length > 0
                      ? (lang === "hi" ? "विशिष्ट अंग चुनने के लिए आगे बढ़ें" : "Continue to Specify Body Part")
                      : (lang === "hi" ? "लक्षण विवरण के लिए आगे बढ़ें" : "Continue to Symptom Details"))
                  : (lang === "hi" ? "कम से कम 1 प्रभावित अंग चुनें" : "Select at least 1 Body Part")}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
