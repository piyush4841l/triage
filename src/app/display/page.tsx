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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white p-4 sm:p-6 lg:p-8 flex flex-col justify-between select-none transition-colors">
      
      {/* 1. Top TV Signage Header with Date & Time in Top Right Corner */}
      <header className="flex items-center justify-between border-b-2 border-slate-200 dark:border-slate-800 pb-4">
        
        {/* Left: Branding & Back Button */}
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-sm hover:scale-105 transition-all"
            title="Back to Kiosk"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-2xl sm:text-3xl tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 dark:from-emerald-400 dark:via-teal-300 dark:to-white">
                LIVE QUEUE DISPLAY
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              एम्स ओपीडी लाइव प्रतीक्षा बोर्ड • Real-Time OPD Token Calling Screen
            </p>
          </div>
        </div>

        {/* Right: Preserved Time System + Added Current Date */}
        <div className="text-right flex items-center space-x-3">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              {currentDate || "Thursday, 27 Aug 2026"}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              CURRENT TIME
            </span>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-2xl shadow-sm">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-wider">
              {currentTime || "10:30:00 AM"}
            </span>
          </div>
        </div>

      </header>

      {/* 2. Main Two-Division Layout: Part A & Part B (No Emergency Banner) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6 flex-1 items-stretch">
        
        {/* ── PART A: "You can go now" (अब कमरे में जाएं) ── */}
        <div className="bg-white dark:bg-slate-900/90 border-2 border-emerald-500 dark:border-emerald-500/80 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between space-y-5 relative overflow-hidden transition-colors">
          <div className="absolute -top-24 -left-24 w-52 h-52 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Part A Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-3 text-emerald-600 dark:text-emerald-400">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center flex-shrink-0 animate-pulse">
                <DoorOpen className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase flex items-center gap-2">
                  <span>Part A: You can go now</span>
                </h2>
                <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">
                  अब कमरे में जाएं • Please proceed immediately to your assigned room
                </p>
              </div>
            </div>

            <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/90 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
              <Volume2 className="w-3.5 h-3.5" />
              <span>LIVE CALLING</span>
            </span>
          </div>

          {/* Sub-column Table Header for Part A */}
          <div className="grid grid-cols-12 gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            <div className="col-span-5 sm:col-span-4">Token Number</div>
            <div className="col-span-4 sm:col-span-4 text-center sm:text-left">Assigned Room</div>
            <div className="col-span-3 sm:col-span-4 text-right">Department / Status</div>
          </div>

          {/* Part A Cards / Rows List */}
          <div className="space-y-3.5 flex-1 max-h-[560px] overflow-y-auto pr-1">
            {activeNowTokens.length === 0 ? (
              <div className="h-72 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 space-y-3 text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-slate-400" />
                </div>
                <p className="font-bold text-lg text-slate-700 dark:text-slate-300">Waiting for Next Token Call...</p>
                <p className="text-xs text-slate-500 max-w-sm">
                  Doctors and clinical staff will call the next tokens in order. When your token is called, it will appear here.
                </p>
              </div>
            ) : (
              activeNowTokens.map((t) => {
                const isEmergency = t.result.priorityTier === "RED";
                return (
                  <div
                    key={t.id}
                    className={`p-4 sm:p-5 rounded-2xl border-2 transition-all grid grid-cols-12 gap-2 items-center shadow-md ${
                      isEmergency
                        ? "bg-red-50/90 dark:bg-red-950/80 border-red-500 ring-2 ring-red-500/30 animate-pulse"
                        : "bg-emerald-50/70 dark:bg-slate-950 border-emerald-500 dark:border-emerald-500/80"
                    }`}
                  >
                    {/* Token Number & Patient Name */}
                    <div className="col-span-5 sm:col-span-4 space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                        YOUR TOKEN
                      </span>
                      <span className={`text-3xl sm:text-4xl font-black ${isEmergency ? "text-red-600 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"}`}>
                        {t.result.tokenNumber}
                      </span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block truncate max-w-[160px]">
                        {t.input.patientName}
                      </span>
                    </div>

                    {/* Assigned Room to Go To */}
                    <div className="col-span-4 sm:col-span-4 space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                        GO TO ROOM
                      </span>
                      <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white block">
                        {t.result.roomNumber}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 block">
                        {t.result.counterNumber}
                      </span>
                    </div>

                    {/* Department & Status */}
                    <div className="col-span-3 sm:col-span-4 text-right space-y-1">
                      <span className="inline-block px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-extrabold text-slate-800 dark:text-slate-200">
                        {t.result.department}
                      </span>
                      <div className="flex items-center justify-end space-x-1 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ready In Room</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-center text-xs font-semibold text-emerald-900 dark:text-emerald-300">
            🔔 Please have your token slip or digital QR receipt ready when entering the consultation room.
          </div>

        </div>

        {/* ── PART B: "Currently in waiting list" (प्रतीक्षारत सूची) ── */}
        <div className="bg-white dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5 flex flex-col justify-between transition-colors">
          
          {/* Part B Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center flex-shrink-0">
                <Users className="w-7 h-7 text-slate-700 dark:text-slate-300" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                  Part B: Currently in waiting list
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                  प्रतीक्षारत सूची • As per your token, your assigned room is listed below
                </p>
              </div>
            </div>

            <span className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-black uppercase tracking-wider">
              {waitingTokens.length} Waiting
            </span>
          </div>

          {/* Sub-column Table Header for Part B */}
          <div className="grid grid-cols-12 gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            <div className="col-span-5 sm:col-span-5">Token & Queue #</div>
            <div className="col-span-4 sm:col-span-4">Assigned Room</div>
            <div className="col-span-3 sm:col-span-3 text-right">Est. Wait</div>
          </div>

          {/* Part B Waiting Rows List */}
          <div className="space-y-2.5 flex-1 max-h-[560px] overflow-y-auto pr-1">
            {waitingTokens.length === 0 ? (
              <div className="h-72 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 space-y-2 text-center p-6">
                <Users className="w-12 h-12 text-slate-300 dark:text-slate-700" />
                <p className="font-bold text-lg text-slate-700 dark:text-slate-300">No Patients in Waiting Queue</p>
                <p className="text-xs text-slate-500">All registered OPD tokens have been cleared or called.</p>
              </div>
            ) : (
              waitingTokens.map((w, idx) => (
                <div
                  key={w.id}
                  className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 grid grid-cols-12 gap-2 items-center hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm"
                >
                  {/* Position & Token */}
                  <div className="col-span-5 sm:col-span-5 flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black text-xs sm:text-sm flex items-center justify-center flex-shrink-0">
                      #{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <span className="font-black text-lg sm:text-xl text-slate-900 dark:text-white block truncate">
                        {w.result.tokenNumber}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block truncate">
                        {w.result.department}
                      </span>
                    </div>
                  </div>

                  {/* As Per Your Token Go To Room */}
                  <div className="col-span-4 sm:col-span-4 min-w-0">
                    <span className="text-xs sm:text-sm font-black text-emerald-700 dark:text-emerald-400 block truncate">
                      {w.result.roomNumber}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                      {w.result.counterNumber}
                    </span>
                  </div>

                  {/* Estimated Wait */}
                  <div className="col-span-3 sm:col-span-3 text-right">
                    <span className="px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-xs font-extrabold inline-block">
                      ~{w.result.estimatedWaitMinutes}m
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center text-xs text-slate-600 dark:text-slate-400">
            ⏳ Waiting times are dynamically calculated based on current doctor consultation pacing.
          </div>

        </div>

      </div>

      {/* 3. Clean TV Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>TRIAGE Centralized Hospital Information Management System</span>
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
