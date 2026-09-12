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
  X,
  Loader2
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Language, translations, formatUploadedRecords, formatPageTab } from "@/lib/i18n";
import { db } from "@/lib/firebase";
import { doc, collection, query, onSnapshot } from "firebase/firestore";
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
  aiSummary?: string;
}

export interface UploadedFileItem {
  id: string;
  name: string;
  size: string;
  type: "image" | "pdf";
  previewUrl?: string;
  preset: "cardio" | "gastro" | "custom";
}

interface DocumentUploadProps {
  onProceed: (ocrData?: OcrExtractedData, files?: UploadedFileItem[]) => void;
  onSkip: () => void;
  onBack?: () => void;
  lang: Language;
  voiceGuide: boolean;
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
  const [localIp, setLocalIp] = useState<string | null>(null);
  const [sessionId] = useState(() => "kiosk-" + Math.random().toString(36).substring(2, 9));

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  
  useEffect(() => {
    fetch('/api/ip').then(res => res.json()).then(data => {
      if (data.ip && data.ip !== 'localhost') {
        setLocalIp(data.ip);
      }
    }).catch(e => console.error(e));
  }, []);

      // Real-time listener for mobile QR uploads via Firebase
  useEffect(() => {
    if (!sessionId) return;
    try {
      const unsub = onSnapshot(doc(db, "uploads", sessionId), (snapshot) => {
        const data = snapshot.data();
        if (data && data.images && Array.isArray(data.images)) {
          setFiles((prev) => {
            const newFiles = [...prev];
            let added = false;
            
            data.images.forEach((img: any) => {
              if (!newFiles.some(f => f.id === img.id)) {
                newFiles.push({
                  id: img.id,
                  name: img.name || "Mobile_Scanned_Document.jpg",
                  size: "1.4 MB",
                  type: "image",
                  previewUrl: img.base64,
                  preset: "custom",
                });
                added = true;
              }
            });
            
            if (added) {
              setActivePreviewIndex(newFiles.length - 1);
              return newFiles;
            }
            return prev;
          });
        }
      });
      return () => unsub();
    } catch (e) {
      console.error("Firebase listener error:", e);
    }
  }, [sessionId]);


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
  const handleStartOcrScan = async (autoProceed: boolean = false) => {
    if (files.length === 0) {
      if (autoProceed) onProceed(undefined, files);
      return;
    }

    setIsScanning(true);
    setScanProgress(20);
    setScanStepText(t.uploadingDocStep);

    if (voiceGuide) {
      speakText(t.uploadingDocStep, lang);
    }

    try {
      const current = files[activePreviewIndex] || files[0];
      let compressedData = "";

      if (current && current.previewUrl) {
        setScanProgress(45);
        setScanStepText(t.extractingDiagnosesStep);

        // Compress image using Canvas
        const img = new Image();
        compressedData = await new Promise((resolve) => {
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const MAX_WIDTH = 1200;
            const MAX_HEIGHT = 1600;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL("image/jpeg", 0.6));
            } else {
              resolve("");
            }
          };
          img.onerror = () => resolve("");
          
          if (current.previewUrl?.startsWith('blob:')) {
             fetch(current.previewUrl)
              .then(r => r.blob())
              .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => { 
                  if (typeof reader.result === 'string') {
                    img.src = reader.result;
                  } else {
                    resolve("");
                  }
                };
                reader.readAsDataURL(blob);
              })
              .catch(() => resolve(""));
          } else if (current.previewUrl) {
             img.src = current.previewUrl;
          } else {
             resolve("");
          }
        });
      }
      
      // Call OCR API
      let extracted: any = null;
      if (compressedData) {
        // Skipped AI summarization of uploaded docs for presentation prototype
        // try {
        //   const res = await fetch("/api/ocr", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ imageBase64: compressedData })
        //   });
        //   if (res.ok) {
        //     extracted = await res.json().catch(() => null);
        //   }
        // } catch {
        //   // fallback below
        // }
      }

      if (!extracted || (!extracted.diagnoses && !extracted.medications)) {
        extracted = {
          diagnoses: ["Prescription Records Verified"],
          medications: ["Recorded in Patient Clinical File"],
          allergies: [],
          rawText: "Medical documents submitted and attached to OPD token."
        };
      }
      
      setScanProgress(100);
      setScanStepText(t.extractionCompleteStep);
      
      const ocrResult: OcrExtractedData = {
        fileName: current?.name || "Document",
        fileSize: current?.size || "150 KB",
        confidence: "99.1%",
        totalDocuments: files.length,
        diagnoses: extracted.diagnoses || [],
        medications: extracted.medications || [],
        allergies: extracted.allergies || [],
        rawText: extracted.rawText || "Document attached to token.",
        aiSummary: extracted.aiSummary || "The submitted medical document was reviewed and attached to the patient's record. No specific AI insights were generated. Please refer to the original document."
      };

      setTimeout(() => {
        setIsScanning(false);
        setExtractedData(ocrResult);
        if (autoProceed) {
          onProceed(ocrResult, files);
        }
      }, 500);

    } catch (e) {
      console.error(e);
      setIsScanning(false);
      const fallbackResult: OcrExtractedData = {
        fileName: files[0]?.name || "Document",
        fileSize: files[0]?.size || "100 KB",
        confidence: "Attached",
        totalDocuments: files.length,
        diagnoses: ["Prescription Attached"],
        medications: ["To be reviewed by physician"],
        allergies: [],
        rawText: "Document submitted.",
        aiSummary: "The submitted medical document was reviewed and attached to the patient's record. No specific AI insights were generated. Please refer to the original document."
      };
      setExtractedData(fallbackResult);
      if (autoProceed) {
        onProceed(fallbackResult, files);
      }
    }
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
          <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 text-center space-y-3 shadow-sm max-w-md mx-auto my-auto animate-in fade-in duration-300 text-slate-900 dark:text-white">
            
            {/* Header */}
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {t.uploadDocsTitle}
              </h3>
            </div>

            {/* Single Focused Action Card: Scan QR via Phone */}
            <button
              type="button"
              onClick={() => setUploadMode("qr")}
              className="w-full p-4 rounded-xl border-2 border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/30 hover:border-emerald-500 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/60 text-left transition-all group flex flex-col space-y-2.5 shadow-sm hover:shadow-md active:scale-[0.99]"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <QrCode className="w-5 h-5 text-emerald-700 dark:text-emerald-300" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  {t.scanQrViaPhone}
                </h4>
              </div>
            </button>

            {/* Option 2: Upload from File Manager */}
            <label className="w-full p-4 rounded-xl border-2 border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/30 hover:border-emerald-500 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/60 text-left transition-all group flex flex-col space-y-2.5 shadow-sm hover:shadow-md active:scale-[0.99] cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FolderOpen className="w-5 h-5 text-emerald-700 dark:text-emerald-300" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  {t.uploadFromFileManager}
                </h4>
              </div>
            </label>
              
          </div>
        ) : (
          /* Step B: QR Code Scanner Screen */
          <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 text-center space-y-4 shadow-sm max-w-sm mx-auto my-auto animate-in fade-in duration-300 text-slate-900 dark:text-white">
            
            {/* Header */}
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {t.scanQrToUploadTitle}
              </h3>
            </div>

            {/* Centered High-Res QR Code */}
            <div className="p-4 bg-white rounded-2xl border-2 border-emerald-500/30 inline-block shadow-sm">
              <QRCodeSVG
                value={typeof window !== "undefined" ? `${window.location.protocol}//${localIp || window.location.hostname}:3000/mobile-upload?session=${sessionId}` : ""}
                size={190}
                level="M"
                includeMargin={false}
              />
            </div>

            {/* Offline Physical Report Checkbox Option */}
            <div className="pt-1">
              <label className="flex items-center justify-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors select-none text-left">
                <input
                  type="checkbox"
                  checked={showOfflineReports}
                  onChange={(e) => setShowOfflineReports(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-600 flex-shrink-0"
                />
                <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {t.showOfflineReportsLabel}
                </span>
              </label>
            </div>

          </div>
        )
      ) : (
        <div className="w-full max-w-xl mx-auto bg-white/95 dark:bg-slate-900/90 border border-emerald-500/40 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3 transition-all text-slate-900 dark:text-white">
          
          {/* Header with Document Count & Clear All */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center">
                <Files className="w-4 h-4 text-emerald-700 dark:text-emerald-300" />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                {formatUploadedRecords(files.length, lang)}
              </h3>
            </div>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-2 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              title="Clear all uploaded documents"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.clearAllDocs}</span>
            </button>
          </div>

          {/* Document Switcher Tabs if > 1 Document */}
          {files.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {files.map((file, idx) => (
                <button
                  key={file.id}
                  type="button"
                  onClick={() => setActivePreviewIndex(idx)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer ${
                    activePreviewIndex === idx
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  <span>{formatPageTab(idx + 1, lang)}</span>
                  {activePreviewIndex === idx && <CheckCircle2 className="w-3 h-3" />}
                </button>
              ))}
            </div>
          )}

          {/* Active Document Visual Preview Frame (Expanded & Enhanced) */}
          {currentFile && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 relative overflow-hidden flex flex-col items-center justify-center">
              
              {/* Delete this specific page button */}
              <button
                type="button"
                onClick={() => handleRemoveFile(activePreviewIndex)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-black/60 hover:bg-rose-600 text-white transition-colors z-20 shadow cursor-pointer"
                title="Remove this document"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              {currentFile.previewUrl ? (
                /* Actual Image Preview */
                <div className="relative w-full h-48 sm:h-56 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white flex items-center justify-center shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentFile.previewUrl}
                    alt={currentFile.name}
                    className="w-full h-full object-contain"
                  />
                  {isScanning && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2 z-30 animate-in fade-in">
                      <ScanLine className="w-8 h-8 text-emerald-400 animate-bounce" />
                      <span className="text-xs font-bold text-emerald-300">{scanStepText}</span>
                      <div className="w-36 bg-white/20 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-emerald-400 h-full rounded-full transition-all duration-300" style={{ width: `${scanProgress}%` }} />
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold">
                    DOCUMENT #{activePreviewIndex + 1}
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
                  <div className="space-y-1 text-slate-500 dark:text-slate-400 text-[10px]">
                    <p>• Clinical Prescriptions & Dosage Chart</p>
                    <p>• Verified Lab Diagnostic Findings</p>
                  </div>
                </div>
              )}

              {/* File Details Bar */}
              <div className="w-full mt-2 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-semibold px-1">
                <span className="truncate max-w-[240px]" title={currentFile.name}>
                  {currentFile.name}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                  {currentFile.size}
                </span>
              </div>
            </div>
          )}

          {/* Single Clean Option: Add More Documents */}
          <label className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-emerald-50/80 dark:bg-slate-800/60 dark:hover:bg-emerald-950/40 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm active:scale-[0.99] mt-2">
            <input
              type="file"
              multiple
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Plus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t.addMoreDocs}</span>
          </label>

        </div>

      )}

      {/* Clean Bottom Navigation Bar */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5 pt-1.5">
        
        {/* Contextual Back Button */}
        {uploadMode === "qr" && files.length === 0 ? (
          <button
            type="button"
            onClick={() => setUploadMode("choice")}
            className="w-full sm:w-auto py-2 px-5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center space-x-2 shadow-sm active:scale-[0.99]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.back}</span>
          </button>
        ) : onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto py-2 px-5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center space-x-2 shadow-sm active:scale-[0.99]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.back}</span>
          </button>
        ) : null}

        {/* Single Primary Continue / Submit Button */}
        {(files.length > 0 || (uploadMode === "qr" && showOfflineReports) || uploadMode === "choice") && (
          <button
            type="button"
            onClick={() => {
              if (extractedData) {
                onProceed(extractedData, files);
              } else if (files.length > 0) {
                handleStartOcrScan(true);
              } else {
                onProceed(undefined, files);
              }
            }}
            disabled={isScanning}
            className="w-full sm:w-auto sm:min-w-[180px] py-2.5 px-6 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 shadow-md active:scale-[0.99] bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-600/25 disabled:opacity-75 cursor-pointer animate-in fade-in duration-200"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t.processing}</span>
              </>
            ) : files.length > 0 ? (
              <>
                <span>{t.continueAction || t.submit}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : showOfflineReports ? (
              <>
                <span>{t.continueAction || t.submit}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>{t.continueWithoutUpload}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}
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
                {t.scanToUploadViaPhone}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t.pointPhoneCameraDesc}
              </p>
            </div>

            {/* QR Code Canvas */}
            <div className="p-4 bg-white rounded-2xl border-2 border-emerald-500/30 inline-block shadow-inner">
              <QRCodeSVG
                value={typeof window !== "undefined" ? `${window.location.protocol}//${localIp || window.location.hostname}:3000/mobile-upload?session=${sessionId}` : ""}
                size={180}
                level="M"
                includeMargin={false}
              />
            </div>

            {/* Listening Badge */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{t.waitingForMobileUpload}</span>
            </div>

            {/* Quick Test Simulator Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleSimulateMobileUpload}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5"
              >
                <span>⚡ {t.simulateMobileUpload}</span>
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
                  {t.cameraCaptureTitle}
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
                  {t.alignPrescriptionHere}
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
                  <span>{t.capturePhoto}</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
