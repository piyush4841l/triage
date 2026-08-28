"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type FontSize = "normal" | "large" | "xlarge";

interface FontSizeContextValue {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

const FontSizeContext = createContext<FontSizeContextValue>({
  fontSize: "normal",
  setFontSize: () => {},
  increaseFontSize: () => {},
  decreaseFontSize: () => {},
});

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>("normal");

  useEffect(() => {
    const saved = localStorage.getItem("kiosk_font_size") as FontSize | null;
    const initial = saved === "large" || saved === "xlarge" || saved === "normal" ? saved : "normal";
    setFontSizeState(initial);
    applyFontSize(initial);
  }, []);

  const applyFontSize = (size: FontSize) => {
    const root = document.documentElement;
    root.setAttribute("data-font-size", size);
    if (size === "large") {
      root.style.fontSize = "18px";
    } else if (size === "xlarge") {
      root.style.fontSize = "20px";
    } else {
      root.style.fontSize = "16px";
    }
  };

  const setFontSize = (nextSize: FontSize) => {
    setFontSizeState(nextSize);
    localStorage.setItem("kiosk_font_size", nextSize);
    applyFontSize(nextSize);
  };

  const increaseFontSize = () => {
    if (fontSize === "normal") setFontSize("large");
    else if (fontSize === "large") setFontSize("xlarge");
  };

  const decreaseFontSize = () => {
    if (fontSize === "xlarge") setFontSize("large");
    else if (fontSize === "large") setFontSize("normal");
  };

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize, increaseFontSize, decreaseFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export const useFontSize = () => useContext(FontSizeContext);
