"use client";

import React, { useState } from "react";
import { 
  Stethoscope, 
  User, 
  Lock, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Eye, 
  EyeOff,
  Building2,
  BadgeCheck
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
  const [department, setDepartment] = useState("Emergency & Trauma");
  const [role, setRole] = useState<"Doctor" | "Staff Nurse" | "OPD Admin">("Doctor");
  const [showPassword, setShowPassword] = useState(false);

  // Quick Demo Auto-Fill
  const handleQuickFillDoctor = () => {
    setName("Dr. Arvind Sharma");
    setStaffId("MCI-88421");
    setPassword("Hospital@2024");
    setDepartment("Emergency & Trauma");
    setRole("Doctor");
  };

  const handleQuickFillNurse = () => {
    setName("Sister Mary Joseph");
    setStaffId("NUR-55102");
    setPassword("StaffPass#123");
    setDepartment("Cardiology");
    setRole("Staff Nurse");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveName = name.trim() || "Dr. Arvind Sharma (Senior Consultant)";
    const effectiveId = staffId.trim() || "MCI-88421";
    
    onLogin({
      name: effectiveName,
      staffId: effectiveId,
      department,
      role,
    });
  };

  return (
    <div className="max-w-xl mx-auto py-6 space-y-6">
      
      {/* Header Info Card */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-3 relative overflow-hidden transition-colors">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
          <Stethoscope className="w-8 h-8" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Doctor & Staff Authentication
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Secure clinical portal login to manage live patient triage, consultations, and OPD department queues.
        </p>

        {/* Quick Demo Fill Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center font-medium mr-1">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />
            Quick Demo Fill:
          </span>
          <button
            type="button"
            onClick={handleQuickFillDoctor}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 text-xs font-semibold text-emerald-700 dark:text-emerald-300 transition-all shadow-sm"
          >
            👨‍⚕️ Dr. Arvind Sharma (Emergency)
          </button>
          <button
            type="button"
            onClick={handleQuickFillNurse}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/60 border border-slate-200 dark:border-slate-700 hover:border-teal-300 text-xs font-semibold text-teal-700 dark:text-teal-300 transition-all shadow-sm"
          >
            👩‍⚕️ Nurse Mary (Cardiology)
          </button>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5 transition-colors">
        
        {/* Role Selector Tabs */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
            Clinical Role
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["Doctor", "Staff Nurse", "OPD Admin"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold border transition-all text-center ${
                  role === r
                    ? "bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-600/20"
                    : "bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Doctor / Staff Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Doctor / Staff Full Name</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Dr. Arvind Sharma"
            className="w-full h-13 px-4 rounded-2xl bg-slate-50 dark:bg-slate-950/90 border border-slate-300 dark:border-slate-700 text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
          />
        </div>

        {/* Staff ID & Department Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Staff ID */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Medical Reg / Staff ID</span>
            </label>
            <input
              type="text"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              placeholder="e.g. MCI-88421"
              className="w-full h-13 px-4 rounded-2xl bg-slate-50 dark:bg-slate-950/90 border border-slate-300 dark:border-slate-700 text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
            />
          </div>

          {/* Department */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Assigned Department</span>
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full h-13 px-4 rounded-2xl bg-slate-50 dark:bg-slate-950/90 border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
            >
              <option value="Emergency & Trauma">Emergency & Trauma (Ward 01)</option>
              <option value="Cardiology">Cardiology (OPD-02)</option>
              <option value="Pulmonology">Pulmonology (OPD-03)</option>
              <option value="Gastroenterology">Gastroenterology (OPD-04)</option>
              <option value="Orthopedics">Orthopedics (OPD-05)</option>
              <option value="Neurology">Neurology (OPD-06)</option>
              <option value="General Medicine">General Medicine (OPD-07)</option>
            </select>
          </div>

        </div>

        {/* Security Password */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Staff Password / PIN</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password or leave blank for demo"
              className="w-full h-13 pl-4 pr-12 rounded-2xl bg-slate-50 dark:bg-slate-950/90 border border-slate-300 dark:border-slate-700 text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Security / ABDM Compliance Notice */}
        <div className="flex items-center space-x-2.5 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-emerald-300">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>ABDM & DPDP Act 2023 Protected Session • Restricted clinical access</span>
        </div>

        {/* Submit Login Button */}
        <button
          type="submit"
          className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-base sm:text-lg shadow-lg shadow-emerald-600/30 active:scale-[0.98] transition-all flex items-center justify-center space-x-3"
        >
          <span>Authenticate & Access OPD Queue</span>
          <ArrowRight className="w-5 h-5" />
        </button>

      </form>

    </div>
  );
};
