"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { StepIndicator } from "@/components/kiosk/StepIndicator";
import { PatientRegistration, PatientRegistrationData } from "@/components/registration/PatientRegistration";
import { LandingScreen } from "@/components/kiosk/LandingScreen";
import { AnatomicalSkeletonMap } from "@/components/anatomy/AnatomicalSkeletonMap";
import { OrganDrillDownModal, SymptomDrillDownData } from "@/components/anatomy/OrganDrillDownModal";
import { DocumentUpload, OcrExtractedData } from "@/components/ocr/DocumentUpload";
import { TokenReceiptModal } from "@/components/token/TokenReceiptModal";
import { WhatsAppDispatchModal } from "@/components/token/WhatsAppDispatchModal";
import { EmergencyFastTrackModal } from "@/components/emergency/EmergencyFastTrackModal";
import { BodyRegionId } from "@/lib/anatomy-data";
import { Language, translations } from "@/lib/i18n";
import { computeTriage } from "@/lib/triage";
import { StoredToken, addToken } from "@/lib/store";
import { speakText } from "@/lib/speech";
import { INDIAN_STATES } from "@/lib/states-languages";
import { VOICE_PROMPTS } from "@/lib/speech-prompts";
import { useLanguage } from "@/lib/language-context";

export default function KioskPage() {
  const [selectedState, setSelectedState] = useState<string>("national");
  const { lang, setLang } = useLanguage();
  const [voiceGuide, setVoiceGuideRaw] = useState<boolean>(false);

  const setVoiceGuide = (val: boolean) => {
    setVoiceGuideRaw(val);
    sessionStorage.setItem("voice_guide_on", String(val));
  };

  // Restore voice guide state from sessionStorage after mount
  useEffect(() => {
    const saved = sessionStorage.getItem("voice_guide_on");
    if (saved === "true") setVoiceGuideRaw(true);
  }, []);

  const [voiceLang, setVoiceLang] = useState<Language>("hi");

  // Flow State: 0 = Landing, 1 = Registration, 2 = Anatomy Map, 3 = OCR Upload, 4 = Token Receipt
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Registration Data
  const [registrationData, setRegistrationData] = useState<PatientRegistrationData>({
    patientName: "",
    age: 0,
    gender: "Male",
    phone: "",
  });

  // Anatomy & Symptoms Data
  const [selectedRegions, setSelectedRegions] = useState<BodyRegionId[]>([]);
  const [isDrillDownOpen, setIsDrillDownOpen] = useState<boolean>(false);
  const [symptomData, setSymptomData] = useState<SymptomDrillDownData>({
    selectedOrgans: [],
    selectedSymptoms: [],
    isDontKnow: false,
    painSeverity: 5,
    duration: "few_days",
  });

  // Document Upload Data
  const [ocrData, setOcrData] = useState<OcrExtractedData | null>(null);

  // Generated Token Result
  const [generatedToken, setGeneratedToken] = useState<StoredToken | null>(null);

  // Modals
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState<boolean>(false);

  // When state changes, keep English as default, or allow state-specific language
  const handleStateChange = (stateId: string) => {
    setSelectedState(stateId);
  };

  // Hydrate state from sessionStorage (Auto-Save Recovery)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("kiosk_session_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentStep !== undefined && parsed.currentStep > 0 && parsed.currentStep < 4) {
          setCurrentStep(parsed.currentStep);
        }
        if (parsed.registrationData) setRegistrationData(parsed.registrationData);
        if (parsed.selectedRegions) setSelectedRegions(parsed.selectedRegions);
        if (parsed.symptomData) setSymptomData(parsed.symptomData);
      }
    } catch (e) {
      console.error("Failed to load session state");
    }
  }, []);

  // Save state to sessionStorage
  useEffect(() => {
    const stateToSave = {
      currentStep,
      registrationData,
      selectedRegions,
      symptomData,
    };
    sessionStorage.setItem("kiosk_session_state", JSON.stringify(stateToSave));
  }, [currentStep, registrationData, selectedRegions, symptomData]);

  // Speak step guide when step changes and voice guide is on
  useEffect(() => {
    if (!voiceGuide) return;
    const activeVoice = (lang !== "en" && lang !== "hi") ? voiceLang : lang;
    const prompts = VOICE_PROMPTS[activeVoice] || VOICE_PROMPTS.en;
    if (currentStep === 0) {
      speakText(prompts.step0, activeVoice);
    } else if (currentStep === 1) {
      speakText(prompts.step1, activeVoice);
    } else if (currentStep === 2) {
      if (!isDrillDownOpen) {
        speakText(prompts.step2, activeVoice);
      }
    } else if (currentStep === 3) {
      speakText(prompts.step3, activeVoice);
    } else if (currentStep === 4) {
      speakText(prompts.step4, activeVoice);
    }
  }, [currentStep, lang, voiceGuide, voiceLang, isDrillDownOpen]);

  // Auto-Reset Inactivity Timer
  const [showIdleWarning, setShowIdleWarning] = useState(false);

  useEffect(() => {
    if (currentStep === 0 || currentStep === 4) {
      setShowIdleWarning(false);
      return;
    }

    let warningTimer: NodeJS.Timeout;
    let resetTimer: NodeJS.Timeout;

    const handleResetKioskInternal = () => {
      setCurrentStep(0);
      setRegistrationData({ patientName: "", age: 0, gender: "Male", phone: "" });
      setSelectedRegions([]);
      setSymptomData({ selectedOrgans: [], selectedSymptoms: [], isDontKnow: false, painSeverity: 5, duration: "few_days" });
      setOcrData(null);
      setGeneratedToken(null);
      setShowIdleWarning(false);
      sessionStorage.removeItem("kiosk_session_state");
    };

    const resetTimers = () => {
      setShowIdleWarning(false);
      clearTimeout(warningTimer);
      clearTimeout(resetTimer);

      // 5 minutes (300,000 ms) of inactivity triggers the warning modal
      warningTimer = setTimeout(() => {
        setShowIdleWarning(true);
        
        // 30 seconds to reply, otherwise hard reset
        resetTimer = setTimeout(() => {
          handleResetKioskInternal();
        }, 30000);
      }, 300000);
    };

    const handleActivity = () => resetTimers();

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("touchstart", handleActivity);
    window.addEventListener("keydown", handleActivity);

    resetTimers(); // Start initial timer

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      clearTimeout(warningTimer);
      clearTimeout(resetTimer);
    };
  }, [currentStep]);

  // Handlers
  const handleRegistrationProceed = (data: PatientRegistrationData) => {
    setRegistrationData(data);
    setCurrentStep(2);
  };

  const handleToggleRegion = (regionId: BodyRegionId) => {
    setSelectedRegions((prev) =>
      prev.includes(regionId) ? prev.filter((r) => r !== regionId) : [...prev, regionId]
    );
  };

  const handleClearRegions = () => {
    setSelectedRegions([]);
    setSymptomData({
      selectedOrgans: [],
      selectedSymptoms: [],
      isDontKnow: false,
      painSeverity: 5,
      duration: "few_days",
    });
  };

  const handleProceedToDrillDown = () => {
    if (selectedRegions.length === 0) return;
    setIsDrillDownOpen(true);
  };

  const handleSaveSymptomDrillDown = (data: SymptomDrillDownData) => {
    setSymptomData(data);
    setIsDrillDownOpen(false);
    setCurrentStep(3); // move to OCR upload
  };

  const handleOcrProceed = (extracted?: OcrExtractedData) => {
    if (extracted) setOcrData(extracted);
    generateFinalToken(extracted);
  };

  const handleOcrSkip = () => {
    generateFinalToken();
  };

  const generateFinalToken = (uploadedOcr?: OcrExtractedData) => {
    const triageResult = computeTriage({
      patientName: registrationData.patientName,
      age: registrationData.age,
      gender: registrationData.gender,
      phone: registrationData.phone,
      abhaId: registrationData.abhaId,
      selectedRegions,
      selectedOrgans: symptomData.selectedOrgans,
      selectedSymptoms: symptomData.selectedSymptoms,
      isDontKnow: symptomData.isDontKnow,
      painSeverity: symptomData.painSeverity,
      duration: symptomData.duration,
      ocrExtractedNotes: uploadedOcr?.rawText,
    });

    const newStoredToken: StoredToken = {
      id: triageResult.tokenId,
      result: triageResult,
      input: {
        patientName: registrationData.patientName,
        age: registrationData.age,
        gender: registrationData.gender,
        phone: registrationData.phone,
        abhaId: registrationData.abhaId,
        selectedRegions,
        selectedOrgans: symptomData.selectedOrgans,
        selectedSymptoms: symptomData.selectedSymptoms,
        isDontKnow: symptomData.isDontKnow,
        painSeverity: symptomData.painSeverity,
        duration: symptomData.duration,
      },
      status: "WAITING",
      createdAt: new Date().toISOString(),
      ocrDetails: uploadedOcr
        ? {
            diagnoses: uploadedOcr.diagnoses,
            medications: uploadedOcr.medications,
            allergies: uploadedOcr.allergies,
            rawText: uploadedOcr.rawText,
          }
        : undefined,
    };

    addToken(newStoredToken);
    setGeneratedToken(newStoredToken);
    setCurrentStep(4);
  };

  const handleQuickEmergency = (condition: "cardiac" | "breathing" | "accident" | "fever_trauma") => {
    const effectivePhone = registrationData.phone.trim() || "9999999999";
    const effectiveName = registrationData.patientName.trim() || (lang === "hi" ? "आपातकालीन मरीज" : "Emergency Patient");

    const triageResult = computeTriage({
      patientName: effectiveName,
      age: registrationData.age || 45,
      gender: registrationData.gender || "Male",
      phone: effectivePhone,
      selectedRegions: condition === "cardiac" || condition === "breathing" ? ["chest"] : condition === "accident" ? ["pelvis", "legs_joints"] : ["head_neck"],
      selectedOrgans: condition === "cardiac" ? ["heart"] : condition === "breathing" ? ["lungs"] : condition === "accident" ? ["hip_joint", "knee_joint"] : ["forehead_brain"],
      selectedSymptoms: condition === "cardiac" ? ["chest_pressure_severe"] : condition === "breathing" ? ["breathlessness"] : condition === "accident" ? ["joint_swelling"] : ["high_fever_chills"],
      isDontKnow: false,
      painSeverity: 10,
      duration: "today",
      isEmergencyOverride: true,
      emergencyConditionType: condition,
    });

    const newStoredToken: StoredToken = {
      id: triageResult.tokenId,
      result: triageResult,
      input: {
        patientName: effectiveName,
        age: registrationData.age || 45,
        gender: registrationData.gender || "Male",
        phone: effectivePhone,
        selectedRegions: ["chest"],
        selectedOrgans: [],
        selectedSymptoms: [],
        isDontKnow: false,
        painSeverity: 10,
        duration: "today",
      },
      status: "WAITING",
      createdAt: new Date().toISOString(),
    };

    addToken(newStoredToken);
    setGeneratedToken(newStoredToken);
    setCurrentStep(4);

    if (voiceGuide) {
      const prompts = VOICE_PROMPTS[lang] || VOICE_PROMPTS.en;
      speakText(prompts.emergencyIssued(triageResult.tokenNumber), lang);
    }
  };

  const handleResetKiosk = () => {
    setCurrentStep(0);
    setRegistrationData({
      patientName: "",
      age: 0,
      gender: "Male",
      phone: "",
    });
    setSelectedRegions([]);
    setSymptomData({
      selectedOrgans: [],
      selectedSymptoms: [],
      isDontKnow: false,
      painSeverity: 5,
      duration: "few_days",
    });
    setOcrData(null);
    setGeneratedToken(null);
    setIsDrillDownOpen(false);
    setIsEmergencyOpen(false);
    setIsWhatsAppOpen(false);
    sessionStorage.removeItem("kiosk_session_state");
    sessionStorage.removeItem("emergency_token");
  };

  const handleEmergencyTokenGenerated = (token: StoredToken) => {
    setGeneratedToken(token);
    setCurrentStep(4);
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden flex flex-col transition-colors">
      {/* Top Kiosk Navbar */}
      <Navbar
        lang={lang}
        onLanguageChange={setLang}
        voiceGuide={voiceGuide}
        onVoiceGuideToggle={setVoiceGuide}
        voiceLang={voiceLang}
        onVoiceLangChange={setVoiceLang}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
      />

      {/* Enhanced Doctor Background visibility specifically for Landing Page (Step 0) */}
      {currentStep === 0 && (
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat opacity-25 dark:opacity-20 transition-opacity duration-500"
          style={{
            backgroundImage: `url('/images/doctor-bg.jpg')`,
            backgroundAttachment: "fixed",
          }}
        />
      )}

      {/* Main Content Area */}
      {currentStep === 0 ? (
        <main className="flex-1 min-h-0 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-center relative z-10 overflow-hidden">
          <LandingScreen 
            lang={lang}
            onStartReal={() => setCurrentStep(1)}
            onStartDemo={() => {
              setRegistrationData({
                patientName: "Ramesh Kumar",
                age: 48,
                gender: "Male",
                phone: "9876543210",
                abhaId: "14-8890-4432-1102"
              });
              setCurrentStep(1);
            }}
          />
        </main>
      ) : (
        <main className="flex-1 min-h-0 w-full flex flex-col md:flex-row items-stretch overflow-hidden">
          
          {/* L-Shape Left Wing: Sticky to viewport so Cancel/Reset button is ALWAYS visible */}
          <aside className="w-full md:w-72 lg:w-80 flex-shrink-0 border-r border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-4 sm:p-5 flex flex-col justify-between transition-colors shadow-sm h-full overflow-hidden">
            <StepIndicator
              currentStep={currentStep}
              lang={lang}
              registrationData={registrationData}
              onStepClick={(step) => {
                if (step < currentStep) setCurrentStep(step);
              }}
              onResetKiosk={handleResetKiosk}
            />
          </aside>

          {/* Right Main Content Panel */}
          <section className="flex-1 min-h-0 p-2 sm:p-4 flex justify-center items-center overflow-hidden">
            <div className="w-full max-w-5xl my-auto animate-custom-slide-in">
              {/* Step 1: Patient Registration & Identification */}
              {currentStep === 1 && (
                <PatientRegistration
                  initialData={registrationData}
                  onProceed={handleRegistrationProceed}
                  onEmergencyTokenGenerated={handleEmergencyTokenGenerated}
                  lang={lang}
                  voiceGuide={voiceGuide}
                />
              )}

              {/* Step 2: Interactive Anatomical Skeleton Map */}
              {currentStep === 2 && (
                <AnatomicalSkeletonMap
                  selectedRegions={selectedRegions}
                  onToggleRegion={handleToggleRegion}
                  onClearRegions={handleClearRegions}
                  symptomData={symptomData}
                  onUpdateSymptomData={setSymptomData}
                  onProceedToNextStep={(data) => {
                    setSymptomData(data);
                    setCurrentStep(3);
                  }}
                  onBack={() => setCurrentStep(1)}
                  lang={lang}
                  voiceGuide={voiceGuide}
                />
              )}

              {/* Step 3: Medical Record Upload (OCR) */}
              {currentStep === 3 && (
                <DocumentUpload
                  onProceed={handleOcrProceed}
                  onSkip={handleOcrSkip}
                  onBack={() => setCurrentStep(2)}
                  lang={lang}
                  voiceGuide={voiceGuide}
                />
              )}

              {/* Step 4: Token Receipt & Thermal Slip */}
              {currentStep === 4 && generatedToken && (
                <TokenReceiptModal
                  token={generatedToken}
                  lang={lang}
                  voiceGuide={voiceGuide}
                  onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
                  onReset={handleResetKiosk}
                />
              )}
            </div>
          </section>

        </main>
      )}

      {/* Organ Drill-Down Modal */}
      <OrganDrillDownModal
        isOpen={isDrillDownOpen}
        onClose={() => setIsDrillDownOpen(false)}
        selectedRegions={selectedRegions}
        initialData={symptomData}
        onSave={handleSaveSymptomDrillDown}
        lang={lang}
        voiceGuide={voiceGuide}
      />

      {/* Emergency Fast-Track Protocol Modal */}
      <EmergencyFastTrackModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        lang={lang}
        voiceGuide={voiceGuide}
        onTokenGenerated={handleEmergencyTokenGenerated}
      />

      {/* WhatsApp Cloud API Dispatch Modal */}
      {generatedToken && (
        <WhatsAppDispatchModal
          isOpen={isWhatsAppOpen}
          onClose={() => setIsWhatsAppOpen(false)}
          token={generatedToken}
          lang={lang}
        />
      )}

      {/* Idle Warning Modal */}
      {showIdleWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center mx-auto mb-4 border border-amber-200 dark:border-amber-800 animate-pulse">
              <span className="text-2xl">⏳</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Are you still there?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              For your privacy, this session will automatically reset if left unattended.
            </p>
            <button
              onClick={() => setShowIdleWarning(false)}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md active:scale-95"
            >
              Yes, I'm still here
            </button>
          </div>
        </div>
      )}

      {/* Kiosk Footer with Government & ABDM Compliance */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md py-4 text-center text-xs text-slate-500 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span>Ministry of Health & Family Welfare • National Health Authority (NHA)</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-400">
            <span>ABDM Compliant</span>
            <span>•</span>
            <span>DPDP Act 2023 Secure</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
