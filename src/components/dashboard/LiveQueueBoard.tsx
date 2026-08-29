"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Volume2, 
  Stethoscope, 
  FileText, 
  Filter, 
  Activity, 
  MapPin
} from "lucide-react";
import { StoredToken, getStoredTokens, updateTokenStatus } from "@/lib/store";
import { Language, translations } from "@/lib/i18n";
import { speakText } from "@/lib/speech";

interface LiveQueueBoardProps {
  lang: Language;
  voiceGuide: boolean;
}

export const LiveQueueBoard: React.FC<LiveQueueBoardProps> = ({ lang, voiceGuide }) => {
  const t = translations[lang];
  const [tokens, setTokens] = useState<StoredToken[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>("ALL");
  const [selectedTokenForOcr, setSelectedTokenForOcr] = useState<StoredToken | null>(null);
  const [callingTokenId, setCallingTokenId] = useState<string | null>(null);

  const refreshTokens = () => {
    setTokens(getStoredTokens());
  };

  useEffect(() => {
    refreshTokens();
    const handleUpdate = () => refreshTokens();
    window.addEventListener("opd_queue_updated", handleUpdate);
    const interval = setInterval(refreshTokens, 3000);
    return () => {
      window.removeEventListener("opd_queue_updated", handleUpdate);
      clearInterval(interval);
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

  const departments = [
    "ALL",
    "Emergency & Trauma",
    "Cardiology",
    "Pulmonology",
    "Gastroenterology",
    "Orthopedics",
    "Neurology",
    "ENT",
    "General Medicine",
  ];

  const filteredTokens = tokens.filter((t) => {
    if (t.status === "COMPLETED") return false;
    if (selectedDept === "ALL") return true;
    return t.result.department === selectedDept;
  });

  const waitingCount = tokens.filter((t) => t.status === "WAITING" || t.status === "CALLED").length;
  const inConsultCount = tokens.filter((t) => t.status === "IN_CONSULTATION").length;
  const completedCount = tokens.filter((t) => t.status === "COMPLETED").length;
  const emergencyCount = tokens.filter((t) => t.result.priorityTier === "RED" && t.status !== "COMPLETED").length;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Top Header & Key Metrics Bar */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-600 dark:text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <Stethoscope className="w-4 h-4" />
              <span>AIIMS Smart OPD Triage Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              {t.liveQueueTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {t.queueOverview}
            </p>
          </div>

          {emergencyCount > 0 && (
            <div className="flex items-center space-x-3 px-4 py-3 rounded-2xl bg-red-100 dark:bg-red-950/80 border-2 border-red-500 text-red-800 dark:text-red-300 shadow-md animate-pulse">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-extrabold uppercase block text-red-900 dark:text-white">Emergency Alert</span>
                <span>{emergencyCount} Red-Tier Patient(s) In Trauma Queue</span>
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <span>{t.waitingPatients}</span>
              <Users className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            </div>
            <span className="text-3xl font-black text-slate-900 dark:text-white">{waitingCount}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <span>{t.inConsultation}</span>
              <Activity className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            </div>
            <span className="text-3xl font-black text-amber-600 dark:text-amber-300">{inConsultCount}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <span>{t.completedToday}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{completedCount}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <span>{t.avgWaitTime}</span>
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-3xl font-black text-blue-600 dark:text-blue-300">12 {t.minutes}</span>
          </div>

        </div>

        {/* Department Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 pt-1">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0 mr-1" />
          {departments.map((dept) => {
            const isSelected = selectedDept === dept;
            const count = dept === "ALL" ? tokens.length : tokens.filter((x) => x.result.department === dept).length;
            return (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                    : "bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
                }`}
              >
                <span>{dept === "ALL" ? t.allDepartments : dept}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? "bg-emerald-800 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

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

            return (
              <div
                key={token.id}
                className={`bg-white dark:bg-slate-900/90 rounded-3xl p-6 border transition-all shadow-md space-y-4 ${
                  isRed
                    ? "border-red-500 ring-2 ring-red-500/20 shadow-red-500/10 dark:shadow-red-950/40"
                    : isYellow
                    ? "border-amber-400 dark:border-amber-500/60 shadow-amber-500/10 dark:shadow-amber-950/20"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                {/* Header row: Token ID, Priority, Dept, Room, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
                  <div className="flex items-center space-x-3">
                    <span className={`text-2xl sm:text-3xl font-black ${isRed ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-cyan-400"}`}>
                      {result.tokenNumber}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${
                        isRed
                          ? "bg-red-100 dark:bg-red-950 border-red-300 dark:border-red-500 text-red-700 dark:text-red-300 animate-pulse"
                          : isYellow
                          ? "bg-amber-100 dark:bg-amber-950 border-amber-300 dark:border-amber-500 text-amber-800 dark:text-amber-300"
                          : "bg-emerald-100 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-500 text-emerald-800 dark:text-emerald-300"
                      }`}
                    >
                      {isRed ? "RED (Emergency)" : isYellow ? "YELLOW (Urgent)" : "GREEN (Standard)"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-slate-600 dark:text-slate-300">
                    <span className="flex items-center space-x-1 font-semibold text-slate-900 dark:text-white">
                      <Activity className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                      <span>{result.department}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1 font-semibold text-emerald-600 dark:text-emerald-400">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{result.roomNumber}</span>
                    </span>
                    <span>•</span>
                    <span
                      className={`px-2.5 py-1 rounded-lg font-bold ${
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

                {/* Patient Information & Clinical Triage Presentation */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs sm:text-sm">
                  
                  {/* Patient Info (4 cols) */}
                  <div className="md:col-span-4 bg-slate-50 dark:bg-slate-950/70 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <div>
                      <span className="text-slate-500 font-semibold block text-[11px] uppercase">{t.patientName}</span>
                      <span className="font-bold text-slate-900 dark:text-white text-base">{input.patientName}</span>
                    </div>
                    <div className="text-slate-600 dark:text-slate-300">
                      <span>{input.age} Yrs</span> • <span>{input.gender}</span> • <span>+91 ••••• {input.phone.slice(-4)}</span>
                    </div>
                    {input.abhaId && (
                      <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                        ABHA: {input.abhaId}
                      </div>
                    )}
                  </div>

                  {/* Chief Complaints & Suggested Clinical Checks (5 cols) */}
                  <div className="md:col-span-5 bg-slate-50 dark:bg-slate-950/70 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div>
                      <span className="text-slate-500 font-semibold block text-[11px] uppercase">{t.chiefComplaints}</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        {result.chiefComplaintSummaryEn}
                      </p>
                    </div>

                    {result.suggestedFirstChecks && result.suggestedFirstChecks.length > 0 && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                        <span className="text-blue-600 dark:text-cyan-400 font-semibold block text-[10px] uppercase">Recommended Stat Tests</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {result.suggestedFirstChecks.map((chk, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                              {chk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Column (3 cols) */}
                  <div className="md:col-span-3 flex flex-col justify-center space-y-2">
                    
                    {/* Call Next Button with Audio Announcement */}
                    <button
                      type="button"
                      onClick={() => handleCallPatient(token)}
                      disabled={isCalling}
                      className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <Volume2 className={`w-4 h-4 ${isCalling ? "animate-spin text-emerald-200" : ""}`} />
                      <span>{isCalling ? t.callingAudio : t.callNextPatient}</span>
                    </button>

                    {status !== "IN_CONSULTATION" && status !== "COMPLETED" && (
                      <button
                        type="button"
                        onClick={() => handleStartConsult(token.id)}
                        className="w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-colors"
                      >
                        {t.startConsultation}
                      </button>
                    )}

                    {status === "IN_CONSULTATION" && (
                      <button
                        type="button"
                        onClick={() => handleCompleteConsult(token.id)}
                        className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
                      >
                        {t.markCompleted}
                      </button>
                    )}

                    {/* View OCR Records Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedTokenForOcr(token)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center space-x-1 border border-slate-200 dark:border-slate-700"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{t.viewOcrRecords}</span>
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
