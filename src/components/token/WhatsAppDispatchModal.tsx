"use client";

import React from "react";
import { 
  X, 
  Send, 
  CheckCheck, 
  ExternalLink, 
  ShieldCheck, 
  Smartphone
} from "lucide-react";
import { StoredToken } from "@/lib/store";
import { Language, translations } from "@/lib/i18n";

interface WhatsAppDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: StoredToken;
  lang: Language;
}

export const WhatsAppDispatchModal: React.FC<WhatsAppDispatchModalProps> = ({
  isOpen,
  onClose,
  token,
  lang,
}) => {
  const t = translations[lang];
  const { result, input } = token;

  if (!isOpen) return null;

  const trackerUrl = typeof window !== "undefined" ? `${window.location.origin}/tracker/${result.tokenNumber}` : `https://hospital-opd.gov.in/tracker/${result.tokenNumber}`;

  const messageText = `🏥 *AIIMS / GOVT HOSPITAL SMART OPD* 🏥\n\nनमस्ते ${input.patientName},\nआपका ओपीडी टोकन सफलतापूर्वक जारी हो गया है।\n\n🎫 *Token Number:* ${result.tokenNumber}\n🩺 *Department:* ${result.department}\n📍 *Room & Counter:* ${result.roomNumber} (${result.counterNumber})\n⏱️ *Est. Wait Time:* ~${result.estimatedWaitMinutes} mins\n🚨 *Priority:* ${result.priorityTier}\n\n🔍 *Live Queue Tracker:* ${trackerUrl}\n\n_कृपया अपनी बारी की प्रतीक्षा करें।_`;

  const waMeLink = `https://wa.me/91${input.phone}?text=${encodeURIComponent(messageText)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-slate-900 dark:text-white space-y-6">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/40 flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{t.whatsAppSentTitle}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dispatched to +91 ••••• {input.phone.slice(-4)} via WhatsApp Cloud API
            </p>
          </div>
        </div>

        {/* Realistic WhatsApp Chat Bubble Simulator */}
        <div className="rounded-3xl bg-[#0b141a] border border-slate-800 p-4 shadow-inner space-y-3 font-sans text-white">
          
          {/* Header of Chat */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                AIIMS
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-bold text-slate-200">AIIMS Smart OPD Kiosk</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                </div>
                <span className="text-[10px] text-slate-500 block">Official Business Account</span>
              </div>
            </div>
          </div>

          {/* Incoming Message Bubble */}
          <div className="bg-[#1f2c34] text-slate-100 p-3.5 rounded-2xl rounded-tl-sm text-xs space-y-2.5 shadow-md border border-[#2a3942]">
            
            <div className="flex items-center justify-between font-bold text-emerald-400 border-b border-slate-700/60 pb-1.5">
              <span>🏥 OPD Token Issued</span>
              <span className="text-[10px] text-slate-400">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            <p className="text-xs text-slate-200">
              Namaste <strong className="text-white">{input.patientName}</strong>, your digital OPD token has been queued successfully.
            </p>

            {/* Token details card inside bubble */}
            <div className="bg-[#111b21] p-3 rounded-xl border border-slate-700 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Token ID:</span>
                <span className="font-extrabold text-cyan-400 text-sm">{result.tokenNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Department:</span>
                <span className="font-bold text-white">{result.department}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Room:</span>
                <span className="font-bold text-emerald-400">{result.roomNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Est. Wait:</span>
                <span className="font-bold text-amber-400">~{result.estimatedWaitMinutes} mins</span>
              </div>
            </div>

            {/* Interactive WhatsApp action buttons */}
            <div className="space-y-1.5 pt-1">
              <div className="w-full py-2 px-3 rounded-lg bg-[#2a3942] text-cyan-300 font-bold text-center text-[11px] flex items-center justify-center space-x-1.5">
                <ExternalLink className="w-3 h-3" />
                <span>Track Live Queue Position</span>
              </div>
            </div>

            {/* Read Receipt */}
            <div className="flex justify-end items-center space-x-1 text-[10px] text-slate-400 pt-1">
              <span>Delivered</span>
              <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
            </div>

          </div>

        </div>

        {/* Real WhatsApp Trigger Button */}
        <div className="space-y-2">
          <a
            href={waMeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-sm sm:text-base shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>{t.openRealWhatsApp}</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
          >
            {t.close}
          </button>
        </div>

      </div>
    </div>
  );
};
