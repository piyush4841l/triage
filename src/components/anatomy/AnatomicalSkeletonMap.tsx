"use client";

import React, { useState, useRef } from "react";
import { 
  Check, 
  RotateCw, 
  Sparkles, 
  ArrowRight, 
  X, 
  HelpCircle,
  Flame,
  Clock,
  Layers
} from "lucide-react";
import { BodyRegionId, BODY_REGIONS, SubOrgan, SymptomItem } from "@/lib/anatomy-data";
import { Language, translations } from "@/lib/i18n";
import { speakText } from "@/lib/speech";
import { SymptomDrillDownData } from "@/components/anatomy/OrganDrillDownModal";

interface AnatomicalSkeletonMapProps {
  selectedRegions: BodyRegionId[];
  onToggleRegion: (regionId: BodyRegionId) => void;
  onClearRegions: () => void;
  symptomData: SymptomDrillDownData;
  onUpdateSymptomData: (data: SymptomDrillDownData) => void;
  onProceedToNextStep: (data: SymptomDrillDownData) => void;
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
  lang,
  voiceGuide,
}) => {
  const t = translations[lang] || translations.en;
  const [view, setView] = useState<"front" | "back">("front");
  const [hoveredRegion, setHoveredRegion] = useState<BodyRegionId | null>(null);
  const [isSymptomSectionOpen, setIsSymptomSectionOpen] = useState(false);

  // Symptom details local state synced with symptomData
  const [selectedOrgans, setSelectedOrgans] = useState<string[]>(symptomData.selectedOrgans || []);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(symptomData.selectedSymptoms || []);
  const [isDontKnow, setIsDontKnow] = useState<boolean>(symptomData.isDontKnow || false);
  const [painSeverity, setPainSeverity] = useState<number>(symptomData.painSeverity || 5);
  const [duration, setDuration] = useState<"today" | "few_days" | "more_than_week" | "chronic">(
    symptomData.duration || "few_days"
  );

  const symptomSectionRef = useRef<HTMLDivElement>(null);

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

  const handleClear = () => {
    onClearRegions();
    setIsSymptomSectionOpen(false);
  };

  const handleOpenSymptomSection = () => {
    if (selectedRegions.length === 0) return;
    setIsSymptomSectionOpen(true);
    setTimeout(() => {
      if (symptomSectionRef.current) {
        const navHeight = 96; // generous offset so navbar never cuts off top badges/title
        const elementPosition = symptomSectionRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navHeight;

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: "smooth",
        });
      }
    }, 120);
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

  // Compile available organs and symptoms from all selected regions
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

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Title & Instructions */}
      <div className="bg-white/95 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-3 relative overflow-hidden transition-colors">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {t.step2Title}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium">
          {t.step2Subtitle}
        </p>

        {/* View Switcher & Clear Button */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <div className="bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center space-x-1 shadow-inner">
            <button
              type="button"
              onClick={() => setView("front")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center space-x-2 ${
                view === "front"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>{t.frontView}</span>
            </button>
            <button
              type="button"
              onClick={() => setView("back")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center space-x-2 ${
                view === "back"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <RotateCw className="w-4 h-4" />
              <span>{t.backView}</span>
            </button>
          </div>

          {selectedRegions.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-sm"
            >
              <X className="w-4 h-4" />
              <span>{t.clearSelection}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Anatomy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left/Center: Visual Interactive Anatomical Skeleton SVG Canvas */}
        <div className="lg:col-span-7 bg-white/95 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center relative min-h-[520px] transition-colors">
          
          {/* Active Hover Floating Badge */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
            <span className="px-3 py-1 rounded-xl bg-slate-100/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5 backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{selectedRegions.length} {t.zonesSelectedCount}</span>
            </span>

            {hoveredRegion && (
              <span className="px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/90 border border-emerald-300 dark:border-emerald-400/50 text-xs font-extrabold text-emerald-900 dark:text-emerald-200 backdrop-blur-md shadow-md animate-pulse">
                {t[
                  hoveredRegion === "head_neck" ? "regionHeadNeck" :
                  hoveredRegion === "chest" ? "regionChest" :
                  hoveredRegion === "abdomen" ? "regionAbdomen" :
                  hoveredRegion === "spine_back" ? "regionSpineBack" :
                  hoveredRegion === "arms" ? "regionArms" :
                  hoveredRegion === "pelvis" ? "regionPelvis" :
                  hoveredRegion === "legs_joints" ? "regionLegsJoints" : "regionSkinGeneral"
                ] || BODY_REGIONS[hoveredRegion]?.nameEn}
              </span>
            )}
          </div>

          {/* Interactive Human SVG Anatomy Model */}
          <div className="relative w-full max-w-[340px] aspect-[1/1.7] flex items-center justify-center select-none py-6">
            <svg
              viewBox="0 0 300 520"
              className="w-full h-full drop-shadow-md"
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
                <path d="M 150 102 L 150 172" stroke="#f8fafc" strokeWidth="3" opacity="0.8" />
                <path d="M 125 118 Q 150 128 175 118" stroke="#f8fafc" strokeWidth="2" fill="none" opacity="0.7" />
                <path d="M 120 135 Q 150 148 180 135" stroke="#f8fafc" strokeWidth="2" fill="none" opacity="0.7" />
                <path d="M 122 152 Q 150 165 178 152" stroke="#f8fafc" strokeWidth="2" fill="none" opacity="0.7" />
                <circle cx="160" cy="135" r="6" fill="#ef4444" opacity="0.9" className="animate-pulse" />
              </g>

              {/* 3. ABDOMEN & STOMACH HOTSPOT (or SPINE if Back View) */}
              {view === "front" ? (
                <g
                  className="hotspot-region cursor-pointer transition-all"
                  onClick={() => handleRegionClick("abdomen")}
                  onMouseEnter={() => setHoveredRegion("abdomen")}
                  onMouseLeave={() => setHoveredRegion(null)}
                >
                  <path
                    d="M 112 178 Q 150 188 188 178 L 184 240 Q 150 248 116 240 Z"
                    fill={isSelected("abdomen") ? "#10b981" : hoveredRegion === "abdomen" ? "#38bdf8" : "#475569"}
                    fillOpacity={isSelected("abdomen") ? "0.75" : hoveredRegion === "abdomen" ? "0.6" : "0.5"}
                    stroke={isSelected("abdomen") ? "#10b981" : hoveredRegion === "abdomen" ? "#38bdf8" : "#94a3b8"}
                    strokeWidth={isSelected("abdomen") ? "3" : "1.5"}
                    filter={isSelected("abdomen") ? "url(#glow-emerald)" : undefined}
                  />
                  <circle cx="150" cy="210" r="3" fill="#f8fafc" opacity="0.9" />
                  <path d="M 135 195 Q 150 202 165 195" stroke="#cbd5e1" strokeWidth="1.5" fill="none" opacity="0.7" />
                  <path d="M 136 222 Q 150 230 164 222" stroke="#cbd5e1" strokeWidth="1.5" fill="none" opacity="0.7" />
                </g>
              ) : (
                <g
                  className="hotspot-region cursor-pointer transition-all"
                  onClick={() => handleRegionClick("spine_back")}
                  onMouseEnter={() => setHoveredRegion("spine_back")}
                  onMouseLeave={() => setHoveredRegion(null)}
                >
                  <path
                    d="M 138 98 L 162 98 L 158 245 L 142 245 Z"
                    fill={isSelected("spine_back") ? "#10b981" : hoveredRegion === "spine_back" ? "#38bdf8" : "#475569"}
                    fillOpacity={isSelected("spine_back") ? "0.75" : hoveredRegion === "spine_back" ? "0.6" : "0.5"}
                    stroke={isSelected("spine_back") ? "#10b981" : hoveredRegion === "spine_back" ? "#38bdf8" : "#94a3b8"}
                    strokeWidth={isSelected("spine_back") ? "3" : "1.5"}
                    filter={isSelected("spine_back") ? "url(#glow-emerald)" : undefined}
                  />
                  <line x1="150" y1="100" x2="150" y2="240" stroke="#f8fafc" strokeWidth="3" strokeDasharray="3,3" />
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

          <div className="text-center text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
            💡 {t.tapToSelectRegion}
          </div>
        </div>

        {/* Right: Region Selection Checklist with Dedicated Proceed Button */}
        <div className="lg:col-span-5 bg-white/95 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{t.selectedZones}</span>
              </h3>
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {selectedRegions.length} Selected
              </span>
            </div>

            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {Object.keys(BODY_REGIONS).map((key) => {
                const regId = key as BodyRegionId;
                const region = BODY_REGIONS[regId];
                const active = isSelected(regId);

                return (
                  <button
                    key={regId}
                    type="button"
                    onClick={() => handleRegionClick(regId)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      active
                        ? "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-900 dark:text-emerald-100 shadow-sm"
                        : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-emerald-300 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                          active
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {active ? <Check className="w-4 h-4" /> : "+"}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
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
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {lang === "en" ? region.colloquialEn : region.colloquialHi}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Proceed to Symptom Details Button */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <button
              type="button"
              onClick={handleOpenSymptomSection}
              disabled={selectedRegions.length === 0}
              className={`w-full py-4 px-5 rounded-2xl font-black text-base transition-all flex items-center justify-center space-x-2 ${
                selectedRegions.length > 0
                  ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-600/30 active:scale-[0.98]"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-300 dark:border-slate-700 cursor-not-allowed"
              }`}
            >
              <span>{t.continueToSymptoms || "Proceed to Symptom Details"}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {selectedRegions.length === 0 && (
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center font-medium">
                {t.selectAtLeastOneZone}
              </p>
            )}
          </div>

        </div>

      </div>

      {/* Inline Slide-Down Symptoms & Organ Section (Opens smoothly ONLY when Proceed is clicked) */}
      {isSymptomSectionOpen && selectedRegions.length > 0 && (
        <div 
          ref={symptomSectionRef}
          className="scroll-mt-28 bg-white/95 dark:bg-slate-900/90 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 animate-in fade-in slide-in-from-top-6 duration-300 transition-all text-slate-900 dark:text-white"
        >
          {/* Header */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 border border-emerald-300 dark:border-emerald-800">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>
                  {selectedRegions.map((r) => lang === "hi" ? BODY_REGIONS[r]?.nameHi : BODY_REGIONS[r]?.nameEn).join(" • ")}
                </span>
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {t.drillDownTitle}
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium">
              {t.drillDownSubtitle}
            </p>
          </div>

          {/* 1. Affected Organs / Sub-areas */}
          {availableOrgans.length > 0 && (
            <div className="space-y-3">
              <label className="text-sm font-extrabold text-slate-800 dark:text-slate-200 block uppercase tracking-wider">
                {t.selectOrgans}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {availableOrgans.map((organ) => {
                  const isChecked = selectedOrgans.includes(organ.id);
                  return (
                    <button
                      key={organ.id}
                      type="button"
                      onClick={() => toggleOrgan(organ.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start space-x-3.5 ${
                        isChecked
                          ? "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 dark:text-emerald-50 shadow-md"
                          : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-emerald-300 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <span className="text-2xl mt-0.5 flex-shrink-0">{organ.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                            {lang === "hi" ? organ.nameHi : organ.nameEn}
                          </h4>
                          {isChecked && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
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
              <label className="text-sm font-extrabold text-slate-800 dark:text-slate-200 block uppercase tracking-wider">
                {t.selectSymptoms}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableSymptoms.map((symptom) => {
                  const isChecked = selectedSymptoms.includes(symptom.id);
                  return (
                    <button
                      key={symptom.id}
                      type="button"
                      onClick={() => toggleSymptom(symptom.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        isChecked
                          ? "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 dark:text-emerald-50 font-bold shadow-sm"
                          : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-emerald-300 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {lang === "hi" ? symptom.nameHi : symptom.nameEn}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center flex-shrink-0 ${
                          isChecked
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Don't Know / Not Sure Fallback Option */}
          <div
            onClick={handleDontKnowToggle}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start space-x-3.5 ${
              isDontKnow
                ? "bg-amber-50 dark:bg-amber-950/70 border-amber-500 ring-2 ring-amber-500/20 shadow-md"
                : "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 hover:border-amber-400"
            }`}
          >
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 mt-0.5 flex-shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm sm:text-base text-amber-900 dark:text-amber-200">
                  {t.dontKnowOption}
                </h4>
                {isDontKnow && <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />}
              </div>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5 font-medium">
                {t.dontKnowDesc}
              </p>
            </div>
          </div>

          {/* 4. Pain / Discomfort Severity Slider */}
          <div className="space-y-3 bg-slate-50 dark:bg-slate-950/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-sm font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
                <span>{t.painSeverity}</span>
              </label>
              <span
                className={`text-xs font-black px-3 py-1 rounded-xl border ${
                  painSeverity >= 8
                    ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-300 dark:border-red-800 animate-pulse"
                    : painSeverity >= 4
                    ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                    : "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                }`}
              >
                {painSeverity} / 10 (
                {painSeverity >= 8 ? t.severe : painSeverity >= 4 ? t.moderate : t.mild})
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="10"
              value={painSeverity}
              onChange={(e) => setPainSeverity(parseInt(e.target.value, 10))}
              className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />

            <div className="flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 pt-1">
              <span>{t.mild}</span>
              <span>{t.moderate}</span>
              <span>{t.severe}</span>
            </div>
          </div>

          {/* 5. Duration Selector */}
          <div className="space-y-3">
            <label className="text-sm font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t.duration}</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: "today", label: t.today },
                { id: "few_days", label: t.fewDays },
                { id: "more_than_week", label: t.moreThanWeek },
                { id: "chronic", label: t.chronic },
              ].map((item) => {
                const isSelected = duration === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDuration(item.id as any)}
                    className={`py-3 px-3 rounded-2xl border text-xs sm:text-sm font-bold transition-all text-center ${
                      isSelected
                        ? "bg-gradient-to-r from-emerald-600 to-teal-500 border-transparent text-white shadow-md shadow-emerald-500/25"
                        : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Confirm & Next Step CTA Button */}
          <button
            type="button"
            onClick={handleProceed}
            className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-lg sm:text-xl shadow-lg shadow-emerald-600/30 active:scale-[0.98] transition-all flex items-center justify-center space-x-3"
          >
            <span>{t.saveSymptoms || "Confirm Symptom Details"}</span>
            <ArrowRight className="w-6 h-6" />
          </button>

        </div>
      )}

    </div>
  );
};
