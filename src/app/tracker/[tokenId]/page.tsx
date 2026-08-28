"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  Activity, 
  MapPin, 
  ArrowLeft, 
  RotateCw
} from "lucide-react";
import { getTokenById, StoredToken, getStoredTokens } from "@/lib/store";

export default function PatientTrackerPage() {
  const params = useParams();
  const tokenIdParam = (params?.tokenId as string) || "";
  const [token, setToken] = useState<StoredToken | undefined>(undefined);
  const [allTokens, setAllTokens] = useState<StoredToken[]>([]);

  const fetchTokenData = () => {
    const found = getTokenById(tokenIdParam);
    setToken(found);
    setAllTokens(getStoredTokens());
  };

  useEffect(() => {
    fetchTokenData();
    const interval = setInterval(fetchTokenData, 3000);
    return () => clearInterval(interval);
  }, [tokenIdParam]);

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-md">
          <Activity className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Token Not Found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          Could not find active token with ID: <span className="text-blue-600 dark:text-cyan-400 font-mono">{tokenIdParam}</span>
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors shadow-md"
        >
          Go to Kiosk Home
        </Link>
      </div>
    );
  }

  const { result, input, status } = token;
  const isEmergency = result.priorityTier === "RED";

  // Calculate patients ahead in the same department
  const sameDeptTokens = allTokens.filter(
    (t) => t.result.department === result.department && t.status === "WAITING"
  );
  const myIndex = sameDeptTokens.findIndex((t) => t.id === token.id);
  const patientsAhead = myIndex >= 0 ? myIndex : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col justify-between p-4 sm:p-6 max-w-md mx-auto transition-colors">
      
      {/* Mobile Header */}
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <Link
          href="/"
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="text-center">
          <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-widest block">
            AIIMS SMART OPD
          </span>
          <span className="text-sm font-extrabold text-slate-900 dark:text-white">
            Live Queue Tracker
          </span>
        </div>
        <button
          type="button"
          onClick={fetchTokenData}
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-sm"
          title="Refresh"
        >
          <RotateCw className="w-5 h-5" />
        </button>
      </header>

      {/* Main Status Container */}
      <main className="my-6 space-y-6 flex-1">
        
        {/* Token Card */}
        <div className={`p-6 rounded-3xl border-2 text-center space-y-3 relative overflow-hidden shadow-xl transition-colors ${
          isEmergency
            ? "bg-red-50 dark:bg-red-950/80 border-red-500 shadow-red-500/10 dark:shadow-red-950/50"
            : status === "CALLED"
            ? "bg-blue-50 dark:bg-blue-950/90 border-blue-500 dark:border-cyan-400 ring-4 ring-blue-500/20 dark:ring-cyan-500/30"
            : "bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800"
        }`}>
          
          {/* Status Chip */}
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-700">
            <span className={`w-2 h-2 rounded-full ${status === "CALLED" ? "bg-blue-600 dark:bg-cyan-400 animate-ping" : isEmergency ? "bg-red-500" : "bg-emerald-500"}`} />
            <span className={status === "CALLED" ? "text-blue-600 dark:text-cyan-400 font-extrabold" : "text-slate-700 dark:text-slate-300"}>
              {status === "CALLED" ? "PLEASE PROCEED TO ROOM" : status === "IN_CONSULTATION" ? "CONSULTATION IN PROGRESS" : "WAITING IN QUEUE"}
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block uppercase">
              YOUR TOKEN NUMBER
            </span>
            <span className={`text-5xl font-black tracking-tight ${isEmergency ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-cyan-400"}`}>
              {result.tokenNumber}
            </span>
          </div>

          <div className="pt-2">
            <span className="text-sm font-bold text-slate-900 dark:text-white block">{input.patientName}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{input.age} Yrs • {input.gender}</span>
          </div>

        </div>

        {/* Room & Department Banner */}
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm transition-colors">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/40 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Assigned Room & Counter</span>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{result.roomNumber}</h4>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{result.counterNumber}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-500/40 flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Department</span>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{result.department}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{result.assignedDoctorName}</p>
            </div>
          </div>
        </div>

        {/* Queue Wait & Ahead Counter */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-center space-y-1 shadow-sm">
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">Patients Ahead</span>
            <span className="text-3xl font-black text-blue-600 dark:text-cyan-400">{patientsAhead}</span>
          </div>

          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-center space-y-1 shadow-sm">
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">Est. Wait Time</span>
            <span className="text-3xl font-black text-amber-600 dark:text-amber-300">
              {result.estimatedWaitMinutes === 0 ? "0m" : `~${result.estimatedWaitMinutes}m`}
            </span>
          </div>
        </div>

        {/* Instructions Note */}
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-xs text-slate-700 dark:text-slate-300 space-y-1.5 shadow-sm">
          <span className="font-bold text-blue-900 dark:text-cyan-300 block">Important Instructions:</span>
          <p>• Keep this page open; your status will auto-refresh in real time.</p>
          <p>• When your token is called, proceed directly to {result.roomNumber}.</p>
          <p>• For any critical discomfort, immediately alert hospital staff.</p>
        </div>

      </main>

      {/* Footer */}
      <footer className="text-center text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-slate-800 pt-3">
        Hospital Smart Triage & OPD Queue Management
      </footer>

    </div>
  );
}
