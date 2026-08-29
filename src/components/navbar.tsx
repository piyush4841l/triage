"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Volume2, 
  VolumeX, 
  Activity, 
  Languages, 
  MapPin, 
  ChevronDown, 
  Sun, 
  Moon, 
  Check, 
  Type,
  LayoutDashboard,
  Stethoscope,
  Monitor,
  ShieldCheck,
  Contrast
} from "lucide-react";
import { Language, translations } from "@/lib/i18n";
import { speakText, stopSpeaking } from "@/lib/speech";
import { INDIAN_STATES, StateInfo } from "@/lib/states-languages";
import { VOICE_PROMPTS } from "@/lib/speech-prompts";
import { useTheme } from "@/lib/theme-context";
import { useFontSize } from "@/lib/font-size-context";

interface NavbarProps {
  selectedState?: string;
  onStateChange?: (stateId: string) => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  voiceGuide: boolean;
  onVoiceGuideToggle: (val: boolean) => void;
  voiceLang?: Language;
  onVoiceLangChange?: (l: Language) => void;
  onOpenEmergency?: () => void;
  highContrast?: boolean;
  onHighContrastToggle?: (val: boolean) => void;
  onResetKiosk?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedState = "national",
  onStateChange,
  lang,
  onLanguageChange,
  voiceGuide,
  onVoiceGuideToggle,
  voiceLang = "en",
  onVoiceLangChange,
  onOpenEmergency,
}) => {
  const pathname = usePathname();
  const t = translations[lang] || translations.en;
  const { theme, toggleTheme } = useTheme();
  const { fontSize, setFontSize } = useFontSize();

  const [isStateOpen, setIsStateOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isFontSizeOpen, setIsFontSizeOpen] = useState(false);
  const [isVoiceMenuOpen, setIsVoiceMenuOpen] = useState(false);

  const stateMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const fontSizeMenuRef = useRef<HTMLDivElement>(null);
  const voiceMenuRef = useRef<HTMLDivElement>(null);

  const currentState = INDIAN_STATES.find((s) => s.id === selectedState) || INDIAN_STATES[0];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (stateMenuRef.current && !stateMenuRef.current.contains(e.target as Node)) {
        setIsStateOpen(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
      if (fontSizeMenuRef.current && !fontSizeMenuRef.current.contains(e.target as Node)) {
        setIsFontSizeOpen(false);
      }
      if (voiceMenuRef.current && !voiceMenuRef.current.contains(e.target as Node)) {
        setIsVoiceMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const effectiveVoiceLang = voiceLang || (lang === "hi" ? "hi" : lang === "en" ? "en" : "hi");

  const handleVoiceToggle = () => {
    // If user is on a regional language, open the speaking language popup
    if (lang !== "en" && lang !== "hi") {
      setIsVoiceMenuOpen(!isVoiceMenuOpen);
      setIsStateOpen(false);
      setIsLangOpen(false);
      setIsFontSizeOpen(false);
      return;
    }

    const nextVal = !voiceGuide;
    onVoiceGuideToggle(nextVal);
    if (!nextVal) {
      stopSpeaking();
    }
  };

  const handleSelectSpeakingVoice = (vLang: Language) => {
    if (onVoiceLangChange) {
      onVoiceLangChange(vLang);
    }
    onVoiceGuideToggle(true);
    setIsVoiceMenuOpen(false);
  };

  const handleSelectState = (st: StateInfo) => {
    if (onStateChange) onStateChange(st.id);
    setIsStateOpen(false);
    
    const targetLang = (st.primaryLanguageCode as Language) || "en";
    onLanguageChange(targetLang);
  };

  const handleSelectLanguage = (l: Language) => {
    onLanguageChange(l);
    setIsLangOpen(false);

    if (l !== "en" && l !== "hi" && onVoiceLangChange && voiceLang !== "en" && voiceLang !== "hi") {
      onVoiceLangChange("hi");
    }
  };

  const availableLanguages: { code: Language; label: string; subLabel: string; isDefault?: boolean }[] = [
    { code: "en", label: "English", subLabel: "Default", isDefault: true },
    { code: "hi", label: "हिंदी", subLabel: "Hindi" },
  ];

  if (
    currentState.primaryLanguageCode &&
    currentState.primaryLanguageCode !== "en" &&
    currentState.primaryLanguageCode !== "hi"
  ) {
    availableLanguages.push({
      code: currentState.primaryLanguageCode as Language,
      label: currentState.primaryLanguageNative,
      subLabel: `${currentState.primaryLanguage} (State)`,
    });
  }

  const currentLangObj = availableLanguages.find((l) => l.code === lang) || availableLanguages[0];
  const isRegionalLang = lang !== "en" && lang !== "hi";

  return (
    <>
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border-b border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white shadow-sm transition-colors">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between gap-2 sm:gap-4 h-18 sm:h-20 min-w-0">
          
          {/* 1. Left: Brand Logo & SIH Healthcare Badge */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 p-0.5 shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-black text-xl sm:text-2xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 dark:from-emerald-400 dark:via-teal-300 dark:to-white">
                    TRIAGE
                  </span>
                  <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                    AI-OPD
                  </span>
                </div>
                <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-400 leading-none hidden sm:block">
                  ABDM Smart Healthcare Kiosk
                </p>
              </div>
            </Link>
          </div>



          {/* 3. Right: Utility Controls */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0">
            
            {/* State Selector Dropdown */}
            <div className="relative" ref={stateMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setIsStateOpen(!isStateOpen);
                  setIsLangOpen(false);
                  setIsFontSizeOpen(false);
                  setIsVoiceMenuOpen(false);
                }}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all shadow-sm"
                title="Select State / राज्य चुनें"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span className="max-w-[75px] sm:max-w-[120px] truncate">{currentState.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0" />
              </button>

              {isStateOpen && (
                <div className="absolute right-0 mt-2 w-72 max-h-80 overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100 dark:border-slate-800">
                    Select State (राज्य चुनें)
                  </div>
                  {INDIAN_STATES.map((st) => {
                    const isSelected = st.id === currentState.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => handleSelectState(st)}
                        className={`w-full px-3 py-2.5 rounded-xl text-left text-xs sm:text-sm flex items-center justify-between transition-colors ${
                          isSelected
                            ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div>
                          <div className="font-bold">{st.name}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {st.primaryLanguageNative} • {st.primaryLanguage}
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Language Selector Dropdown */}
            <div className="relative" ref={langMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setIsLangOpen(!isLangOpen);
                  setIsStateOpen(false);
                  setIsFontSizeOpen(false);
                  setIsVoiceMenuOpen(false);
                }}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all shadow-sm"
                title="Select Language / भाषा चुनें"
              >
                <Languages className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>{currentLangObj.label}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100 dark:border-slate-800">
                    Language (भाषा)
                  </div>
                  {availableLanguages.map((l) => {
                    const isSelected = l.code === lang;
                    return (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => handleSelectLanguage(l.code)}
                        className={`w-full px-3 py-2.5 rounded-xl text-left text-xs sm:text-sm flex items-center justify-between transition-colors ${
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

            {/* Text Size Control */}
            <div className="relative" ref={fontSizeMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setIsFontSizeOpen(!isFontSizeOpen);
                  setIsStateOpen(false);
                  setIsLangOpen(false);
                  setIsVoiceMenuOpen(false);
                }}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all shadow-sm"
                title="Adjust Text Size / फॉन्ट आकार बदलें"
              >
                <Type className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span className="font-extrabold">{fontSize === "normal" ? "A" : fontSize === "large" ? "A+" : "A++"}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0" />
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

            {/* Speaking / Voice Guide Toggle Button & Speaking Language Selector */}
            <div className="relative" ref={voiceMenuRef}>
              <button
                type="button"
                onClick={handleVoiceToggle}
                className={`p-2 rounded-xl border transition-all flex items-center space-x-1 ${
                  voiceGuide
                    ? "bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border-emerald-500 shadow-[0_0_14px_rgba(16,185,129,0.35)]"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white"
                }`}
                title={voiceGuide ? t.voiceGuideActive : t.voiceGuide}
              >
                {voiceGuide ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
                {isRegionalLang && (
                  <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-300 hidden md:inline">
                    {effectiveVoiceLang === "en" ? "Eng" : effectiveVoiceLang === "hi" ? "हिं" : "Reg"}
                  </span>
                )}
              </button>

              {/* Voice Speaking Language Menu */}
              {isVoiceMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl z-50 p-2 space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1 text-[11px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span>Voice Language (आवाज)</span>
                    <button
                      type="button"
                      onClick={() => {
                        onVoiceGuideToggle(!voiceGuide);
                        if (voiceGuide) stopSpeaking();
                        setIsVoiceMenuOpen(false);
                      }}
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                        voiceGuide ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {voiceGuide ? "ON" : "OFF"}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 px-2 py-0.5">
                    Select audio assistant language:
                  </p>

                  {/* 1. English Voice */}
                  <button
                    type="button"
                    onClick={() => handleSelectSpeakingVoice("en")}
                    className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                      voiceGuide && effectiveVoiceLang === "en"
                        ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">🇬🇧</span>
                      <div>
                        <div className="font-bold">English</div>
                        <div className="text-[10px] text-slate-400">Clear Indian English Voice</div>
                      </div>
                    </div>
                    {voiceGuide && effectiveVoiceLang === "en" && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                  </button>

                  {/* 2. Hindi Voice */}
                  <button
                    type="button"
                    onClick={() => handleSelectSpeakingVoice("hi")}
                    className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                      voiceGuide && effectiveVoiceLang === "hi"
                        ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">🇮🇳</span>
                      <div>
                        <div className="font-bold">हिंदी (Hindi)</div>
                        <div className="text-[10px] text-slate-400">आवाज में हिंदी निर्देश</div>
                      </div>
                    </div>
                    {voiceGuide && effectiveVoiceLang === "hi" && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                  </button>

                  {/* 3. Regional Voice */}
                  {isRegionalLang && (
                    <button
                      type="button"
                      onClick={() => handleSelectSpeakingVoice(lang)}
                      className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                        voiceGuide && effectiveVoiceLang === lang
                          ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">🗣️</span>
                        <div>
                          <div className="font-bold">{currentLangObj.label}</div>
                          <div className="text-[10px] text-slate-400">Native State Voice</div>
                        </div>
                      </div>
                      {voiceGuide && effectiveVoiceLang === lang && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                    </button>
                  )}

                </div>
              )}
            </div>

            {/* Theme Toggle Button (Light/Dark/High Contrast) */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                theme === "high-contrast"
                  ? "bg-black text-white border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700"
              }`}
              title={`Switch Theme (Current: ${theme})`}
            >
              {theme === "high-contrast" ? (
                <>
                  <Contrast className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden lg:inline">Contrast</span>
                </>
              ) : theme === "dark" ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span className="hidden lg:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden lg:inline">Dark</span>
                </>
              )}
            </button>

            {/* SOS Emergency Button */}
            <button
              type="button"
              onClick={onOpenEmergency}
              className="flex items-center space-x-1.5 px-3 py-1.5 ml-1 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-500/20 dark:hover:bg-red-500/30 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 transition-colors font-bold text-xs shadow-sm"
              title="Emergency SOS"
            >
              <div className="w-4 h-4 rounded-full bg-red-600 dark:bg-red-500 text-white flex items-center justify-center">
                <span className="text-[10px] font-black">!</span>
              </div>
              <span className="tracking-widest">SOS</span>
            </button>

          </div>

        </div>
      </div>
    </header>

    {/* Portal Navigation Switcher (Moved to Bottom Right) */}
    <div className="fixed bottom-6 right-6 z-50">
      <nav
        aria-label="Portal Navigation"
        className="flex flex-row items-center gap-2 p-1.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 shadow-2xl"
      >
        {/* Kiosk Home */}
        <Link
          href="/"
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
            pathname === "/"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25 ring-1 ring-emerald-400/40"
              : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-700/70"
          }`}
        >
          <LayoutDashboard className="w-5 h-5 text-emerald-300 flex-shrink-0" />
          <span>Kiosk Home</span>
        </Link>

        {/* Doctor / Staff Portal */}
        <Link
          href="/doctor"
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
            pathname === "/doctor"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25 ring-1 ring-emerald-400/40"
              : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-700/70"
          }`}
        >
          <Stethoscope className="w-5 h-5 text-emerald-300 flex-shrink-0" />
          <span>Doctor / Staff Portal</span>
        </Link>

        {/* Live Waiting Display */}
        <Link
          href="/display"
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
            pathname === "/display"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25 ring-1 ring-emerald-400/40"
              : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-700/70"
          }`}
        >
          <Monitor className="w-5 h-5 text-emerald-300 flex-shrink-0" />
          <span>Live Waiting Display</span>
        </Link>
      </nav>
    </div>
    </>
  );
};
