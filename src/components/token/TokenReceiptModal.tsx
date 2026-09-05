"use client";

import React, { useState, useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { 
  Printer, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Activity, 
  Smartphone,
  FileHeart,
  Home,
  RotateCcw,
  RotateCw,
  AlertTriangle
} from "lucide-react";
import { StoredToken } from "@/lib/store";
import { 
  Language, 
  translations, 
  getLocalizedDepartment, 
  getLocalizedDoctor, 
  getLocalizedRoom, 
  getLocalizedCounter, 
  getLocalizedGender,
  getLocalizedChiefComplaint
} from "@/lib/i18n";
import { speakText } from "@/lib/speech";

interface TokenReceiptModalProps {
  token: StoredToken;
  lang: Language;
  voiceGuide: boolean;
  onOpenWhatsApp: () => void;
  onReset?: () => void;
}

export const TokenReceiptModal: React.FC<TokenReceiptModalProps> = ({
  token,
  lang,
  voiceGuide,
  onOpenWhatsApp,
  onReset,
}) => {
  const t = translations[lang] || translations.en;
  const { result, input } = token;
  const hasSpokenRef = useRef(false);

  // 1-minute auto-reset with 10-second warning countdown popup
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const initialTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleExecuteReset = () => {
    if (initialTimerRef.current) clearTimeout(initialTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    try {
      sessionStorage.removeItem("emergency_token");
      sessionStorage.removeItem("kiosk_session_state");
    } catch (e) {}
    if (onReset) {
      onReset();
    } else {
      window.location.href = "/";
    }
  };

  const startInitialTimer = () => {
    if (initialTimerRef.current) clearTimeout(initialTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    setShowTimeoutModal(false);
    setCountdown(10);

    // After 1 minute (60,000 ms), display the 10-second confirmation modal
    initialTimerRef.current = setTimeout(() => {
      setShowTimeoutModal(true);
      setCountdown(10);
    }, 60000);
  };

  useEffect(() => {
    startInitialTimer();
    return () => {
      if (initialTimerRef.current) clearTimeout(initialTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, []);

  // Countdown timer from 10 to 0 when warning modal appears
  useEffect(() => {
    if (!showTimeoutModal) return;

    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
          handleExecuteReset();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [showTimeoutModal]);

  const handleCancelAutoReset = () => {
    // Dismiss popup and reset timer for another 1 minute
    startInitialTimer();
  };

  useEffect(() => {
    if (!voiceGuide || hasSpokenRef.current) return;
    hasSpokenRef.current = true;
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
  }, [voiceGuide]);  // eslint-disable-line react-hooks/exhaustive-deps


  const handlePrint = () => {
    window.print();
  };

  const isEmergency = result.priorityTier === "RED" || !!input.isEmergencyOverride;
  const priorityLabel = isEmergency
    ? t.priorityEmergency
    : result.priorityTier === "YELLOW"
    ? t.priorityUrgent
    : t.priorityStandard;

  const trackerUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/tracker/${result.tokenNumber}` 
    : `https://hospital-opd.gov.in/tracker/${result.tokenNumber}`;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3 animate-in fade-in duration-300">
      
      {/* ── 1. Top Compact Header ── */}
      <div className="text-center pb-0.5">
        <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
          {t.tokenGeneratedTitle}
        </h1>
      </div>

      {/* ── 2. Main Unified Token & QR Card (Zero-Scroll Fit) ── */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5 transition-all">
        
        {/* Card Header: Token Number Hero, Priority Badge & Estimated Wait Time */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2.5">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
              {t.tokenNumber}
            </span>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-blue-600 dark:text-cyan-400">
                {result.tokenNumber}
              </span>
              
              {/* Emergency Priority Badge Only (Hidden on OPD tokens) */}
              {isEmergency && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-sm bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  {priorityLabel}
                </span>
              )}
            </div>
          </div>

          {/* Estimated Wait Time */}
          <div className="bg-slate-50/80 dark:bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center space-x-2 self-start sm:self-auto shadow-sm">
            <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400 flex-shrink-0" />
            <div>
              <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">
                {t.estimatedWait}
              </span>
              <span className="text-xs sm:text-sm font-black text-amber-600 dark:text-amber-300">
                {result.estimatedWaitMinutes === 0 ? t.immediateWait : `~ ${result.estimatedWaitMinutes} ${t.minutes}`}
              </span>
            </div>
          </div>
        </div>

        {/* Card Body: Split Grid (Left Details 7 cols, Right QR & Actions 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
          
          {/* ── Left Column: Department, Room, Patient & Symptoms (7 cols) ── */}
          <div className="lg:col-span-7 flex flex-col gap-2.5">
            
            {/* Department & Room Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-shrink-0">
              {/* Department */}
              <div className="bg-slate-50/80 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-0.5 shadow-sm">
                <div className="flex items-center space-x-1.5 text-blue-600 dark:text-cyan-400 text-[10px] font-bold uppercase">
                  <Activity className="w-3 h-3" />
                  <span>{t.department}</span>
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white break-words">
                  {getLocalizedDepartment(result.department, lang, result.departmentHi)}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {getLocalizedDoctor(result.assignedDoctorName, lang)}
                </p>
              </div>

              {/* Room / Counter */}
              <div className="bg-slate-50/80 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-0.5 shadow-sm">
                <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase">
                  <MapPin className="w-3 h-3" />
                  <span>{t.roomCounter}</span>
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white break-words">
                  {getLocalizedRoom(result.roomNumber, lang)}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {getLocalizedCounter(result.counterNumber, lang)}
                </p>
              </div>
            </div>

            {/* Patient Info Card — Compact & Clean */}
            <div className="flex-1 bg-slate-50/80 dark:bg-slate-950/60 p-3 sm:p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between gap-2.5 shadow-sm">
              <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">{t.patientName}</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-xs truncate block">{input.patientName}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">{t.patientAge}</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-xs block">
                    {input.age} {t.years} / {getLocalizedGender(input.gender, t)}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">{t.maskedPhone}</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-xs font-mono block">+91 ••••• {input.phone.slice(-4)}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">{t.maskedAbha}</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs font-mono block">
                    {input.abhaId ? `•••• •••• ${input.abhaId.slice(-4)}` : t.notLinked}
                  </span>
                </div>
              </div>

              {/* Reported Symptoms OR Shifted Action Buttons on Emergency Token */}
              {isEmergency ? (
                <div className="pt-2.5 border-t border-slate-200/80 dark:border-slate-800">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                    {/* WhatsApp Button */}
                    <button
                      type="button"
                      onClick={onOpenWhatsApp}
                      className="w-full py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm active:scale-[0.99] transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Smartphone className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{t.sendWhatsApp}</span>
                    </button>

                    {/* Print Token Button */}
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="w-full py-2.5 px-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center space-x-1.5 shadow-sm active:scale-[0.99] cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                      <span className="truncate">{t.printToken}</span>
                    </button>

                    {/* Back to Home Button */}
                    <button
                      type="button"
                      onClick={handleExecuteReset}
                      className="w-full py-2.5 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center space-x-1.5 shadow-sm active:scale-[0.99] cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      <span className="truncate">{t.backToHome}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 space-y-1">
                  <div className="flex items-start gap-1.5">
                    <FileHeart className="w-3 h-3 text-rose-500 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">{t.symptomsSummary}</span>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {getLocalizedChiefComplaint(result, input, lang)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* ── Right Column: QR Code & Action Buttons (5 cols) ── */}
          <div className={`lg:col-span-5 bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 sm:p-4 flex flex-col ${isEmergency ? "items-center justify-center" : "justify-between"} gap-3 text-center shadow-sm`}>
            
            {/* QR Code Container (Centered) */}
            <div className={`flex flex-col items-center justify-center space-y-2.5 py-0.5 ${isEmergency ? "my-auto" : ""}`}>
              <div className="p-2.5 bg-white rounded-xl shadow-sm inline-block border border-slate-200 dark:border-slate-700">
                <QRCodeSVG
                  value={trackerUrl}
                  size={isEmergency ? 125 : 110}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <div className="space-y-0.5 max-w-[200px]">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {t.trackLiveQueue}
                </h3>
              </div>
            </div>

            {/* Action Buttons (Rendered here only when NOT emergency) */}
            {!isEmergency && (
              <div className="space-y-2 w-full">
                {/* WhatsApp Button (Primary) */}
                <button
                  type="button"
                  onClick={onOpenWhatsApp}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>{t.sendWhatsApp}</span>
                </button>

                {/* Print Token Button (Secondary) */}
                <button
                  type="button"
                  onClick={handlePrint}
                  className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center space-x-2 shadow-sm active:scale-[0.99]"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>{t.printToken}</span>
                </button>

                {/* Back to Initial Page / Start New Registration */}
                <button
                  type="button"
                  onClick={handleExecuteReset}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center space-x-2 shadow-sm active:scale-[0.99]"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{t.backToHome}</span>
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* ── 10-Second Auto-Reset Modal Popup (Appears after 1 minute of inactivity) ── */}
      {showTimeoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white dark:bg-slate-900 border-2 border-amber-500/50 dark:border-amber-500/40 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-5 text-center relative overflow-hidden">
            
            {/* Top decorative clock icon */}
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/60 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400 shadow-inner">
              <Clock className="w-7 h-7 animate-pulse" />
            </div>

            {/* Countdown Display */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-amber-500 text-white font-black text-xl font-mono shadow-md">
                {countdown}s remaining
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white pt-1">
                {lang === "hi" ? "सत्र स्वतः रीसेट होने वाला है" : "Auto-Resetting Screen"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs mx-auto">
                {lang === "hi"
                  ? `अगले मरीज के लिए यह स्क्रीन ${countdown} सेकंड में स्वतः रीसेट हो जाएगी। यदि आपको और समय चाहिए, तो 'यहाँ रहें' चुनें।`
                  : `This screen will automatically reset in ${countdown} seconds for the next patient. Click 'Stay on Screen' if you need more time.`}
              </p>
            </div>

            {/* Visual Animated Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-200 dark:border-slate-700">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${(countdown / 10) * 100}%` }}
              />
            </div>

            {/* Modal Actions: Cancel Auto-Reset (Stay) vs Reset Now */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleCancelAutoReset}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{lang === "hi" ? "यहाँ रहें (रद्द करें)" : "Stay on Screen"}</span>
              </button>

              <button
                type="button"
                onClick={handleExecuteReset}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 transition-all active:scale-95 cursor-pointer"
              >
                <span>{lang === "hi" ? "अभी रीसेट करें" : "Reset Now"}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 80mm Thermal Receipt Hidden Print DOM Element */}
      <div id="thermal-receipt-print" className="hidden print:block">
        <div style={{ textAlign: "center", borderBottom: "1px dashed #000", paddingBottom: "4mm", marginBottom: "4mm" }}>
          <h2 style={{ fontSize: "14pt", margin: 0, fontWeight: "bold" }}>AIIMS / GOVT HOSPITAL OPD</h2>
          <p style={{ fontSize: "9pt", margin: "1mm 0" }}>National Health Mission - ABDM Verified</p>
          <p style={{ fontSize: "8pt", margin: 0 }}>SwasthyaSetu Kiosk System</p>
        </div>

        <div style={{ textAlign: "center", margin: "4mm 0", padding: "2mm", border: "2px solid #000" }}>
          <span style={{ fontSize: "9pt", display: "block" }}>{t.tokenNumber.toUpperCase()}</span>
          <span style={{ fontSize: "22pt", fontWeight: "bold", letterSpacing: "1px" }}>{result.tokenNumber}</span>
          {isEmergency && (
            <span style={{ fontSize: "9pt", display: "block", marginTop: "1mm" }}>
              {t.priorityLevel}: {priorityLabel}
            </span>
          )}
        </div>

        <div style={{ fontSize: "9pt", lineHeight: "1.4", margin: "4mm 0" }}>
          <div><strong>{t.department}:</strong> {getLocalizedDepartment(result.department, lang, result.departmentHi)}</div>
          <div><strong>{t.roomCounter}:</strong> {getLocalizedRoom(result.roomNumber, lang)} ({getLocalizedCounter(result.counterNumber, lang)})</div>
          <div><strong>{t.doctorTitle}</strong> {getLocalizedDoctor(result.assignedDoctorName, lang)}</div>
          <div><strong>{t.estimatedWait}:</strong> {result.estimatedWaitMinutes === 0 ? t.immediateWait : `${result.estimatedWaitMinutes} ${t.minutes}`}</div>
          <div style={{ borderTop: "1px dashed #000", margin: "2mm 0" }} />
          <div><strong>{t.patientName}:</strong> {input.patientName} ({input.age} {t.years}/{getLocalizedGender(input.gender, t)})</div>
          <div><strong>{t.maskedPhone}:</strong> +91 ***** {input.phone.slice(-4)}</div>
          {input.abhaId && <div><strong>{t.maskedAbha}:</strong> **** **** {input.abhaId.slice(-4)}</div>}
          {!isEmergency && (
            <>
              <div style={{ borderTop: "1px dashed #000", margin: "2mm 0" }} />
              <div><strong>{t.symptomsSummary}:</strong> {getLocalizedChiefComplaint(result, input, lang)}</div>
            </>
          )}
        </div>

        <div style={{ textAlign: "center", borderTop: "1px dashed #000", paddingTop: "3mm", marginTop: "3mm" }}>
          <p style={{ fontSize: "8pt", margin: 0 }}>Please proceed to your assigned room counter.</p>
          <p style={{ fontSize: "8pt", margin: "1mm 0 0 0" }}>Scan QR code on Kiosk for live updates.</p>
        </div>
      </div>

    </div>
  );
};
