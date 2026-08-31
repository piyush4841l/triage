"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Language, translations, TranslationDictionary } from "./i18n";

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  // Restore saved language from localStorage/sessionStorage
  useEffect(() => {
    try {
      const saved = (localStorage.getItem("kiosk_app_language") || sessionStorage.getItem("kiosk_app_language")) as Language;
      if (saved && translations[saved]) {
        setLangState(saved);
      }
    } catch (e) {}
  }, []);

  const setLang = (nextLang: Language) => {
    setLangState(nextLang);
    try {
      localStorage.setItem("kiosk_app_language", nextLang);
      sessionStorage.setItem("kiosk_app_language", nextLang);
    } catch (e) {}
  };

  const t = translations[lang] || translations.en;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
