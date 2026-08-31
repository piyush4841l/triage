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
    // Reset to normal 16px original scale
    setFontSizeState("normal");
    applyFontSize("normal");
    try {
      localStorage.removeItem("kiosk_font_size");
    } catch (e) {}
  }, []);

  const applyFontSize = (size: FontSize) => {
    const root = document.documentElement;
    root.setAttribute("data-font-size", size);
    if (size === "large") {
      root.style.fontSize = "17px";
    } else if (size === "xlarge") {
      root.style.fontSize = "18px";
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
