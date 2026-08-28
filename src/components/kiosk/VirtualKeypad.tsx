"use client";

import React from "react";
import { Delete, Check } from "lucide-react";

interface VirtualKeypadProps {
  onKeyPress: (digit: string) => void;
  onDelete: () => void;
  onDone: () => void;
  onClear?: () => void;
}

export const VirtualKeypad: React.FC<VirtualKeypadProps> = ({
  onKeyPress,
  onDelete,
  onDone,
  onClear,
}) => {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "del"];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-4 shadow-xl max-w-xs mx-auto transition-colors">
      <div className="grid grid-cols-3 gap-2.5">
        {keys.map((k) => {
          if (k === "del") {
            return (
              <button
                key={k}
                type="button"
                onClick={onDelete}
                className="h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-600 dark:text-rose-300 font-bold text-lg hover:bg-rose-100 dark:hover:bg-rose-900/60 active:scale-95 transition-all flex items-center justify-center shadow-sm"
                aria-label="Delete"
              >
                <Delete className="w-6 h-6" />
              </button>
            );
          }

          if (k === "clear") {
            return (
              <button
                key={k}
                type="button"
                onClick={onClear || onDelete}
                className="h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center uppercase tracking-wider"
              >
                Clear
              </button>
            );
          }

          return (
            <button
              key={k}
              type="button"
              onClick={() => onKeyPress(k)}
              className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-extrabold text-2xl hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 active:scale-95 transition-all shadow-sm flex items-center justify-center"
            >
              {k}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onDone}
        className="w-full mt-3 h-12 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-base shadow-md shadow-emerald-500/20 flex items-center justify-center space-x-2 active:scale-95 transition-all"
      >
        <Check className="w-5 h-5" />
        <span>Done</span>
      </button>
    </div>
  );
};
