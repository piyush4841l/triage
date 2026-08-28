"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { LiveQueueBoard } from "@/components/dashboard/LiveQueueBoard";
import { DoctorStaffLogin, DoctorStaffSession } from "@/components/auth/DoctorStaffLogin";
import { Language } from "@/lib/i18n";
import { EmergencyFastTrackModal } from "@/components/emergency/EmergencyFastTrackModal";
import { Stethoscope, LogOut, ShieldCheck, User } from "lucide-react";

export default function DoctorPage() {
  const [selectedState, setSelectedState] = useState<string>("national");
  const [lang, setLang] = useState<Language>("en");
  const [voiceGuide, setVoiceGuide] = useState<boolean>(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);

  // Authenticated Doctor/Staff Session State
  const [session, setSession] = useState<DoctorStaffSession | null>(null);

  const handleLogin = (s: DoctorStaffSession) => {
    setSession(s);
  };

  const handleLogout = () => {
    setSession(null);
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors">
      <Navbar
        selectedState={selectedState}
        onStateChange={setSelectedState}
        lang={lang}
        onLanguageChange={setLang}
        voiceGuide={voiceGuide}
        onVoiceGuideToggle={setVoiceGuide}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!session ? (
          /* Doctor / Staff Login Gate */
          <DoctorStaffLogin onLogin={handleLogin} lang={lang} />
        ) : (
          /* Logged In Doctor Portal & Live Queue Board */
          <div className="space-y-6">
            
            {/* Active Doctor Session Header Bar */}
            <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold flex-shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                      {session.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-300 dark:border-emerald-800">
                      {session.role}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center space-x-2">
                    <span>ID: {session.staffId}</span>
                    <span>•</span>
                    <span>Dept: {session.department}</span>
                    <span>•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" /> Authenticated
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 hover:border-rose-300 text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout Session</span>
              </button>
            </div>

            {/* Hospital OPD Queue & Triage Dashboard */}
            <LiveQueueBoard lang={lang} voiceGuide={voiceGuide} />
          </div>
        )}
      </main>

      <EmergencyFastTrackModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        lang={lang}
        voiceGuide={voiceGuide}
        onTokenGenerated={() => setIsEmergencyOpen(false)}
      />
    </div>
  );
}
