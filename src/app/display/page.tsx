"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Clock, 
  Activity, 
  Volume2, 
  ArrowLeft, 
  CheckCircle2, 
  DoorOpen, 
  Users, 
  CalendarDays
} from "lucide-react";
import { getStoredTokens, StoredToken } from "@/lib/store";

export default function DisplayPage() {
  const [tokens, setTokens] = useState<StoredToken[]>([]);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");

  const refreshTokens = () => {
    setTokens(getStoredTokens());
  };

  useEffect(() => {
    refreshTokens();
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setCurrentDate(now.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "short", year: "numeric" }));
    };
    updateDateTime();

    const timer = setInterval(updateDateTime, 1000);
    const poller = setInterval(refreshTokens, 2500);
    return () => {
      clearInterval(timer);
      clearInterval(poller);
    };
  }, []);

  const calledTokens = tokens.filter((t) => t.status === "CALLED");
  const inConsultTokens = tokens.filter((t) => t.status === "IN_CONSULTATION");
  const waitingTokens = tokens.filter((t) => t.status === "WAITING");

  // Tokens ready for Part A ("You can go now")
  const activeNowTokens = [...calledTokens, ...inConsultTokens];

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white p-3 sm:p-4 lg:p-5 flex flex-col justify-between select-none transition-colors">
      
      {/* 1. Top TV Signage Header with Date & Time in Top Right Corner */}
      <header className="flex-shrink-0 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        
        {/* Left: Branding & Back Button */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link
            href="/"
            className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-sm hover:scale-105 transition-all"
            title="Back to Kiosk"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-xl sm:text-2xl tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 dark:from-emerald-400 dark:via-teal-300 dark:to-white">
                OPD TOKEN DISPLAY
              </span>
            </div>
          </div>
        </div>

        {/* Right: Preserved Time System + Added Current Date */}
        <div className="text-right flex items-center space-x-2 sm:space-x-3">
          <div className="hidden sm:flex flex-col items-end mr-1">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              {currentDate || "Thursday, 27 Aug 2026"}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              CURRENT TIME
            </span>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 sm:px-4 py-1.5 rounded-xl shadow-sm">
            <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-wider">
              {currentTime || "10:30:00 AM"}
            </span>
          </div>
        </div>

      </header>

      {/* 2. Main Two-Division Layout: Part A & Part B (Viewport Locked) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-3 flex-1 min-h-0 items-stretch">
        
        {/* ── PART A: "You can go now" (अब कमरे में जाएं) ── */}
        <div className="bg-white dark:bg-slate-900/90 border-2 border-emerald-500 dark:border-emerald-500/80 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between min-h-0 relative overflow-hidden transition-colors">
          <div className="absolute -top-24 -left-24 w-52 h-52 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Part A Header */}
          <div className="flex-shrink-0 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5 text-emerald-600 dark:text-emerald-400">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center flex-shrink-0 animate-pulse">
                <DoorOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase">
                  Please Proceed Inside
                </h2>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/90 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
              <Volume2 className="w-3 h-3" />
              <span>LIVE CALLING</span>
            </span>
          </div>

          {/* Part A Cards List (2-column dense grid) */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 my-2">
            {activeNowTokens.length === 0 ? (
              <div className="h-full min-h-[160px] flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 space-y-2 text-center p-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-slate-400" />
                </div>
                <p className="font-bold text-sm sm:text-base text-slate-700 dark:text-slate-300">Waiting for Next Token Call...</p>
                <p className="text-[11px] text-slate-500 max-w-sm">
                  When your token is called by the doctor, it will appear here immediately.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeNowTokens.map((t) => {
                  const isEmergency = t.result.priorityTier === "RED";
                  const cleanRoom = t.result.roomNumber.split("(")[0].trim();
                  return (
                    <div
                      key={t.id}
                      className={`px-3.5 py-2.5 rounded-xl border-2 transition-all flex items-center justify-between gap-2 shadow-sm ${
                        isEmergency
                          ? "bg-red-50/90 dark:bg-red-950/80 border-red-500 ring-2 ring-red-500/30 animate-pulse"
                          : "bg-emerald-50/70 dark:bg-slate-950 border-emerald-500 dark:border-emerald-500/80"
                      }`}
                    >
                      {/* Token Code */}
                      <span className={`text-xl font-black font-mono tracking-wider ${isEmergency ? "text-red-600 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"}`}>
                        {t.result.tokenNumber}
                      </span>

                      {/* Room Code */}
                      <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                        {cleanRoom}
                      </span>

                      {/* Ready Badge */}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-black flex-shrink-0">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Ready</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* ── Waiting List ── */}
        <div className="bg-white dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between min-h-0 transition-colors">
          
          {/* Waiting List Header */}
          <div className="flex-shrink-0 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase">
                  Waiting List
                </h3>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-black uppercase tracking-wider">
              {waitingTokens.length} Waiting
            </span>
          </div>

          {/* Part B Waiting Grid (Dense multi-column inline chips) */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 my-2">
            {waitingTokens.length === 0 ? (
              <div className="h-full min-h-[160px] flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 space-y-2 text-center p-4">
                <Users className="w-10 h-10 text-slate-300 dark:text-slate-700" />
                <p className="font-bold text-sm sm:text-base text-slate-700 dark:text-slate-300">No Patients in Waiting Queue</p>
                <p className="text-[11px] text-slate-500">All registered OPD tokens have been cleared or called.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                {waitingTokens.map((w) => {
                  const cleanRoom = w.result.roomNumber.split("(")[0].trim();
                  return (
                    <div
                      key={w.id}
                      className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm"
                    >
                      {/* Token Code */}
                      <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white font-mono tracking-wider">
                        {w.result.tokenNumber}
                      </span>

                      {/* Assigned Room */}
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 truncate">
                        {cleanRoom}
                      </span>

                      {/* Estimated Wait */}
                      <span className="px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold flex-shrink-0">
                        ~{w.result.estimatedWaitMinutes}m
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* 3. Clean TV Footer */}
      <footer className="flex-shrink-0 border-t border-slate-200 dark:border-slate-800 pt-2.5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-1.5">
        <div className="flex items-center space-x-2">
          <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>SwasthyaSetu Centralized Hospital Information Management System</span>
        </div>
        <div className="flex items-center space-x-3 text-slate-500 dark:text-slate-400">
          <span>ABDM Realtime Synchronized</span>
          <span>•</span>
          <span>Voice announcements enabled in Hindi & Regional Languages</span>
        </div>
      </footer>

    </div>
  );
}
