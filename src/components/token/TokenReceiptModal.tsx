"use client";

import React, { useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { 
  Printer, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Activity, 
  Smartphone,
  FileHeart,
  Sparkles,
  Home,
  RotateCcw
} from "lucide-react";
import { StoredToken } from "@/lib/store";
import { Language, translations } from "@/lib/i18n";
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
  const t = translations[lang];
  const { result, input } = token;
  const hasSpokenRef = useRef(false);

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

  const isEmergency = result.priorityTier === "RED";
  const priorityLabel = isEmergency
    ? "EMERGENCY PRIORITY"
    : result.priorityTier === "YELLOW"
    ? "URGENT PRIORITY"
    : "ROUTINE PRIORITY";

  const trackerUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/tracker/${result.tokenNumber}` 
    : `https://hospital-opd.gov.in/tracker/${result.tokenNumber}`;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3 animate-in fade-in duration-300">
      
      {/* ── 1. Top Compact Header ── */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center justify-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold shadow-sm">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{lang === "hi" ? "टोकन सफलतापूर्वक जारी किया गया" : "Token Issued Successfully"}</span>
        </div>
        <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
          {t.tokenGeneratedTitle}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          {t.tokenGeneratedSubtitle}
        </p>
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
              
              {/* Routine Priority Badge */}
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-sm ${
                isEmergency
                  ? "bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
                  : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isEmergency ? "bg-red-500 animate-ping" : "bg-emerald-500"}`} />
                {priorityLabel}
              </span>
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
                {result.estimatedWaitMinutes === 0 ? "Immediate (0 min)" : `~ ${result.estimatedWaitMinutes} ${t.minutes}`}
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
                  {lang === "hi" ? result.departmentHi : result.department}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{result.assignedDoctorName}</p>
              </div>

              {/* Room / Counter */}
              <div className="bg-slate-50/80 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-0.5 shadow-sm">
                <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase">
                  <MapPin className="w-3 h-3" />
                  <span>{t.roomCounter}</span>
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white break-words">
                  {result.roomNumber}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{result.counterNumber}</p>
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
                  <span className="font-semibold text-slate-900 dark:text-white text-xs block">{input.age} Yrs / {input.gender}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">{t.maskedPhone}</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-xs font-mono block">+91 ••••• {input.phone.slice(-4)}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">{t.maskedAbha}</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs font-mono block">
                    {input.abhaId ? `•••• •••• ${input.abhaId.slice(-4)}` : "Not Linked"}
                  </span>
                </div>
              </div>

              {/* Reported Symptoms & AI Routing Note */}
              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 space-y-1">
                <div className="flex items-start gap-1.5">
                  <FileHeart className="w-3 h-3 text-rose-500 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">{t.symptomsSummary}</span>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {lang === "en" ? result.chiefComplaintSummaryEn : result.chiefComplaintSummaryHi}
                    </p>
                  </div>
                </div>

                {/* Clean AI-Assisted Routing Message */}
                <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 pt-0.5">
                  <Sparkles className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                  <span>AI-Assisted Routing • Final assessment by clinician.</span>
                </div>
              </div>
            </div>

          </div>

          {/* ── Right Column: QR Code & Action Buttons (5 cols) ── */}
          <div className="lg:col-span-5 bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between gap-3 text-center shadow-sm">
            
            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center space-y-2 py-0.5">
              <div className="p-2 bg-white rounded-xl shadow-sm inline-block border border-slate-200 dark:border-slate-700">
                <QRCodeSVG
                  value={trackerUrl}
                  size={110}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <div className="space-y-0.5 max-w-[190px]">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Scan to track your queue
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                  Live queue position updates on your smartphone
                </p>
              </div>
            </div>

            {/* Action Buttons: WhatsApp Primary, Print Secondary, Back to Initial Page */}
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
                <span>{lang === "hi" ? "टोकन प्रिंट करें" : "Print Token"}</span>
              </button>

              {/* Back to Initial Page / Start New Registration */}
              <button
                type="button"
                onClick={() => {
                  try {
                    sessionStorage.removeItem("emergency_token");
                    sessionStorage.removeItem("kiosk_session_state");
                  } catch (e) {}
                  if (onReset) {
                    onReset();
                  } else {
                    window.location.href = "/";
                  }
                }}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center space-x-2 shadow-sm active:scale-[0.99]"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{lang === "hi" ? "प्रारंभिक पृष्ठ पर वापस जाएं" : "Done / Back to Home"}</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* 80mm Thermal Receipt Hidden Print DOM Element */}
      <div id="thermal-receipt-print" className="hidden print:block">
        <div style={{ textAlign: "center", borderBottom: "1px dashed #000", paddingBottom: "4mm", marginBottom: "4mm" }}>
          <h2 style={{ fontSize: "14pt", margin: 0, fontWeight: "bold" }}>AIIMS / GOVT HOSPITAL OPD</h2>
          <p style={{ fontSize: "9pt", margin: "1mm 0" }}>National Health Mission - ABDM Verified</p>
          <p style={{ fontSize: "8pt", margin: 0 }}>SwasthyaSetu Kiosk System</p>
        </div>

        <div style={{ textAlign: "center", margin: "4mm 0", padding: "2mm", border: "2px solid #000" }}>
          <span style={{ fontSize: "9pt", display: "block" }}>OPD TOKEN NUMBER</span>
          <span style={{ fontSize: "22pt", fontWeight: "bold", letterSpacing: "1px" }}>{result.tokenNumber}</span>
          <span style={{ fontSize: "9pt", display: "block", marginTop: "1mm" }}>
            PRIORITY: {priorityLabel}
          </span>
        </div>

        <div style={{ fontSize: "9pt", lineHeight: "1.4", margin: "4mm 0" }}>
          <div><strong>Department:</strong> {result.department}</div>
          <div><strong>Room / Counter:</strong> {result.roomNumber} ({result.counterNumber})</div>
          <div><strong>Doctor:</strong> {result.assignedDoctorName}</div>
          <div><strong>Est. Wait Time:</strong> {result.estimatedWaitMinutes} Mins</div>
          <div style={{ borderTop: "1px dashed #000", margin: "2mm 0" }} />
          <div><strong>Patient:</strong> {input.patientName} ({input.age}Y/{input.gender})</div>
          <div><strong>Mobile:</strong> +91 ***** {input.phone.slice(-4)}</div>
          {input.abhaId && <div><strong>ABHA ID:</strong> **** **** {input.abhaId.slice(-4)}</div>}
          <div style={{ borderTop: "1px dashed #000", margin: "2mm 0" }} />
          <div><strong>Chief Symptoms:</strong> {result.chiefComplaintSummaryEn}</div>
        </div>

        <div style={{ textAlign: "center", borderTop: "1px dashed #000", paddingTop: "3mm", marginTop: "3mm" }}>
          <p style={{ fontSize: "8pt", margin: 0 }}>Please proceed to your assigned room counter.</p>
          <p style={{ fontSize: "8pt", margin: "1mm 0 0 0" }}>Scan QR code on Kiosk for live updates.</p>
        </div>
      </div>

    </div>
  );
};
