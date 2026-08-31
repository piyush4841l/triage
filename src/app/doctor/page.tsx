"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { LiveQueueBoard } from "@/components/dashboard/LiveQueueBoard";
import { DoctorStaffLogin, DoctorStaffSession } from "@/components/auth/DoctorStaffLogin";
import { Language } from "@/lib/i18n";
import { EmergencyFastTrackModal } from "@/components/emergency/EmergencyFastTrackModal";
import { Stethoscope, LogOut, ShieldCheck, User } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function DoctorPage() {
  const [selectedState, setSelectedState] = useState<string>("national");
  const { lang, setLang } = useLanguage();
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
        lang={lang}
        onLanguageChange={setLang}
        voiceGuide={voiceGuide}
        onVoiceGuideToggle={setVoiceGuide}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!session ? (
          /* Doctor / Staff Login Gate */
          <DoctorStaffLogin onLogin={handleLogin} lang={lang} />
        ) : (
          /* Logged In Doctor Portal & Live Queue Board */
          <LiveQueueBoard
            lang={lang}
            voiceGuide={voiceGuide}
            doctorName={session.name}
            onLogout={handleLogout}
          />
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
