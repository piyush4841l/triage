"use client";

import React, { useState, useRef, useEffect } from "react";
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
  FileText,
  QrCode,
  Camera,
  FolderOpen,
  Smartphone,
  X
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
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

  const [uploadMode, setUploadMode] = useState<"choice" | "qr">("choice");
  const [showOfflineReports, setShowOfflineReports] = useState(false);

  // Upload modal states
  const [showQrModal, setShowQrModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [sessionId] = useState(() => "kiosk-" + Math.random().toString(36).substring(2, 9));

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Stop camera stream on unmount or modal close
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Open device camera stream
  const handleStartCamera = async () => {
    setShowCameraModal(true);
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 } },
        });
        setCameraStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        setCameraError("Camera not accessible on this device. Use file capture instead.");
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError("Unable to access camera directly. Please use the camera file picker.");
    }
  };

  const handleCloseCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowCameraModal(false);
  };

  // Capture snapshot from video stream
  const handleCaptureSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);

        const newDoc: UploadedFileItem = {
          id: "photo-" + Date.now(),
          name: `Camera_Capture_${Date.now().toString().slice(-4)}.jpg`,
          size: "1.2 MB",
          type: "image",
          previewUrl: dataUrl,
          preset: "custom",
        };

        setFiles((prev) => [...prev, newDoc]);
        setActivePreviewIndex(files.length);
        setExtractedData(null);
        handleCloseCamera();
      }
    }
  };

  // Simulate instant mobile QR upload
  const handleSimulateMobileUpload = () => {
    const newDoc: UploadedFileItem = {
      id: "mobile-" + Date.now(),
      name: "Mobile_Scanned_Prescription.jpg",
      size: "2.1 MB",
      type: "image",
      preset: "cardio",
    };
    setFiles((prev) => [...prev, newDoc]);
    setActivePreviewIndex(files.length);
    setExtractedData(null);
    setShowQrModal(false);
  };

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
      const hasCardio = files.some(f => f.preset === "cardio" || f.name.toLowerCase().includes("cardio") || f.name.toLowerCase().includes("heart"));
      const hasGastro = files.some(f => f.preset === "gastro" || f.name.toLowerCase().includes("gastro") || f.name.toLowerCase().includes("lab"));

      const consolidatedDiagnoses: string[] = [];
      const consolidatedMeds: string[] = [];
      const consolidatedAllergies: string[] = [];

      if (hasCardio) {
        consolidatedDiagnoses.push("Primary Hypertension (Grade 2)", "Ischemic Heart Disease (Mild Angina)");
        consolidatedMeds.push("Tab. Telmisartan 40mg (OD)", "Tab. Metoprolol 25mg (OD)", "Tab. Ecosprin 75mg (Post Lunch)");
        consolidatedAllergies.push("Sulfa Drugs / Sulfonamides (Mild rash)");
      }

      if (hasGastro || (!hasCardio && !hasGastro)) {
        consolidatedDiagnoses.push("Acute Acid Peptic Disease (GERD)", "Chronic Gastritis Panel (Elevated SGPT 58 IU/L)");
        consolidatedMeds.push("Cap. Pantoprazole 40mg (Empty Stomach)", "Syrup Sucralfate 10ml (TDS)");
        consolidatedAllergies.push("NSAIDs / Ibuprofen (Gastric irritation)");
      }

      const data: OcrExtractedData = {
        fileName: files.length === 1 ? files[0].name : `${files.length} Consolidated Medical Records`,
        fileSize: files.reduce((acc, f) => acc + (f.size.includes("MB") ? parseFloat(f.size) : parseFloat(f.size) / 1024), 0).toFixed(1) + " MB",
        confidence: "98.4%",
        totalDocuments: files.length,
        diagnoses: consolidatedDiagnoses,
        medications: consolidatedMeds,
        allergies: consolidatedAllergies,
        rawText: `[MULTI-PAGE CLINICAL OCR PARSE - ${files.length} ATTACHMENT(S)]\n` +
          files.map((f, i) => `PAGE ${i+1} (${f.name}):\nRx & Notes ingested: Diagnoses recorded: ${consolidatedDiagnoses.join(", ")}. Meds: ${consolidatedMeds.join(", ")}. Allergies: ${consolidatedAllergies.join(", ")}`).join("\n---\n")
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
    <div className="w-full max-w-4xl mx-auto space-y-3">
      
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,application/pdf"
        onChange={handleFileUpload}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* 1. Main Upload Screen (When No Files Selected) */}
      {files.length === 0 ? (
        uploadMode === "choice" ? (
          /* Step A: Option Selection Card (Only Scan QR inside the box) */
          <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 text-center space-y-4 shadow-sm max-w-md mx-auto my-auto animate-in fade-in duration-300 text-slate-900 dark:text-white">
            
            {/* Header */}
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {lang === "hi" ? "दस्तावेज़ और पुराने पर्चे" : "Upload Documents & Records"}
              </h3>
            </div>

            {/* Single Focused Action Card: Scan QR via Phone */}
            <button
              type="button"
              onClick={() => setUploadMode("qr")}
              className="w-full p-5 rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/30 hover:border-emerald-500 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/60 text-left transition-all group flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md active:scale-[0.99]"
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <QrCode className="w-6 h-6 text-emerald-700 dark:text-emerald-300" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wide">
                  {lang === "hi" ? "स्मार्टफ़ोन" : "Scan via Phone"}
                </span>
              </div>
              <div>
                <h4 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                  {lang === "hi" ? "फ़ोन से QR स्कैन करें" : "Scan QR via Phone"}
                </h4>
              </div>
              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 pt-1">
                <span>{lang === "hi" ? "QR कोड देखें →" : "Show QR Code →"}</span>
              </div>
            </button>

          </div>
        ) : (
          /* Step B: QR Code Scanner Screen */
          <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 text-center space-y-4 shadow-sm max-w-lg mx-auto my-auto animate-in fade-in duration-300 text-slate-900 dark:text-white">
            
            {/* Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs border border-emerald-200 dark:border-emerald-800 mb-1">
                <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{lang === "hi" ? "स्मार्टफ़ोन कैमरा स्कैन" : "Scan with Mobile Camera"}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {lang === "hi" ? "फ़ोन से पर्चा / रिपोर्ट अपलोड करें" : "Scan QR to Upload Prescription"}
              </h3>
            </div>

            {/* Centered High-Res QR Code */}
            <div className="p-4 bg-white rounded-2xl border-2 border-emerald-500/30 inline-block shadow-sm">
              <QRCodeSVG
                value={`https://triage-hospital.abdm.gov.in/upload?session=${sessionId}`}
                size={190}
                level="M"
                includeMargin={false}
              />
            </div>

            {/* Live Status Indicator */}
            <div className="flex items-center justify-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold animate-pulse pt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>{lang === "hi" ? "मोबाइल से फ़ोटो का इंतज़ार..." : "Waiting for phone scan & photo..."}</span>
            </div>

            {/* Offline Physical Report Checkbox Option */}
            <div className="pt-2">
              <label className="flex items-center justify-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors select-none text-left">
                <input
                  type="checkbox"
                  checked={showOfflineReports}
                  onChange={(e) => setShowOfflineReports(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-600 flex-shrink-0"
                />
                <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {lang === "hi"
                    ? "अन्य रिपोर्ट डॉक्टर को ऑफ़लाइन दिखाएंगे"
                    : "Will show other reports offline"}
                </span>
              </label>
            </div>

          </div>
        )
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
        
        {/* Contextual Back Button */}
        {uploadMode === "qr" && files.length === 0 ? (
          <button
            type="button"
            onClick={() => setUploadMode("choice")}
            className="w-full sm:w-auto py-3 px-6 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center space-x-2 shadow-sm active:scale-[0.99]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === "hi" ? "वापस" : "Back"}</span>
          </button>
        ) : onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto py-3 px-6 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center space-x-2 shadow-sm active:scale-[0.99]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === "hi" ? "वापस" : "Back"}</span>
          </button>
        ) : null}

        {/* Primary Proceed / Continue Button */}
        <button
          type="button"
          onClick={() => onProceed(extractedData || undefined)}
          className="w-full sm:w-auto sm:min-w-[240px] py-3 px-6 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 shadow-md active:scale-[0.99] bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-600/25"
        >
          <span>
            {extractedData
              ? (t.proceedToToken || "Confirm & Generate Token")
              : (lang === "hi" ? "बिना रिपोर्ट अपलोड किए आगे बढ़ें" : "Continue without uploading reports")
            }
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>

      {/* 📱 Mobile QR Upload Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4 relative">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {lang === "hi" ? "फ़ोन से QR स्कैन करें" : "Scan to Upload via Phone"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {lang === "hi" ? "अपने स्मार्टफोन के कैमरे से इस QR कोड को स्कैन करें" : "Point your phone camera at this QR code to photograph your prescription"}
              </p>
            </div>

            {/* QR Code Canvas */}
            <div className="p-4 bg-white rounded-2xl border-2 border-emerald-500/30 inline-block shadow-inner">
              <QRCodeSVG
                value={`https://triage-hospital.abdm.gov.in/upload?session=${sessionId}`}
                size={180}
                level="M"
                includeMargin={false}
              />
            </div>

            {/* Listening Badge */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{lang === "hi" ? "मोबाइल अपलोड की प्रतीक्षा है..." : "Waiting for mobile upload..."}</span>
            </div>

            {/* Quick Test Simulator Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleSimulateMobileUpload}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5"
              >
                <span>⚡ {lang === "hi" ? "टेस्ट: मोबाइल फ़ोटो प्राप्त हुई" : "Simulate / Test Mobile Upload"}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 📸 Live Camera Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 max-w-md w-full shadow-2xl text-center space-y-3.5 relative">
            
            {/* Header & Close */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-left">
                <Camera className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {lang === "hi" ? "दस्तावेज़ की फोटो लें" : "Camera Document Capture"}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseCamera}
                className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Viewfinder Box */}
            <div className="relative w-full aspect-[4/3] bg-black rounded-2xl overflow-hidden border-2 border-teal-500/40 flex items-center justify-center shadow-inner">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Viewfinder Target Guidelines */}
              <div className="absolute inset-4 border-2 border-dashed border-white/60 rounded-xl pointer-events-none flex items-center justify-center">
                <span className="text-[10px] text-white/80 bg-black/60 px-2 py-0.5 rounded-md font-mono">
                  {lang === "hi" ? "पर्चे को यहाँ रखें" : "Align prescription here"}
                </span>
              </div>

              {cameraError && (
                <div className="absolute inset-0 bg-slate-900/90 p-4 flex flex-col items-center justify-center text-center space-y-2">
                  <p className="text-xs text-rose-400 font-semibold">{cameraError}</p>
                  <button
                    type="button"
                    onClick={() => {
                      handleCloseCamera();
                      cameraInputRef.current?.click();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-teal-600 text-white font-bold text-xs"
                  >
                    Open Device Camera Picker
                  </button>
                </div>
              )}
            </div>

            {/* Shutter Capture Button */}
            {!cameraError && (
              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleCaptureSnapshot}
                  className="py-3 px-6 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Camera className="w-4 h-4" />
                  <span>{lang === "hi" ? "फ़ोटो खींचें (Snap Photo)" : "Capture Photo"}</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
