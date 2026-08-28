"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import confetti from "canvas-confetti";
import { 
  Printer, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Activity, 
  RotateCcw,
  Sparkles,
  Smartphone,
  ExternalLink
} from "lucide-react";
import { StoredToken } from "@/lib/store";
import { Language, translations } from "@/lib/i18n";
import { speakText } from "@/lib/speech";

interface TokenReceiptModalProps {
  token: StoredToken;
  lang: Language;
  voiceGuide: boolean;
  onOpenWhatsApp: () => void;
  onReset: () => void;
}

export const TokenReceiptModal: React.FC<TokenReceiptModalProps> = ({
  token,
  lang,
  voiceGuide,
  onOpenWhatsApp,
  onReset,
}) => {
  const t = translations[lang];
  const { result, input } = token;

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#38bdf8", "#3b82f6", "#10b981", "#f59e0b"],
      });
    } catch (e) {
      // ignore
    }

    if (voiceGuide) {
      const isRed = result.priorityTier === "RED";
      const audioPrompt =
        lang === "hi"
          ? isRed
            ? `आपातकालीन टोकन ${result.tokenNumber} जारी हुआ। कृपया तुरंत कमरा 1 में जाएं।`
            : `टोकन नंबर ${result.tokenNumber} जारी किया गया है। आपका विभाग है ${result.departmentHi}, कमरा ${result.roomNumber}।`
          : isRed
          ? `Emergency Token ${result.tokenNumber} issued. Please proceed to Room 1 immediately.`
          : `Token number ${result.tokenNumber} issued. Assigned to ${result.department}, ${result.roomNumber}.`;
      speakText(audioPrompt, lang);
    }
  }, [result, lang, voiceGuide]);

  const handlePrint = () => {
    window.print();
  };

  const isEmergency = result.priorityTier === "RED";
  const trackerUrl = typeof window !== "undefined" ? `${window.location.origin}/tracker/${result.tokenNumber}` : `https://hospital-opd.gov.in/tracker/${result.tokenNumber}`;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Top Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border text-center relative overflow-hidden shadow-xl transition-colors ${
        isEmergency
          ? "bg-gradient-to-b from-red-100 dark:from-red-950 via-white dark:via-slate-900 to-slate-50 dark:to-slate-900 border-red-300 dark:border-red-500 shadow-red-500/10 dark:shadow-red-900/40"
          : "bg-gradient-to-b from-blue-100 dark:from-blue-950 via-white dark:via-slate-900 to-slate-50 dark:to-slate-900 border-blue-200 dark:border-cyan-500/40 shadow-blue-500/10 dark:shadow-cyan-900/30"
      }`}>
        <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-3 shadow-md border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CheckCircle2 className={`w-10 h-10 ${isEmergency ? "text-red-500" : "text-emerald-500"}`} />
        </div>

        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {t.tokenGeneratedTitle}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto mt-1">
          {t.tokenGeneratedSubtitle}
        </p>

        {/* Priority Tier Badge */}
        <div className="mt-4 inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border text-xs sm:text-sm font-black uppercase tracking-wider bg-white dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 shadow-sm">
          <span className={`w-2.5 h-2.5 rounded-full animate-ping ${isEmergency ? "bg-red-500" : "bg-emerald-500"}`} />
          <span className={isEmergency ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}>
            {isEmergency ? t.priorityEmergency : result.priorityTier === "YELLOW" ? t.priorityUrgent : t.priorityStandard}
          </span>
        </div>
      </div>

      {/* Main Digital Token Pass Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Token Highlight & Details (8 cols) */}
        <div className="md:col-span-8 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 flex flex-col justify-between transition-colors">
          
          <div className="space-y-6">
            
            {/* Big Token Number Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
              <div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
                  {t.tokenNumber}
                </span>
                <span className={`text-4xl sm:text-5xl font-black tracking-tight ${isEmergency ? "text-red-500 dark:text-red-400" : "text-blue-600 dark:text-cyan-400"}`}>
                  {result.tokenNumber}
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
                <Clock className="w-6 h-6 text-amber-500 dark:text-amber-400 flex-shrink-0" />
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase">
                    {t.estimatedWait}
                  </span>
                  <span className="text-lg font-black text-amber-600 dark:text-amber-300">
                    {result.estimatedWaitMinutes === 0 ? "Immediate (0 min)" : `~ ${result.estimatedWaitMinutes} ${t.minutes}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Room & Department Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center space-x-2 text-blue-600 dark:text-cyan-400 text-xs font-bold uppercase">
                  <Activity className="w-4 h-4" />
                  <span>{t.department}</span>
                </div>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {lang === "hi" ? result.departmentHi : result.department}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{result.assignedDoctorName}</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase">
                  <MapPin className="w-4 h-4" />
                  <span>{t.roomCounter}</span>
                </div>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {result.roomNumber}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{result.counterNumber}</p>
              </div>

            </div>

            {/* Patient & Symptoms Details */}
            <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-2 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                <div>
                  <span className="text-slate-500 dark:text-slate-500 block text-[11px] font-semibold uppercase">{t.patientName}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{input.patientName}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-500 block text-[11px] font-semibold uppercase">{t.patientAge}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{input.age} Yrs / {input.gender}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-500 block text-[11px] font-semibold uppercase">{t.maskedPhone}</span>
                  <span className="font-bold text-slate-900 dark:text-white">+91 ••••• {input.phone.slice(-4)}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-500 block text-[11px] font-semibold uppercase">{t.maskedAbha}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{input.abhaId ? `•••• •••• ${input.abhaId.slice(-4)}` : "Not Linked"}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80">
                <span className="text-slate-500 dark:text-slate-500 block text-[11px] font-semibold uppercase">{t.symptomsSummary}</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {lang === "en" ? result.chiefComplaintSummaryEn : result.chiefComplaintSummaryHi}
                </p>
              </div>
            </div>

          </div>

          {/* Quick Rationale / Doctor Guidance */}
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/30 text-xs text-emerald-900 dark:text-emerald-200 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>{lang === "en" ? result.triageRationaleEn : result.triageRationaleHi}</span>
          </div>

        </div>

        {/* Right: QR Code & Print / Dispatch Buttons (4 cols) */}
        <div className="md:col-span-4 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-6 text-center transition-colors">
          
          <div className="space-y-4 flex flex-col items-center">
            
            {/* Live QR Code with Scanner styling */}
            <div className="p-4 bg-white rounded-2xl shadow-md inline-block border-2 border-blue-500 dark:border-cyan-400">
              <QRCodeSVG
                value={trackerUrl}
                size={140}
                level="M"
                includeMargin={false}
              />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Scan with Mobile Camera
              </span>
              <p className="text-[11px] text-slate-500">
                Live queue position updates on your smartphone
              </p>
            </div>

          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5 w-full">
            
            {/* Print Slip Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-sm border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center space-x-2 shadow-sm active:scale-95"
            >
              <Printer className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>{t.printThermalSlip}</span>
            </button>

            {/* Send to WhatsApp Button */}
            <button
              type="button"
              onClick={onOpenWhatsApp}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2 active:scale-95"
            >
              <Smartphone className="w-4 h-4" />
              <span>{t.sendWhatsApp}</span>
            </button>

            {/* Open Phone Tracker Link */}
            <Link
              href={`/tracker/${result.tokenNumber}`}
              target="_blank"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-center space-x-1.5"
            >
              <span>{t.trackLiveQueue}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

          </div>

        </div>

      </div>

      {/* Done / Reset for Next Patient */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onReset}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-teal-300 text-white font-extrabold text-lg shadow-lg shadow-blue-500/25 active:scale-95 transition-all inline-flex items-center space-x-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>{t.createNewToken}</span>
        </button>
      </div>

      {/* 80mm Thermal Receipt Hidden Print DOM Element */}
      <div id="thermal-receipt-print" className="hidden">
        <div style={{ textAlign: "center", borderBottom: "1px dashed #000", paddingBottom: "4mm", marginBottom: "4mm" }}>
          <h2 style={{ fontSize: "14pt", margin: 0, fontWeight: "bold" }}>AIIMS / GOVT HOSPITAL OPD</h2>
          <p style={{ fontSize: "9pt", margin: "1mm 0" }}>National Health Mission - ABDM Verified</p>
          <p style={{ fontSize: "8pt", margin: 0 }}>TRIAGE Kiosk System</p>
        </div>

        <div style={{ textAlign: "center", margin: "4mm 0", padding: "2mm", border: "2px solid #000" }}>
          <span style={{ fontSize: "9pt", display: "block" }}>OPD TOKEN NUMBER</span>
          <span style={{ fontSize: "22pt", fontWeight: "bold", letterSpacing: "1px" }}>{result.tokenNumber}</span>
          <span style={{ fontSize: "9pt", display: "block", marginTop: "1mm" }}>
            PRIORITY: {result.priorityTier} ({result.priorityTier === "RED" ? "EMERGENCY" : "STANDARD"})
          </span>
        </div>

        <div style={{ fontSize: "9pt", lineHeight: "1.4", margin: "4mm 0" }}>
          <div><strong>Department:</strong> {result.department}</div>
          <div><strong>Room / Counter:</strong> {result.roomNumber} ({result.counterNumber})</div>
          <div><strong>Doctor:</strong> {result.assignedDoctorName}</div>
          <div><strong>Est. Wait Time:</strong> {result.estimatedWaitMinutes} Mins</div>
          <div style={{ borderTop: "1px dashed #000", margin: "2mm 0" }} />
          <div><strong>Patient:</strong> {input.patientName} ({input.age}Y/{input.gender})</div>
          <div><strong>Phone:</strong> +91 ••••• {input.phone.slice(-4)}</div>
          <div><strong>ABHA ID:</strong> {input.abhaId ? `•••• •••• ${input.abhaId.slice(-4)}` : "N/A"}</div>
          <div><strong>Symptoms:</strong> {result.chiefComplaintSummaryEn}</div>
          <div><strong>Date/Time:</strong> {new Date().toLocaleString()}</div>
        </div>

        <div style={{ textAlign: "center", marginTop: "4mm", borderTop: "1px dashed #000", paddingTop: "4mm" }}>
          <div style={{ display: "inline-block", padding: "2mm", background: "#fff" }}>
            <QRCodeSVG value={trackerUrl} size={100} />
          </div>
          <p style={{ fontSize: "8pt", margin: "2mm 0 0 0" }}>Scan to track live queue status on WhatsApp/Web</p>
          <p style={{ fontSize: "7pt", margin: "1mm 0" }}>कृपया अपनी बारी आने पर कमरे में जाएं। धन्यवाद।</p>
        </div>
      </div>

    </div>
  );
};
