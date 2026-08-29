"use client";

import React from "react";
import { Wand2, Zap, Mic } from "lucide-react";
import { Language } from "@/lib/i18n";

interface LandingScreenProps {
  onStartReal: () => void;
  onStartDemo: () => void;
  lang: Language;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onStartReal,
  onStartDemo,
  lang,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] space-y-12 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Central Card */}
      <div className="relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-2xl p-10 sm:p-14 text-center max-w-2xl w-full mx-4">
        
        {/* Step Badge at top */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="flex space-x-1 mb-1">
            <div className="w-4 h-1.5 bg-teal-800 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
            <span className="text-[10px] font-bold text-slate-400 ml-2 tracking-widest">STEP 1/4</span>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-full px-6 py-1.5 shadow-sm">
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 tracking-wider">
              CHECK-IN • चेक-इन
            </span>
          </div>
        </div>

        {/* Headings */}
        <div className="mt-6 mb-10 space-y-3">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-800 dark:text-white tracking-tight">
            Care that <span className="text-teal-500">listens.</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
            Under a minute. Just tap or speak.
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <button
            onClick={onStartReal}
            className="w-full relative group overflow-hidden rounded-2xl bg-gradient-to-r from-teal-500 to-sky-400 p-[2px] transition-transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-teal-500/20"
          >
            <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-colors"></div>
            <div className="relative bg-gradient-to-r from-teal-500/90 to-sky-400/90 hover:from-teal-500 hover:to-sky-400 rounded-xl px-8 py-5 flex items-center justify-center space-x-3 text-white">
              <Wand2 className="w-6 h-6" />
              <span className="text-xl font-bold">Start Check-In</span>
              <div className="w-8 h-8 rounded-full bg-white text-sky-500 flex items-center justify-center ml-2">
                <span className="font-bold">→</span>
              </div>
            </div>
          </button>

          <button
            onClick={onStartDemo}
            className="w-full flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-sky-600 dark:text-sky-400 border border-slate-100 dark:border-slate-700 transition-colors font-bold text-lg"
          >
            <Zap className="w-5 h-5" />
            <span>Fill demo info & start</span>
            <span>→</span>
          </button>
        </div>

        {/* Footer Text */}
        <div className="mt-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
          No OTP • No login needed
        </div>
      </div>

    </div>
  );
};
