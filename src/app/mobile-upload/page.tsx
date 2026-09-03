"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Camera, Upload, CheckCircle, Loader2 } from "lucide-react";

function MobileUploadContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!sessionId) {
    return <div className="p-8 text-center text-red-500 font-bold">Invalid QR Code: Missing Session ID.</div>;
  }

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    
    // Compress image using Canvas
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
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
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to highly compressed JPEG base64
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6);
        processImage(compressedBase64);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (base64Data: string) => {
    setIsProcessing(true);
    setError("");

    try {
      // 1. Send to our Gemini OCR API
      const res = await fetch("/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64Data }),
      });

      if (!res.ok) {
        throw new Error("Failed to extract data from image");
      }

      const extractedData = await res.json();

      // 2. Sync to Firebase
      await setDoc(doc(db, "uploads", sessionId), {
        status: "completed",
        ocrDetails: extractedData,
        timestamp: new Date().toISOString()
      });

      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
      
      // Update firebase with error
      await setDoc(doc(db, "uploads", sessionId), {
        status: "error",
        error: err.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 font-sans">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl w-full max-w-sm p-8 text-center space-y-6 border border-slate-100 dark:border-slate-800">
        
        {isSuccess ? (
          <div className="animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Upload Complete</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
              Your prescription has been scanned and sent to the Kiosk successfully. You can close this page!
            </p>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Scan Medical Records</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Hold your paper prescription in a well-lit area and take a clear picture.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm font-semibold">
                {error}
              </div>
            )}

            <div className="space-y-3 pt-4">
              <input 
                type="file" 
                accept="image/*" 
                capture="environment" 
                ref={fileInputRef}
                onChange={handleCapture}
                className="hidden" 
              />
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/30 transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-6 h-6" />
                    <span>Open Camera</span>
                  </>
                )}
              </button>

              <button 
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.removeAttribute("capture");
                    fileInputRef.current.click();
                  }
                }}
                disabled={isProcessing}
                className="w-full h-12 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-70"
              >
                <Upload className="w-4 h-4" />
                <span>Upload from Gallery</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function MobileUploadPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <MobileUploadContent />
    </Suspense>
  );
}
