"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Volume2, 
  VolumeX, 
  Activity, 
  Languages, 
  ChevronDown, 
  Sun, 
  Moon, 
  Check, 
  Type,
  ShieldCheck,
  Stethoscope
} from "lucide-react";
import { Language, translations, ALL_SCHEDULED_LANGUAGES } from "@/lib/i18n";
import { speakText, stopSpeaking } from "@/lib/speech";
import { VOICE_PROMPTS } from "@/lib/speech-prompts";
import { useTheme } from "@/lib/theme-context";
import { useFontSize } from "@/lib/font-size-context";
import { useLanguage } from "@/lib/language-context";

interface NavbarProps {
  lang?: Language;
  onLanguageChange?: (lang: Language) => void;
  voiceGuide?: boolean;
  onVoiceGuideToggle?: (val: boolean) => void;
  voiceLang?: Language;
  onVoiceLangChange?: (l: Language) => void;
  onOpenEmergency?: () => void;
  highContrast?: boolean;
  onHighContrastToggle?: (val: boolean) => void;
  onResetKiosk?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang: propLang,
  onLanguageChange: propOnLanguageChange,
  voiceGuide = false,
  onVoiceGuideToggle = () => {},
  voiceLang = "en",
  onVoiceLangChange,
  onOpenEmergency,
}) => {
  const pathname = usePathname();
  const { lang: contextLang, setLang: contextSetLang, t: contextT } = useLanguage();
  const lang = propLang || contextLang;
  const onLanguageChange = propOnLanguageChange || contextSetLang;
  const t = translations[lang] || contextT || translations.en;
  const { theme, toggleTheme } = useTheme();
  const { fontSize, setFontSize } = useFontSize();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isFontSizeOpen, setIsFontSizeOpen] = useState(false);

  const langMenuRef = useRef<HTMLDivElement>(null);
  const fontSizeMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
      if (fontSizeMenuRef.current && !fontSizeMenuRef.current.contains(e.target as Node)) {
        setIsFontSizeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleVoiceToggle = () => {
    const nextVal = !voiceGuide;
    onVoiceGuideToggle(nextVal);
    if (!nextVal) {
      stopSpeaking();
    }
  };

  const handleSelectLanguage = (l: Language) => {
    onLanguageChange(l);
    contextSetLang(l);
    setIsLangOpen(false);
  };

  const currentLangObj = ALL_SCHEDULED_LANGUAGES.find((l) => l.code === lang) || ALL_SCHEDULED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18">

          {/* 1. Left: Brand & Medical Identity */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-md shadow-emerald-500/15 border border-slate-200 dark:border-slate-700/80 group-hover:scale-105 transition-transform bg-white flex items-center justify-center p-0.5 flex-shrink-0">
                <img
                  src="/images/swasthya-setu-logo.jpg"
                  alt="SwasthyaSetu"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                SwasthyaSetu
              </span>
            </Link>
          </div>

          {/* 2. Right: Utility Controls (Language -> Text Size -> Theme -> Speaker) */}
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            
            {/* 1. Language Selector Dropdown */}
            <div className="relative" ref={langMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setIsLangOpen(!isLangOpen);
                  setIsFontSizeOpen(false);
                }}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold transition-all shadow-sm"
                title="Select Language / भाषा चुनें"
              >
                <Languages className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>{currentLangObj.label}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150 scrollbar-thin">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span>22 Scheduled Languages (भाषा)</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold">{ALL_SCHEDULED_LANGUAGES.length}</span>
                  </div>
                  {ALL_SCHEDULED_LANGUAGES.map((l) => {
                    const isSelected = l.code === lang;
                    return (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => handleSelectLanguage(l.code)}
                        className={`w-full px-3 py-2 rounded-xl text-left text-xs sm:text-sm flex items-center justify-between transition-colors ${
                          isSelected
                            ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold">{l.label}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                            {l.subLabel}
                          </span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Text Size Control */}
            <div className="relative" ref={fontSizeMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setIsFontSizeOpen(!isFontSizeOpen);
                  setIsLangOpen(false);
                }}
                className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold transition-all shadow-sm"
                title="Adjust Text Size / फॉन्ट आकार बदलें"
              >
                <Type className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span className="font-extrabold">{fontSize === "normal" ? "A" : fontSize === "large" ? "A+" : "A++"}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              </button>

              {isFontSizeOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100 dark:border-slate-800">
                    Text Size (फॉन्ट आकार)
                  </div>
                  {[
                    { id: "normal", label: "Normal (100%)", iconLabel: "A" },
                    { id: "large", label: "Large (115%)", iconLabel: "A+" },
                    { id: "xlarge", label: "Extra Large (130%)", iconLabel: "A++" },
                  ].map((opt) => {
                    const isSelected = fontSize === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setFontSize(opt.id as any);
                          setIsFontSizeOpen(false);
                        }}
                        className={`w-full px-3 py-2.5 rounded-xl text-left text-xs sm:text-sm flex items-center justify-between transition-colors ${
                          isSelected
                            ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-xs text-emerald-600 dark:text-emerald-400">
                            {opt.iconLabel}
                          </span>
                          <span className="font-semibold">{opt.label}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Theme Toggle Button (Light / Dark) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border text-xs sm:text-sm font-bold transition-all shadow-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>

            {/* 4. Speaking / Voice Guide Toggle Button (Mute / Unmute) */}
            <button
              type="button"
              onClick={handleVoiceToggle}
              suppressHydrationWarning
              className={`p-2.5 rounded-xl border transition-all flex items-center justify-center shadow-sm ${
                voiceGuide
                  ? "bg-emerald-600 text-white border-emerald-500 shadow-[0_0_14px_rgba(16,185,129,0.45)] active:scale-95"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white active:scale-95"
              }`}
              title={voiceGuide ? "Mute Voice Assistant" : "Turn On Voice Assistant"}
            >
              {voiceGuide ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
