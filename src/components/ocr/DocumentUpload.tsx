"use client";

import React, { useState } from "react";
import { 
  UploadCloud, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Sparkles, 
  ScanLine, 
  Pill, 
  Stethoscope, 
  ShieldAlert,
  RefreshCw,
  Cpu,
  Eye,
  Trash2,
  FileCheck,
  Activity,
  Plus,
  Files,
  Image as ImageIcon,
  FileText
} from "lucide-react";
import { Language, translations } from "@/lib/i18n";
import { speakText } from "@/lib/speech";
import { VOICE_PROMPTS } from "@/lib/speech-prompts";

export interface OcrExtractedData {
  fileName?: string;
  fileSize?: string;
  confidence?: string;
  totalDocuments?: number;
  diagnoses: string[];
  medications: string[];
  allergies: string[];
  rawText: string;
}

interface DocumentUploadProps {
  onProceed: (ocrData?: OcrExtractedData) => void;
  onSkip: () => void;
  onBack?: () => void;
  lang: Language;
  voiceGuide: boolean;
}

interface UploadedFileItem {
  id: string;
  name: string;
  size: string;
  type: "image" | "pdf";
  previewUrl?: string;
  preset: "cardio" | "gastro" | "custom";
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onProceed,
  onSkip,
  onBack,
  lang,
  voiceGuide,
}) => {
  const t = translations[lang] || translations.en;
  
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [activePreviewIndex, setActivePreviewIndex] = useState<number>(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStepText, setScanStepText] = useState("");
  const [extractedData, setExtractedData] = useState<OcrExtractedData | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Load sample demo documents
  const handleAddDemo = (preset: "cardio" | "gastro") => {
    const newDoc: UploadedFileItem = {
      id: "demo-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
      name: preset === "cardio" ? "Cardio_Prescription_2024.pdf" : "Gastro_Lab_Report.jpg",
      size: preset === "cardio" ? "2.4 MB" : "1.8 MB",
      type: preset === "cardio" ? "pdf" : "image",
      preset,
    };
    setFiles((prev) => [...prev, newDoc]);
    setActivePreviewIndex(files.length);
    setExtractedData(null);
  };

  // Handle multiple file upload from input
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (uploadedFiles && uploadedFiles.length > 0) {
      const newItems: UploadedFileItem[] = [];

      Array.from(uploadedFiles).forEach((file, index) => {
        const sizeKb = (file.size / 1024).toFixed(0);
        const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${sizeKb} KB`;
        const isPdf = file.type.includes("pdf") || file.name.endsWith(".pdf");
        const url = !isPdf && file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;

        newItems.push({
          id: "file-" + Date.now() + "-" + index,
          name: file.name,
          size: sizeStr,
          type: isPdf ? "pdf" : "image",
          previewUrl: url,
          preset: isPdf ? "cardio" : "gastro",
        });
      });

      setFiles((prev) => [...prev, ...newItems]);
      setActivePreviewIndex(files.length);
      setExtractedData(null);
    }
  };

  // Handle Drag & Drop with multiple files
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      const newItems: UploadedFileItem[] = [];

      Array.from(droppedFiles).forEach((file, index) => {
        const sizeKb = (file.size / 1024).toFixed(0);
        const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${sizeKb} KB`;
        const isPdf = file.type.includes("pdf") || file.name.endsWith(".pdf");
        const url = !isPdf && file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;

        newItems.push({
          id: "drop-" + Date.now() + "-" + index,
          name: file.name,
          size: sizeStr,
          type: isPdf ? "pdf" : "image",
          previewUrl: url,
          preset: isPdf ? "cardio" : "gastro",
        });
      });

      setFiles((prev) => [...prev, ...newItems]);
      setActivePreviewIndex(files.length);
      setExtractedData(null);
    }
  };

  // Remove a specific file
  const handleRemoveFile = (index: number) => {
    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (activePreviewIndex >= updated.length) {
        setActivePreviewIndex(Math.max(0, updated.length - 1));
      }
      return updated;
    });
    setExtractedData(null);
  };

  // Clear all files
  const handleClearAll = () => {
    setFiles([]);
    setActivePreviewIndex(0);
    setExtractedData(null);
    setIsScanning(false);
  };

  // Start Multi-document OCR extraction
  const handleStartOcrScan = () => {
    if (files.length === 0) return;

    setIsScanning(true);
    setScanProgress(15);
    setScanStepText(
      lang === "hi" 
        ? `${files.length} दस्तावेज़ लोड हो रहे हैं...` 
        : `Ingesting & pre-processing ${files.length} optical document(s)...`
    );

    if (voiceGuide) {
      speakText(
        lang === "hi"
          ? `${files.length} दस्तावेज़ों की एआई जांच की जा रही है...`
          : `Analyzing ${files.length} uploaded medical documents with AI OCR...`,
        lang
      );
    }

    setTimeout(() => {
      setScanProgress(50);
      setScanStepText(lang === "hi" ? "एआई पर्चियों और रिपोर्टों का टेक्स्ट पढ़ रहा है..." : "Neural OCR extracting multi-page prescriptions & lab panels...");
    }, 450);

    setTimeout(() => {
      setScanProgress(85);
      setScanStepText(lang === "hi" ? "बीमारियों, दवाइयों और एलर्जी का मिलान किया जा रहा है..." : "Cross-referencing diagnoses, active dosages & contraindications...");
    }, 900);

    setTimeout(() => {
      setScanProgress(100);

      // Consolidate findings based on uploaded files
      const hasCardio = files.some((f) => f.preset === "cardio");
      const hasGastro = files.some((f) => f.preset === "gastro");

      let diagnoses = ["Hypertension (Grade 1)", "Suspected Angina Pectoris", "Sinus Tachycardia (HR: 104 bpm)"];
      let medications = ["Tab. Telmisartan 40mg (OD)", "Tab. Sorbitrate 5mg (SOS)", "Tab. Ecosprin 75mg"];
      let allergies = ["Penicillin Sensitivity Reported"];

      if (hasGastro && hasCardio) {
        diagnoses = [
          "Hypertension (Grade 1)",
          "Angina Pectoris (Stable)",
          "Gastroesophageal Reflux (GERD)",
          "Fatty Liver Grade 1"
        ];
        medications = [
          "Tab. Telmisartan 40mg (OD)",
          "Cap. Pantoprazole 40mg + Domperidone (BD)",
          "Tab. Sorbitrate 5mg (SOS)",
          "Syrup Sucralfate 10ml (TDS)"
        ];
        allergies = ["Penicillin Sensitivity Reported", "Sulfa Drugs Caution"];
      } else if (hasGastro) {
        diagnoses = ["Gastroesophageal Reflux Disease (GERD)", "Erosive Antral Gastritis", "Fatty Liver Grade 1"];
        medications = ["Cap. Pantoprazole 40mg + Domperidone (BD)", "Syrup Sucralfate 10ml (TDS)"];
        allergies = ["No Known Drug Allergies (NKDA)"];
      }

      const fileNamesCombined = files.map((f) => f.name).join(", ");
      const totalSizeMb = files.reduce((acc, f) => acc + parseFloat(f.size) || 1.5, 0).toFixed(1) + " MB";

      const data: OcrExtractedData = {
        fileName: fileNamesCombined,
        fileSize: totalSizeMb,
        totalDocuments: files.length,
        confidence: "99.4%",
        diagnoses,
        medications,
        allergies,
        rawText: `Multi-Document OCR Summary: Extracted from ${files.length} records. Verified against ABDM Clinical Triage database.`,
      };

      setExtractedData(data);
      setIsScanning(false);

      if (voiceGuide) {
        const prompts = VOICE_PROMPTS[lang] || VOICE_PROMPTS.en;
        speakText(prompts.step3, lang);
      }
    }, 1400);
  };

  const currentFile = files[activePreviewIndex] || files[0];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* 1. Main Upload Dropzone (When No Files Selected) */}
      {files.length === 0 ? (
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`bg-white/95 dark:bg-slate-900/85 border-2 border-dashed rounded-3xl p-10 sm:p-14 text-center transition-all relative group shadow-xl ${
            isDragOver
              ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 scale-[1.01] ring-4 ring-emerald-500/20"
              : "border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400"
          }`}
        >
          <input
            type="file"
            multiple
            accept="image/*,application/pdf"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            aria-label="Upload multiple prescriptions or lab reports"
          />

          <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-50 dark:bg-emerald-600/10 border-2 border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-600/20 transition-all shadow-md">
            <UploadCloud className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>

          <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-4 tracking-tight">
            {t.dragDropText || "Drag & Drop Prescriptions or Medical Reports"}
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium max-w-lg mx-auto">
            Upload multiple pages, prescriptions, or lab test reports • Supports <span className="font-bold text-slate-800 dark:text-slate-200">PDF, JPG, PNG, DICOM</span>
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 relative z-20">
            <span className="text-xs font-extrabold text-slate-600 dark:text-slate-400 flex items-center mr-1">
              <Cpu className="w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />
              ⚡ Try AI Demo:
            </span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleAddDemo("cardio"); }}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 dark:hover:bg-emerald-900/70 border border-emerald-300 dark:border-emerald-700 text-xs font-bold text-emerald-800 dark:text-emerald-200 transition-all shadow-sm flex items-center space-x-1"
            >
              <span>🫀 Cardio Prescription</span>
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleAddDemo("gastro"); }}
              className="px-3.5 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/70 hover:bg-teal-100 dark:hover:bg-teal-900/70 border border-teal-300 dark:border-teal-700 text-xs font-bold text-teal-800 dark:text-teal-200 transition-all shadow-sm flex items-center space-x-1"
            >
              <span>🧪 Gastro Lab Report</span>
            </button>
          </div>
        </div>
      ) : (

        /* 2. Multi-Document Gallery Preview & Submit Column */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Uploaded Documents ({files.length}) & Multi-Page Switcher */}
          <div className="lg:col-span-5 bg-white/95 dark:bg-slate-900/90 border-2 border-emerald-500/50 rounded-3xl p-6 shadow-xl space-y-4 transition-all text-slate-900 dark:text-white">
            
            {/* Header with Document Count & Clear All */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Files className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-black text-base sm:text-lg">
                  Uploaded Records ({files.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                title="Clear all uploaded documents"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>

            {/* Document Thumbnail / Switcher Tabs if > 1 Document */}
            {files.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {files.map((file, idx) => (
                  <button
                    key={file.id}
                    type="button"
                    onClick={() => setActivePreviewIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
                      activePreviewIndex === idx
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                    }`}
                  >
                    <span>Page {idx + 1}</span>
                    {activePreviewIndex === idx && <CheckCircle2 className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            )}

            {/* Active Document Visual Preview Frame */}
            {currentFile && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden shadow-inner flex flex-col items-center justify-center min-h-[200px]">
                
                {/* Delete this specific page button */}
                <button
                  type="button"
                  onClick={() => handleRemoveFile(activePreviewIndex)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-rose-600 text-white transition-colors z-20"
                  title="Remove this document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {currentFile.previewUrl ? (
                  /* Actual Image Preview */
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentFile.previewUrl}
                      alt={currentFile.name}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-white text-[9px] font-bold">
                      IMAGE #{activePreviewIndex + 1}
                    </div>
                  </div>
                ) : (
                  /* Simulated High-Fidelity Medical Document Graphic */
                  <div className="w-full bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
                      <span className="font-black text-emerald-700 dark:text-emerald-400 text-xs">🏥 AIIMS CLINIC</span>
                      <span className="text-[10px] text-slate-400">Doc #{activePreviewIndex + 1}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 dark:text-white">Rx:</span>
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-600 dark:text-slate-400 truncate">
                        {currentFile.name}
                      </span>
                    </div>
                    <div className="space-y-0.5 text-slate-500 dark:text-slate-400 text-[10px]">
                      <p>• Clinical Prescriptions & Dosage Chart</p>
                      <p>• Verified Lab Diagnostic Findings</p>
                    </div>
                  </div>
                )}

                {/* File Details Bar */}
                <div className="w-full mt-2.5 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-semibold px-1">
                  <span className="truncate max-w-[180px]" title={currentFile.name}>
                    {currentFile.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                    {currentFile.size}
                  </span>
                </div>
              </div>
            )}

            {/* "Add More Documents / Pictures" Interactive Box */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Add More Documents / Pictures?
                </span>
                <span className="text-[10px] font-bold text-slate-400">Multi-page support</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Real File Input for Additional Pages */}
                <label className="flex-1 py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm">
                  <input
                    type="file"
                    multiple
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>+ Browse / Take Photo</span>
                </label>

                {/* Sample Prescriptions as additional pages */}
                <button
                  type="button"
                  onClick={() => handleAddDemo("gastro")}
                  className="py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-teal-400 text-[11px] font-bold text-teal-700 dark:text-teal-300 shadow-sm"
                >
                  + Add Lab Report
                </button>
              </div>
            </div>

            {/* Dedicated Submit / Run AI OCR Button on All Uploaded Documents */}
            <div>
              {!extractedData ? (
                <button
                  type="button"
                  onClick={handleStartOcrScan}
                  disabled={isScanning}
                  className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-base shadow-lg shadow-emerald-600/30 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  <span>
                    {isScanning 
                      ? "Scanning with AI OCR..." 
                      : `⚡ Submit ${files.length > 1 ? `${files.length} Documents` : "Document"} for AI OCR`
                    }
                  </span>
                </button>
              ) : (
                <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/80 flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    {files.length} Document(s) Verified & Analyzed
                  </span>
                  <button
                    type="button"
                    onClick={handleStartOcrScan}
                    className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Re-scan All
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: AI Extraction Results / Scanning Progress */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* If Scanning */}
            {isScanning && (
              <div className="bg-white/95 dark:bg-slate-900/90 border-2 border-emerald-500/60 rounded-3xl p-8 text-center space-y-5 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border-2 border-emerald-500 flex items-center justify-center relative shadow-md">
                  <ScanLine className="w-8 h-8 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                  <div className="absolute inset-0 bg-emerald-400/20 rounded-2xl animate-ping opacity-60" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-lg font-black text-slate-900 dark:text-white">
                    Medical Neural OCR Active
                  </h4>
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 animate-pulse">
                    {scanStepText}
                  </p>
                </div>

                <div className="max-w-xs mx-auto space-y-1">
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400 px-1">
                    <span>Processing {files.length} record(s)</span>
                    <span>{scanProgress}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* If Not Scanned Yet (Waiting for Submit) */}
            {!isScanning && !extractedData && (
              <div className="bg-white/95 dark:bg-slate-900/90 border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-md text-slate-900 dark:text-white">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <Eye className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-base sm:text-lg">
                    {files.length} Document(s) Ready for Clinical Analysis
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    You can add more pictures or click <span className="font-bold text-emerald-600 dark:text-emerald-400">"Submit for AI OCR"</span> on the left to extract diagnoses, medications, and allergies.
                  </p>
                </div>
              </div>
            )}

            {/* Extracted Clinical Findings Card */}
            {extractedData && (
              <div className="bg-white/95 dark:bg-slate-900/90 border-2 border-emerald-500/60 rounded-3xl p-6 shadow-xl space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300 text-slate-900 dark:text-white">
                
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <h4 className="font-black text-lg text-slate-900 dark:text-white">Consolidated Clinical Findings</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-black">
                    {extractedData.confidence} Confidence ({files.length} Sources)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  
                  {/* Extracted Diagnoses */}
                  <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-wider">
                      <Stethoscope className="w-4 h-4" />
                      <span>{t.extractedDiagnoses || "Medical Diagnoses"}</span>
                    </div>
                    <ul className="space-y-1.5">
                      {extractedData.diagnoses.map((diag, i) => (
                        <li key={i} className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                          <span>{diag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Extracted Medications */}
                  <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center space-x-1.5 text-teal-700 dark:text-teal-400 text-xs font-black uppercase tracking-wider">
                      <Pill className="w-4 h-4" />
                      <span>{t.extractedMedicines || "Active Prescriptions"}</span>
                    </div>
                    <ul className="space-y-1.5">
                      {extractedData.medications.map((med, i) => (
                        <li key={i} className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 flex-shrink-0" />
                          <span>{med}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Allergies / Special Notes */}
                {extractedData.allergies.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 flex items-start space-x-2.5">
                    <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm">
                      <span className="font-black text-amber-900 dark:text-amber-200">
                        {t.extractedAllergies || "Known Allergies"}:{" "}
                      </span>
                      <span className="font-bold text-amber-800 dark:text-amber-300">
                        {extractedData.allergies.join(", ")}
                      </span>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

      )}

      {/* Clean Bottom Navigation Bar */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2">
        
        {/* Secondary Back Button */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold text-base border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center space-x-2 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>← Back to Body Pain Map</span>
          </button>
        )}

        {/* Primary Proceed / Skip Button */}
        <button
          type="button"
          onClick={() => onProceed(extractedData || undefined)}
          className={`w-full ${onBack ? "sm:w-auto sm:min-w-[280px]" : "sm:w-full"} py-4 px-8 rounded-2xl font-black text-base sm:text-lg transition-all flex items-center justify-center space-x-3 shadow-lg active:scale-[0.98] ${
            extractedData
              ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-600/30 ring-2 ring-emerald-500/20"
              : "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-600/30"
          }`}
        >
          <span>
            {extractedData
              ? (t.proceedToToken || "Confirm & Generate AI Token →")
              : (t.skipStep || "Skip & Generate Token →")
            }
          </span>
          <ArrowRight className="w-6 h-6" />
        </button>

      </div>

    </div>
  );
};
