"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  User, 
  Lock, 
  ArrowRight, 
  ArrowLeft,
  Eye, 
  EyeOff,
  BadgeCheck,
  AlertCircle
} from "lucide-react";
import { Language } from "@/lib/i18n";

export interface DoctorStaffSession {
  name: string;
  staffId: string;
  department: string;
  role: "Doctor" | "Staff Nurse" | "OPD Admin";
}

interface DoctorStaffLoginProps {
  onLogin: (session: DoctorStaffSession) => void;
  lang: Language;
}

export const DoctorStaffLogin: React.FC<DoctorStaffLoginProps> = ({ onLogin, lang }) => {
  const [name, setName] = useState("");
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; staffId?: string; password?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; staffId?: string; password?: string } = {};

    if (!name.trim()) {
      newErrors.name = lang === "hi" ? "कृपया नाम दर्ज करें" : "Name is required";
    } else if (/[0-9\u0966-\u096F]/.test(name)) {
      newErrors.name = lang === "hi" ? "नाम में संख्याएं मान्य नहीं हैं" : "Name cannot contain numbers";
    }
    if (!staffId.trim()) {
      newErrors.staffId = lang === "hi" ? "कृपया मेडिकल आईडी दर्ज करें" : "Medical ID is required";
    }
    if (!password.trim()) {
      newErrors.password = lang === "hi" ? "कृपया पासवर्ड दर्ज करें" : "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const sessionData: DoctorStaffSession = {
      name: name.trim(),
      staffId: staffId.trim(),
      department: "All Departments",
      role: "Doctor",
    };
    try {
      localStorage.setItem("doctor_session", JSON.stringify(sessionData));
    } catch (err) {
      // ignore
    }
    onLogin(sessionData);
  };

  return (
    <div className="max-w-xl mx-auto py-2 sm:py-4 space-y-4">
      
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {lang === "hi" ? "डॉक्टर लॉगिन" : "Doctor Login"}
        </h2>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 transition-colors">
        
        {/* 1. Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{lang === "hi" ? "नाम" : "Name"}</span>
          </label>
          <input
            type="text"
            value={name}
            onKeyDown={(e) => {
              // Block number keys immediately
              if (/^[0-9]$/.test(e.key)) {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              // Strip numbers if pasted or entered via IME/mobile keyboards
              const cleanVal = e.target.value.replace(/[0-9\u0966-\u096F]/g, "");
              setName(cleanVal);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            placeholder="e.g. Dr. Arvind Sharma"
            className={`w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-950/90 border text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all ${
              errors.name
                ? "border-red-500 ring-2 ring-red-500/20"
                : "border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
            }`}
          />
          {errors.name && (
            <p className="text-xs text-red-500 flex items-center gap-1 font-semibold">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.name}
            </p>
          )}
        </div>

        {/* 2. Medical ID */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{lang === "hi" ? "मेडिकल आईडी" : "Medical ID"}</span>
          </label>
          <input
            type="text"
            value={staffId}
            onChange={(e) => {
              setStaffId(e.target.value);
              if (errors.staffId) setErrors((prev) => ({ ...prev, staffId: undefined }));
            }}
            placeholder="e.g. MCI-88421"
            className={`w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-950/90 border text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all ${
              errors.staffId
                ? "border-red-500 ring-2 ring-red-500/20"
                : "border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
            }`}
          />
          {errors.staffId && (
            <p className="text-xs text-red-500 flex items-center gap-1 font-semibold">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.staffId}
            </p>
          )}
        </div>

        {/* 3. Password */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{lang === "hi" ? "पासवर्ड" : "Password"}</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              placeholder="••••••••"
              className={`w-full h-12 pl-4 pr-12 rounded-xl bg-slate-50 dark:bg-slate-950/90 border text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all ${
                errors.password
                  ? "border-red-500 ring-2 ring-red-500/20"
                  : "border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 flex items-center gap-1 font-semibold">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Submit Login Button */}
        <button
          type="submit"
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-base sm:text-lg shadow-lg shadow-emerald-600/30 active:scale-[0.98] transition-all flex items-center justify-center space-x-2.5 mt-2"
        >
          <span>{lang === "hi" ? "लॉगिन करें" : "Login"}</span>
          <ArrowRight className="w-5 h-5" />
        </button>

      </form>

      {/* Back Button outside the box at bottom */}
      <div className="flex items-center justify-center pt-1">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{lang === "hi" ? "मुख्य पृष्ठ पर वापस जाएं" : "Back to Home"}</span>
        </Link>
      </div>

    </div>
  );
};
