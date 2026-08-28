"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { StepIndicator } from "@/components/kiosk/StepIndicator";
import { PatientRegistration, PatientRegistrationData } from "@/components/registration/PatientRegistration";
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

export default function KioskPage() {
  const [selectedState, setSelectedState] = useState<string>("national");
  const [lang, setLang] = useState<Language>("en");
  const [voiceGuide, setVoiceGuide] = useState<boolean>(false);
  const [voiceLang, setVoiceLang] = useState<Language>("hi");

  // Flow State: 1 = Registration, 2 = Anatomy Map, 3 = OCR Upload, 4 = Token Receipt
  const [currentStep, setCurrentStep] = useState<number>(1);

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

  // Speak step guide when step changes and voice guide is on
  useEffect(() => {
    if (!voiceGuide) return;
    const activeVoice = (lang !== "en" && lang !== "hi") ? voiceLang : lang;
    const prompts = VOICE_PROMPTS[activeVoice] || VOICE_PROMPTS.en;
    if (currentStep === 1) {
      speakText(prompts.step1, activeVoice);
    } else if (currentStep === 2) {
      speakText(prompts.step2, activeVoice);
    } else if (currentStep === 3) {
      speakText(prompts.step3, activeVoice);
    } else if (currentStep === 4) {
      speakText(prompts.step4, activeVoice);
    }
  }, [currentStep, lang, voiceGuide, voiceLang]);

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
    setCurrentStep(1);
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
  };

  const handleEmergencyTokenGenerated = (token: StoredToken) => {
    setGeneratedToken(token);
    setCurrentStep(4);
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors">
      {/* Top Kiosk Navbar */}
      <Navbar
        selectedState={selectedState}
        onStateChange={handleStateChange}
        lang={lang}
        onLanguageChange={setLang}
        voiceGuide={voiceGuide}
        onVoiceGuideToggle={setVoiceGuide}
        voiceLang={voiceLang}
        onVoiceLangChange={setVoiceLang}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Step Indicator Wizard */}
        <StepIndicator
          currentStep={currentStep}
          lang={lang}
          onStepClick={(step) => {
            if (step < currentStep) setCurrentStep(step);
          }}
        />

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

        {/* Step 2: Interactive Anatomical Skeleton Map with Seamless Slide-Down Symptom Flow */}
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

      </main>

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
