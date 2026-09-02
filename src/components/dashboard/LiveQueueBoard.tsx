"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon,
  Volume2, 
  Stethoscope, 
  FileText, 
  Filter, 
  Activity, 
  MapPin,
  LogOut
} from "lucide-react";
import { StoredToken, getStoredTokens, updateTokenStatus, subscribeToTokens } from "@/lib/store";
import { Language, translations } from "@/lib/i18n";
import { speakText } from "@/lib/speech";

interface LiveQueueBoardProps {
  lang: Language;
  voiceGuide: boolean;
  doctorName?: string;
  onLogout?: () => void;
}

export const LiveQueueBoard: React.FC<LiveQueueBoardProps> = ({ 
  lang, 
  voiceGuide,
  doctorName,
  onLogout
}) => {
  const t = translations[lang];
  const [tokens, setTokens] = useState<StoredToken[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<"EMERGENCY" | "OPD">("EMERGENCY");
  const [selectedTokenForOcr, setSelectedTokenForOcr] = useState<StoredToken | null>(null);
  const [callingTokenId, setCallingTokenId] = useState<string | null>(null);

  const refreshTokens = () => {
    setTokens(getStoredTokens());
  };

  useEffect(() => {
    refreshTokens();
    const handleUpdate = () => refreshTokens();
    window.addEventListener("opd_queue_updated", handleUpdate);
    
    // Realtime Firebase & Multi-Tab Listener
    const unsubscribeFirebase = subscribeToTokens((realtimeTokens) => {
      setTokens(realtimeTokens);
    });

    // 2-Second Safety Auto-Refresh Poller (Zero Manual Refresh Needed)
    const backupPoller = setInterval(refreshTokens, 2000);

    return () => {
      window.removeEventListener("opd_queue_updated", handleUpdate);
      clearInterval(backupPoller);
      unsubscribeFirebase();
    };
  }, []);

  const handleCallPatient = (token: StoredToken) => {
    setCallingTokenId(token.id);
    updateTokenStatus(token.id, "CALLED");
    refreshTokens();

    const tokenNum = token.result.tokenNumber;
    const room = token.result.roomNumber;
    const patientName = token.input.patientName;

    // Bilingual spoken audio announcement
    const announcementHi = `टोकन नंबर ${tokenNum}, ${patientName}, कृपया ${room} में आएं।`;
    const announcementEn = `Token number ${tokenNum}, ${patientName}, please proceed to ${room}.`;

    speakText(announcementHi, "hi", () => {
      setTimeout(() => {
        speakText(announcementEn, "en", () => {
          setCallingTokenId(null);
        });
      }, 500);
    });
  };

  const handleStartConsult = (tokenId: string) => {
    updateTokenStatus(tokenId, "IN_CONSULTATION");
    refreshTokens();
  };

  const handleCompleteConsult = (tokenId: string) => {
    updateTokenStatus(tokenId, "COMPLETED");
    refreshTokens();
  };

  const handleFinishAndCallNext = (currentToken: StoredToken) => {
    updateTokenStatus(currentToken.id, "COMPLETED");
    refreshTokens();

    const currentTokensList = getStoredTokens();
    const remainingTokens = currentTokensList.filter(
      (t) =>
        t.id !== currentToken.id &&
        t.status !== "COMPLETED" &&
        (categoryFilter === "EMERGENCY" ? isEmergencyToken(t) : !isEmergencyToken(t))
    );

    if (remainingTokens.length > 0) {
      handleCallPatient(remainingTokens[0]);
    }
  };

  const isEmergencyToken = (t: StoredToken) =>
    t.result.department === "Emergency & Trauma" ||
    Boolean(t.input?.isEmergencyOverride);

  const totalEmergencyCount = tokens.filter((t) => isEmergencyToken(t) && t.status !== "COMPLETED").length;
  const totalOpdCount = tokens.filter((t) => !isEmergencyToken(t) && t.status !== "COMPLETED").length;

  const filteredTokens = tokens.filter((t) => {
    if (t.status === "COMPLETED") return false;
    if (categoryFilter === "EMERGENCY") return isEmergencyToken(t);
    if (categoryFilter === "OPD") return !isEmergencyToken(t);
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      
      {/* ── Top Single Header Box ── */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 transition-colors">
        
        {/* Left: Stethoscope icon + Doctor Name ONLY */}
        <div className="flex items-center space-x-3 self-start md:self-auto">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold flex-shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
            {doctorName || "Dr. Arvind Sharma"}
          </span>
        </div>

        {/* Center: Emergency Patients & OPD Patients Toggle Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {/* 1. Emergency Patients Tab */}
          <button
            type="button"
            onClick={() => setCategoryFilter("EMERGENCY")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 shadow-sm active:scale-95 ${
              categoryFilter === "EMERGENCY"
                ? "bg-red-600 text-white shadow-md shadow-red-600/30 ring-2 ring-red-400"
                : "bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 border border-slate-200 dark:border-slate-800"
            }`}
          >
            <AlertOctagon className={`w-4 h-4 ${categoryFilter === "EMERGENCY" ? "text-white" : "text-red-500"}`} />
            <span>{lang === "hi" ? "आपातकालीन मरीज" : "Emergency Patients"}</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
              categoryFilter === "EMERGENCY" ? "bg-red-800 text-white" : "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300"
            }`}>
              {totalEmergencyCount}
            </span>
          </button>

          {/* 2. OPD Patients Tab */}
          <button
            type="button"
            onClick={() => setCategoryFilter("OPD")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 shadow-sm active:scale-95 ${
              categoryFilter === "OPD"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400"
                : "bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 border border-slate-200 dark:border-slate-800"
            }`}
          >
            <Stethoscope className={`w-4 h-4 ${categoryFilter === "OPD" ? "text-white" : "text-emerald-500"}`} />
            <span>{lang === "hi" ? "ओपीडी मरीज" : "OPD Patients"}</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
              categoryFilter === "OPD" ? "bg-emerald-800 text-white" : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
            }`}>
              {totalOpdCount}
            </span>
          </button>
        </div>

        {/* Right: Logout Session */}
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 hover:border-rose-300 text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-sm self-end md:self-auto flex-shrink-0 active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout Session</span>
          </button>
        )}

      </div>

      {/* Patient Cards Feed */}
      <div className="space-y-4">
        {filteredTokens.length === 0 ? (
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-500 dark:text-slate-400 space-y-3">
            <Users className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
            <h4 className="text-lg font-bold text-slate-700 dark:text-slate-300">{t.noPatientsInQueue}</h4>
          </div>
        ) : (
          filteredTokens.map((token) => {
            const { result, input, status } = token;
            const isRed = result.priorityTier === "RED";
            const isYellow = result.priorityTier === "YELLOW";
            const isCalling = callingTokenId === token.id;
            const isEmerg = isEmergencyToken(token);

            const displayTokenNumber = !isEmerg && result.tokenNumber.startsWith("ER-")
              ? `${(result.department === "General Medicine" ? "GEN" : result.department.slice(0, 3)).toUpperCase()}-${result.tokenNumber.replace("ER-", "")}`
              : result.tokenNumber;

            return (
              <div
                key={token.id}
                className={`bg-white dark:bg-slate-900/90 rounded-3xl p-5 sm:p-6 border transition-all shadow-md space-y-4 ${
                  isEmerg
                    ? "border-red-500 ring-2 ring-red-500/20 shadow-red-500/10 dark:shadow-red-950/40"
                    : isRed
                    ? "border-red-400 dark:border-red-600/60 shadow-red-500/10 dark:shadow-red-950/20"
                    : isYellow
                    ? "border-amber-400 dark:border-amber-500/60 shadow-amber-500/10 dark:shadow-amber-950/20"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                {/* Header row: Token ID, Priority, Dept, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-3">
                  <div className="flex items-center space-x-3">
                    <span className={`text-2xl sm:text-3xl font-black ${isEmerg ? "text-red-600 dark:text-red-400" : isRed ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-cyan-400"}`}>
                      {displayTokenNumber}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${
                        isEmerg
                          ? "bg-red-100 dark:bg-red-950 border-red-300 dark:border-red-500 text-red-700 dark:text-red-300 animate-pulse"
                          : isRed
                          ? "bg-red-100 dark:bg-red-950 border-red-300 dark:border-red-500 text-red-700 dark:text-red-300"
                          : isYellow
                          ? "bg-amber-100 dark:bg-amber-950 border-amber-300 dark:border-amber-500 text-amber-800 dark:text-amber-300"
                          : "bg-emerald-100 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-500 text-emerald-800 dark:text-emerald-300"
                      }`}
                    >
                      {isEmerg ? "RED (Emergency)" : isRed ? "RED (High Priority OPD)" : isYellow ? "YELLOW (Urgent)" : "GREEN (Standard)"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-slate-600 dark:text-slate-300">
                    <span className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-white">
                      <Activity className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                      <span>{result.department}</span>
                    </span>
                    <span>•</span>
                    <span
                      className={`px-2.5 py-1 rounded-lg font-black text-[11px] uppercase tracking-wider ${
                        status === "WAITING"
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          : status === "CALLED"
                          ? "bg-blue-600 text-white animate-pulse"
                          : status === "IN_CONSULTATION"
                          ? "bg-amber-600 text-white"
                          : "bg-emerald-600 text-white"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                </div>

                {/* Big Box: Patient Details + Action Buttons */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs sm:text-sm">
                  
                  {/* Single Big Box: Patient Name, Age, Gender, and Complaints Filed */}
                  <div className="lg:col-span-8 bg-slate-50 dark:bg-slate-950/70 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 pb-2.5 border-b border-slate-200/80 dark:border-slate-800/80">
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Patient</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                            {input.patientName}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 font-semibold text-xs sm:text-sm">
                            • {input.age} Yrs {input.gender ? `• ${input.gender}` : ""}
                          </span>
                        </div>
                      </div>
                      {input.phone && (
                        <span className="text-slate-500 dark:text-slate-400 text-xs">
                          +91 ••••• {input.phone.slice(-4)}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Complaints Filed
                      </span>
                      <p className="font-medium text-slate-800 dark:text-slate-200 leading-relaxed text-xs sm:text-sm">
                        {result.chiefComplaintSummaryEn || (input.selectedSymptoms && input.selectedSymptoms.join(", ")) || "No complaints documented."}
                      </p>
                    </div>
                  </div>

                  {/* Actions Column (3 options) */}
                  <div className="lg:col-span-4 flex flex-col justify-center space-y-2.5">
                    
                    {/* Option 1: Call patient */}
                    <button
                      type="button"
                      onClick={() => handleCallPatient(token)}
                      disabled={isCalling}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
                    >
                      <Volume2 className={`w-4 h-4 ${isCalling ? "animate-spin text-emerald-200" : ""}`} />
                      <span>{isCalling ? "Calling..." : "Call patient"}</span>
                    </button>

                    {/* Option 2: View Past medical reports */}
                    <button
                      type="button"
                      onClick={() => setSelectedTokenForOcr(token)}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold transition-all flex items-center justify-center space-x-2 border border-slate-200 dark:border-slate-700 active:scale-95 shadow-sm"
                    >
                      <FileText className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                      <span>View Past medical reports</span>
                    </button>

                    {/* Option 3: Finish and call next person */}
                    <button
                      type="button"
                      onClick={() => handleFinishAndCallNext(token)}
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Finish and call next person</span>
                    </button>

                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

      {/* OCR Records Modal */}
      {selectedTokenForOcr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                <span>Past Medical Records: {selectedTokenForOcr.input.patientName}</span>
              </h3>
              <button
                onClick={() => setSelectedTokenForOcr(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-blue-600 dark:text-cyan-400 block mb-1">OCR Extracted Prescription Summary:</span>
                <p className="text-slate-700 dark:text-slate-300">
                  {selectedTokenForOcr.ocrDetails?.rawText || "Hypertension on Telmisartan 40mg. Mild tachycardia noted in previous visit. No documented severe allergies."}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedTokenForOcr(null)}
              className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs border border-slate-200 dark:border-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
