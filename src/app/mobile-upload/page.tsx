"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import { Camera, Upload, CheckCircle, Loader2, Plus } from "lucide-react";

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
    setError("");
    
    const finish = () => {
      // Safely clear input after a delay
      setTimeout(() => {
        e.target.value = '';
      }, 1000);
    };

    // If it's a PDF or non-image
    if (!file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        processImage(base64, file.name || "Document.pdf");
        finish();
      };
      reader.onerror = () => {
        setError("Failed to read the file.");
        setIsProcessing(false);
        finish();
      };
      reader.readAsDataURL(file);
      return;
    }

    // Compress image
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Str = event.target?.result as string;
      
      const img = new Image();
      img.onload = () => {
        try {
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
          if (!ctx) throw new Error("Could not create canvas context");
          
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to highly compressed JPEG base64
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6);
          processImage(compressedBase64, file.name || "Mobile_Upload.jpg");
        } catch (err) {
          console.error("Compression error:", err);
          setError("Failed to compress image.");
          setIsProcessing(false);
        }
        finish();
      };
      
      img.onerror = () => {
        setError("Failed to load image for compression.");
        setIsProcessing(false);
        finish();
      };

      img.src = base64Str;
    };
    
    reader.onerror = () => {
      setError("Failed to read image from device.");
      setIsProcessing(false);
      finish();
    };
    
    reader.readAsDataURL(file);
  };

      const processImage = async (base64Data: string, filename: string) => {
    setIsProcessing(true);
    setError("");

    try {
      const res = await fetch("/api/upload-mobile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, base64: base64Data, filename }),
      });

      if (!res.ok) {
        throw new Error("Failed to send image to server.");
      }

      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
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
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Sent to Laptop!</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
              The document is now visible on the kiosk screen.
            </p>
            
            <div className="mt-8">
              <button 
                onClick={() => {
                  setIsSuccess(false);
                  setError("");
                }}
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-emerald-600/30"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Another Document</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Upload Documents</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Take a photo of your prescription or select a file from your device. It will instantly appear on the kiosk.
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
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.setAttribute("capture", "environment");
                    fileInputRef.current.click();
                  }
                }}
                disabled={isProcessing}
                className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/30 transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-6 h-6" />
                    <span>Camera Click</span>
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
                <span>Browse Files</span>
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
