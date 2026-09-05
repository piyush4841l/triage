"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Activity, 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  Pill, 
  FileText, 
  CheckCircle2, 
  Heart, 
  Maximize2, 
  X, 
  Files, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ClipboardList,
  FlaskConical,
  Sparkles,
  ShieldAlert,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from "lucide-react";
import { getTokenById, StoredToken, getStoredTokens } from "@/lib/store";
import { useLanguage } from "@/lib/language-context";
import { Navbar } from "@/components/navbar";

interface PrescriptionItem {
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface RecommendedTestItem {
  testName: string;
  category: "Radiology" | "Pathology" | "Cardiology" | "Diagnostic Scan";
  purpose: string;
  room: string;
  urgency: "Stat / Urgent" | "Same Day OPD" | "Routine" | "Completed";
}

interface LabParameter {
  parameter: string;
  result: string;
  normalRange: string;
  unit: string;
  isAbnormal?: boolean;
}

interface UploadedReportDocument {
  id: string;
  name: string;
  size: string;
  date: string;
  type: "lab_report" | "prescription" | "radiology" | "general";
  previewUrl?: string;
  labTitle?: string;
  labFacility?: string;
  labParameters?: LabParameter[];
  clinicalImpression?: string;
}

interface AppointmentSlot {
  id: string;
  date: string;
  time: string;
  formattedDate: string;
  category: "OPD" | "Emergency";
  department: string;
  departmentHi: string;
  doctorName: string;
  doctorRole: string;
  status: "Active Visit" | "Completed";
  visitType: string;
  diagnosis: string;
  diagnosisHi: string;
  chiefComplaints: string;
  symptomsReported: string[];
  selectedOrgans?: string[];
  painSeverity?: number;
  duration?: string;
  vitals?: {
    bp: string;
    pulse: string;
    spo2: string;
    temp: string;
  };
  aiSummary?: string;
  prescriptions: PrescriptionItem[];
  recommendedTests: RecommendedTestItem[];
  doctorNotes: string;
  uploadedReports: UploadedReportDocument[];
}

export default function DoctorPatientRecordsPage() {
  const params = useParams();
  const router = useRouter();
  const { lang, setLang } = useLanguage();
  const tokenIdParam = (params?.tokenId as string) || "";

  const [token, setToken] = useState<StoredToken | undefined>(undefined);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("slot-current");
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [fullscreenReport, setFullscreenReport] = useState<UploadedReportDocument | null>(null);
  const [loggedInDoctor, setLoggedInDoctor] = useState<string>("");

  // Zoom & Pan state for High-Resolution Document Inspection
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState<boolean>(false);

  const handleOpenFullscreen = (report: UploadedReportDocument) => {
    setFullscreenReport(report);
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  };

  const handleCloseFullscreen = () => {
    setFullscreenReport(null);
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(Number((prev + 0.25).toFixed(2)), 3.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(Number((prev - 0.25).toFixed(2)), 1);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("doctor_session");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.name) {
          setLoggedInDoctor(parsed.name);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    const found = getTokenById(tokenIdParam);
    if (found) {
      setToken(found);
    } else {
      // Fallback to first token in storage if token ID wasn't found directly
      const all = getStoredTokens();
      if (all.length > 0) {
        setToken(all[0]);
      }
    }
  }, [tokenIdParam]);

  // Reset page index when switching slots
  const handleSelectSlot = (slotId: string) => {
    setSelectedSlotId(slotId);
    setActivePageIndex(0);
  };

  // Build patient details
  const patientName = token?.input.patientName || "Patient";
  const patientAge = token?.input.age || 42;
  const patientGender = token?.input.gender || "Male";
  const patientPhone = token?.input.phone || "9876543210";
  const abhaId = token?.input.abhaId || "91-4589-2041-8821";
  const currentDept = token?.result.department || "Orthopedics";
  const currentRoom = token?.result.roomNumber || "Room 110 (Bone & Joint Clinic)";

  // Dynamic doctor dealing with the patient today
  const doctorDealingToday = loggedInDoctor 
    ? (loggedInDoctor.startsWith("Dr.") ? loggedInDoctor : `Dr. ${loggedInDoctor}`) 
    : (token?.result.assignedDoctorName || "Dr. Suresh Patel (Orthopedic Surgeon)");

  const doctorRoleToday = currentDept.toLowerCase().includes("ortho")
    ? "Senior Orthopedic Surgeon"
    : currentDept.toLowerCase().includes("cardio")
    ? "Senior Interventional Cardiologist"
    : "Consultant Physician";

  // Build current uploaded documents (from kiosk upload or realistic scanned document photos)
  const currentUploadedDocs: UploadedReportDocument[] = [];

  const sampleDocumentImages = [
    "/images/tanmay-report.jpg",
    "/images/aadit-report.jpg",
    "/images/mohini-report.jpg",
    "/images/shashwat-report.jpg",
    "/images/piyush-report.jpg",
    "/images/tripti-report.jpg",
  ];

  if (token?.uploadedDocuments && token.uploadedDocuments.length > 0) {
    token.uploadedDocuments.forEach((doc, idx) => {
      currentUploadedDocs.push({
        id: `current-doc-${idx}`,
        name: doc.name || `Patient_Prescription_Document_0${idx + 1}.jpg`,
        size: doc.size || "1.4 MB",
        date: "Today",
        type: "prescription",
        previewUrl: doc.previewUrl || sampleDocumentImages[idx % sampleDocumentImages.length],
        clinicalImpression: token?.ocrDetails?.rawText || "Prescription uploaded by patient via Mobile Camera.",
      });
    });
  } else if (token?.mockAbhaProfile?.reportImage) {
    currentUploadedDocs.push(
      {
        id: "current-doc-abha-1",
        name: "Patient_Previous_Prescription_Slip.jpg",
        size: "1.4 MB",
        date: "Today",
        type: "prescription",
        previewUrl: token.mockAbhaProfile.reportImage || "/images/tanmay-report.jpg",
        clinicalImpression: token?.ocrDetails?.rawText || "Prescription uploaded by patient via Mobile Camera.",
      },
      {
        id: "current-doc-abha-2",
        name: "Diagnostic_Lab_Investigation_Page2.jpg",
        size: "980 KB",
        date: "Today",
        type: "lab_report",
        previewUrl: "/images/aadit-report.jpg",
        clinicalImpression: "Attached external clinical laboratory investigation report.",
      }
    );
  } else {
    // Realistic scanned document photos for intake demo
    currentUploadedDocs.push(
      {
        id: "current-intake-1",
        name: "Patient_Previous_Prescription_Slip.jpg",
        size: "1.4 MB",
        date: "Today",
        type: "prescription",
        previewUrl: "/images/tanmay-report.jpg",
        clinicalImpression: token?.ocrDetails?.rawText || token?.result.chiefComplaintSummaryEn || "Prior OPD medical slip uploaded by the patient at check-in.",
      },
      {
        id: "current-intake-2",
        name: "External_Lab_Blood_Investigation.jpg",
        size: "980 KB",
        date: "Today",
        type: "lab_report",
        previewUrl: "/images/aadit-report.jpg",
        clinicalImpression: "Borderline ESR elevation noted. Routine metabolic and hematological indices intact.",
      }
    );
  }

  // Dynamic Today Slot tailored to patient's department and selected issues
  const isOrtho = currentDept.toLowerCase().includes("ortho");
  const isCardio = currentDept.toLowerCase().includes("cardio");

  const todayDiagnosis = isOrtho
    ? "Acute Ankle Ligament Sprain (Grade II) & Soft Tissue Contusion"
    : isCardio
    ? "Atypical Angina Pectoris & Suspected Coronary Artery Spasm"
    : "Acute Febrile Illness & Upper Respiratory Tract Presentation";

  const todayDiagnosisHi = isOrtho
    ? "तीव्र टखने का मोच एवं खिंचाव"
    : isCardio
    ? "सीने में भारीपन एवं हृदय मूल्यांकन"
    : "तीव्र ज्वर एवं मौसमी संक्रमण";

  const todayComplaints = token?.result.chiefComplaintSummaryEn || (
    isOrtho
      ? "Hand Numbness, Tingling or Weakness, Twisted Ankle / Inability to bear weight with localized lateral edema."
      : isCardio
      ? "Substernal chest heaviness, mild breathlessness and palpitations upon climbing stairs."
      : "High-grade fever, severe fatigue, throat irritation and bodily aches."
  );

  const todaySymptoms = (token?.input.selectedSymptoms && token.input.selectedSymptoms.length > 0)
    ? token.input.selectedSymptoms
    : (isOrtho ? ["ankle_sprain_injury", "wrist_finger_numbness"] : ["fever_chills", "body_fatigue"]);

  const todayPrescriptions: PrescriptionItem[] = isOrtho
    ? [
        {
          medicine: "Tab Aceclofenac + Paracetamol (100mg/325mg)",
          dosage: "100/325 mg",
          frequency: "1 BD (Twice daily, post meals)",
          duration: "5 Days",
          instructions: "Take strictly after food with water. Anti-inflammatory pain relief.",
        },
        {
          medicine: "Tab Trypsin Chymotrypsin (100,000 Armour Units)",
          dosage: "100,000 AU",
          frequency: "1 TID (Thrice daily, 30 min before meals)",
          duration: "5 Days",
          instructions: "Anti-edema proteolytic enzyme to accelerate soft tissue haematoma resolution.",
        },
        {
          medicine: "Tab Pantoprazole 40mg",
          dosage: "40 mg",
          frequency: "1 OD (Morning, empty stomach)",
          duration: "5 Days",
          instructions: "Take 30 minutes before breakfast for gastro-protection.",
        },
        {
          medicine: "Diclofenac 1.16% Topical Pain Relief Gel",
          dosage: "Apply 10g",
          frequency: "3 Times Daily",
          duration: "7 Days",
          instructions: "Gently apply over lateral ankle joint without vigorous massage.",
        },
      ]
    : isCardio
    ? [
        {
          medicine: "Tab Sorbitrate 5mg (Isosorbide Dinitrate)",
          dosage: "5 mg",
          frequency: "1 Sublingual SOS",
          duration: "As needed",
          instructions: "Keep under tongue immediately if severe chest heaviness recurs.",
        },
        {
          medicine: "Tab Aspirin 75mg (Ecosprin)",
          dosage: "75 mg",
          frequency: "1 OD (Post lunch)",
          duration: "30 Days",
          instructions: "Antiplatelet therapy for cardiovascular protection.",
        },
        {
          medicine: "Tab Atorvastatin 20mg",
          dosage: "20 mg",
          frequency: "1 HS (Bedtime)",
          duration: "30 Days",
          instructions: "Plaque stabilization and lipid reduction.",
        },
        {
          medicine: "Tab Metoprolol Succinate 25mg",
          dosage: "25 mg",
          frequency: "1 OD (Morning)",
          duration: "30 Days",
          instructions: "Controls adrenergic spikes and reduces cardiac workload.",
        },
      ]
    : [
        {
          medicine: "Tab Paracetamol 650mg",
          dosage: "650 mg",
          frequency: "1 SOS (Max 3 daily)",
          duration: "3 Days",
          instructions: "Take post-meals for temperature spike (>100°F) and body ache.",
        },
        {
          medicine: "Tab Amoxicillin + Clavulanate 625mg",
          dosage: "625 mg",
          frequency: "1 BD (After meals)",
          duration: "5 Days",
          instructions: "Broad-spectrum antibacterial therapy. Complete full 5-day course.",
        },
        {
          medicine: "Tab Levocetirizine 5mg + Montelukast 10mg",
          dosage: "5/10 mg",
          frequency: "1 HS (Bedtime)",
          duration: "5 Days",
          instructions: "Decongests upper airway and relieves nocturnal cough.",
        },
      ];

  const todayRecommendedTests: RecommendedTestItem[] = isOrtho
    ? [
        {
          testName: "Digital X-Ray Right Ankle Joint (AP, Lateral & Mortise Views)",
          category: "Radiology",
          purpose: "Rule out lateral malleolus avulsion fracture, talar tilt, or syndesmotic widening",
          room: "Ground Floor - X-Ray Room 12",
          urgency: "Stat / Urgent",
        },
        {
          testName: "High-Resolution Musculoskeletal Ultrasound (USG)",
          category: "Diagnostic Scan",
          purpose: "Inspect Anterior Talofibular Ligament (ATFL) & calcaneofibular ligament continuity",
          room: "Radiology Wing - USG Suite 03",
          urgency: "Same Day OPD",
        },
        {
          testName: "Serum Uric Acid, ESR & High-Sensitivity CRP",
          category: "Pathology",
          purpose: "Assess acute systemic inflammatory markers and exclude gouty arthropathy",
          room: "Central Pathology Desk 02",
          urgency: "Same Day OPD",
        },
      ]
    : isCardio
    ? [
        {
          testName: "Standard 12-Lead Resting Electrocardiogram (ECG)",
          category: "Cardiology",
          purpose: "Examine ST-T segment deviation, conduction delays, or ischemic rhythm markers",
          room: "Cardiac Diagnostics Room 108",
          urgency: "Stat / Urgent",
        },
        {
          testName: "Serum Troponin-I (High Sensitivity) & CK-MB",
          category: "Pathology",
          purpose: "Cardiac biomarker assessment to exclude acute myocardial injury",
          room: "Emergency Stat Lab",
          urgency: "Stat / Urgent",
        },
        {
          testName: "2D Transthoracic Echocardiogram (Color Doppler)",
          category: "Cardiology",
          purpose: "Evaluate Left Ventricular Ejection Fraction (LVEF) & regional wall motion",
          room: "Echo Lab Room 204",
          urgency: "Same Day OPD",
        },
      ]
    : [
        {
          testName: "Complete Blood Count (CBC) with Platelet Count & PS",
          category: "Pathology",
          purpose: "Evaluate Total Leukocyte Count, differential count, and rule out thrombocytopenia",
          room: "Central Pathology Counter 01",
          urgency: "Same Day OPD",
        },
        {
          testName: "Rapid Dengue NS1 Antigen & Malarial Antigen Card",
          category: "Pathology",
          purpose: "Vector-borne acute febrile illness differential screening",
          room: "Microbiology Section",
          urgency: "Same Day OPD",
        },
        {
          testName: "Routine Urine Analysis & Microscopy",
          category: "Pathology",
          purpose: "Screen for occult urinary tract infection or proteinuria",
          room: "Clinical Pathology Room 04",
          urgency: "Routine",
        },
      ];

  const todayDoctorNotes = isOrtho
    ? "Advised strict R.I.C.E. protocol (Rest, Ice pack application for 15 mins every 3 hrs, Compression with crepe bandage, Elevation). Avoid weight-bearing on right foot. Review with X-Ray films today at 01:30 PM."
    : isCardio
    ? "Advised physical rest. Avoid strenuous exertion or heavy lifting. Review immediately with ECG tracing and Stat Troponin-I reports."
    : "Hydration protocol (2.5L oral fluids/day). Steam inhalation twice daily. Review if temperature remains above 101°F after 48 hours.";

  // Determine if today's visit is Emergency or OPD
  const isEmergencyToday = 
    token?.result.priorityTier === "RED" || 
    Boolean(token?.input.isEmergencyOverride) || 
    Boolean(token?.result.tokenNumber?.startsWith("EMG")) || 
    Boolean(token?.result.department?.toLowerCase().includes("emergency"));

  // Appointment Slots History (Chronological past meetings & visits)
  const appointmentSlots: AppointmentSlot[] = [
    {
      id: "slot-current",
      date: "Today",
      time: "Live Session",
      formattedDate: "Today",
      category: isEmergencyToday ? "Emergency" : "OPD",
      department: currentDept,
      departmentHi: token?.result.departmentHi || (lang === "hi" ? "ओपीडी परामर्श" : currentDept),
      doctorName: doctorDealingToday,
      doctorRole: doctorRoleToday,
      status: "Active Visit",
      visitType: isEmergencyToday ? "Emergency Fast-Track" : "Live OPD Intake",
      diagnosis: todayDiagnosis,
      diagnosisHi: todayDiagnosisHi,
      chiefComplaints: todayComplaints,
      symptomsReported: todaySymptoms,
      selectedOrgans: (token?.input.selectedOrgans && token.input.selectedOrgans.length > 0)
        ? token.input.selectedOrgans
        : (token?.input.selectedRegions && token.input.selectedRegions.length > 0 ? token.input.selectedRegions : [isOrtho ? "ankle_joint" : isCardio ? "heart" : "chest"]),
      painSeverity: token?.input.painSeverity || (isEmergencyToday ? 9 : 6),
      duration: token?.input.duration || "few_days",
      vitals: {
        bp: isEmergencyToday ? "148/96 mmHg" : "124/82 mmHg",
        pulse: isEmergencyToday ? "108 bpm" : "76 bpm",
        spo2: isEmergencyToday ? "93%" : "98%",
        temp: isEmergencyToday ? "101.2°F" : "98.6°F",
      },
      aiSummary: token?.result.triageRationaleEn || (
        isEmergencyToday
          ? "AI Triage Alert: Critical high-acuity emergency indicators detected. Fast-track emergency stabilization and immediate senior doctor review protocol triggered."
          : "AI Triage Summary: Patient registered via digital kiosk with stable physiological signs. Routed to OPD queue for specialized clinical review."
      ),
      prescriptions: todayPrescriptions,
      recommendedTests: todayRecommendedTests,
      doctorNotes: todayDoctorNotes,
      uploadedReports: currentUploadedDocs,
    },
    {
      id: "slot-past-1",
      date: "18 Feb 2026",
      time: "10:30 AM",
      formattedDate: "18 Feb 2026",
      category: "OPD",
      department: "General Medicine OPD",
      departmentHi: "सामान्य चिकित्सा ओपीडी",
      doctorName: "Dr. Priya Nair, MD",
      doctorRole: "Consultant Physician",
      status: "Completed",
      visitType: "Follow-up Consultation",
      diagnosis: "Essential Hypertension & Viral Rhinopharyngitis",
      diagnosisHi: "उच्च रक्तचाप एवं मौसमी संक्रमण",
      chiefComplaints: "Follow-up for elevated blood pressure recordings, throbbing headache and persistent nasal congestion.",
      symptomsReported: ["throbbing_frontal_headache", "fatigue", "dry_cough", "mild_sore_throat"],
      selectedOrgans: ["head", "throat"],
      painSeverity: 4,
      duration: "few_days",
      vitals: {
        bp: "138/88 mmHg",
        pulse: "82 bpm",
        spo2: "98%",
        temp: "99.1°F",
      },
      aiSummary: "AI Assessment: Chronic mild hypertensive presentation accompanied by upper respiratory viral symptoms. Ambulatory BP monitoring and symptom-targeted anti-inflammatory course advised.",
      prescriptions: [
        {
          medicine: "Tab Telmisartan 40mg",
          dosage: "40 mg",
          frequency: "1 OD (Morning)",
          duration: "30 Days",
          instructions: "Regular BP monitoring log required.",
        },
        {
          medicine: "Tab Levocetirizine 5mg",
          dosage: "5 mg",
          frequency: "1 HS (Bedtime)",
          duration: "5 Days",
          instructions: "For allergic rhinitis symptoms.",
        },
        {
          medicine: "Cap Vitamin C + Zinc",
          dosage: "500 mg",
          frequency: "1 OD",
          duration: "15 Days",
          instructions: "Immunity support post meal.",
        },
      ],
      recommendedTests: [
        {
          testName: "Complete Blood Count & Metabolic Panel",
          category: "Pathology",
          purpose: "Renal profile and electrolyte balance check",
          room: "Central Pathology Lab",
          urgency: "Completed",
        },
        {
          testName: "12-Lead Resting Electrocardiogram (ECG)",
          category: "Cardiology",
          purpose: "Baseline hypertensive cardiovascular screen",
          room: "ECG Room 02",
          urgency: "Completed",
        },
      ],
      doctorNotes: "BP moderately elevated. Anti-hypertensive therapy initiated. Sodium restriction advised. Re-evaluate in 30 days.",
      uploadedReports: [
        {
          id: "rep-18feb-1",
          name: "Complete_Blood_Count_Metabolic_Panel.jpg",
          size: "1.4 MB",
          date: "18 Feb 2026",
          type: "lab_report",
          previewUrl: "/images/mohini-report.jpg",
          clinicalImpression: "Borderline fasting glycemia noted. Renal function indices within physiological parameters.",
        },
        {
          id: "rep-18feb-2",
          name: "Standard_12_Lead_ECG_Analysis.jpg",
          size: "980 KB",
          date: "18 Feb 2026",
          type: "radiology",
          previewUrl: "/images/shashwat-report.jpg",
          clinicalImpression: "Normal sinus rhythm. Normal axis. No pathological Q waves or acute ST-T wave deviation.",
        },
      ],
    },
    {
      id: "slot-past-2",
      date: "12 Nov 2025",
      time: "02:15 PM",
      formattedDate: "12 Nov 2025",
      category: "Emergency",
      department: "Emergency & Trauma / Cardiology",
      departmentHi: "आपातकालीन एवं हृदय रोग विभाग",
      doctorName: "Dr. Rajesh Mehta, DM",
      doctorRole: "Senior Interventional Cardiologist",
      status: "Completed",
      visitType: "Emergency Cardiac Review",
      diagnosis: "Atypical Exertional Dyspnea & Dyslipidemia",
      diagnosisHi: "हृदय रोग एवं कोलेस्ट्रॉल समीक्षा",
      chiefComplaints: "Substernal heaviness upon climbing 2 flights of stairs, resolved within 5 minutes of rest.",
      symptomsReported: ["exertional_heaviness", "mild_palpitations", "brisk_walking_fatigue"],
      selectedOrgans: ["chest", "heart"],
      painSeverity: 7,
      duration: "today",
      vitals: {
        bp: "142/90 mmHg",
        pulse: "88 bpm",
        spo2: "97%",
        temp: "98.4°F",
      },
      aiSummary: "AI Assessment: Exertional cardiac discomfort flagged for immediate emergency cardiology evaluation. Stat 12-lead ECG and lipid panel performed to exclude acute coronary syndrome.",
      prescriptions: [
        {
          medicine: "Tab Atorvastatin 20mg",
          dosage: "20 mg",
          frequency: "1 HS (Night)",
          duration: "90 Days",
          instructions: "Lipid reduction protocol. Liver function test in 3 months.",
        },
        {
          medicine: "Tab Metoprolol Tartrate 25mg",
          dosage: "25 mg",
          frequency: "1 OD (Morning)",
          duration: "30 Days",
          instructions: "Controls heart rate and blunts adrenergic spikes.",
        },
      ],
      recommendedTests: [
        {
          testName: "2D Transthoracic Echocardiogram (Echo)",
          category: "Cardiology",
          purpose: "Left ventricular ejection fraction & wall motion analysis",
          room: "Echo Lab",
          urgency: "Completed",
        },
        {
          testName: "Serum Lipid Profile & Liver Function Panel",
          category: "Pathology",
          purpose: "Atherogenic lipid stratification",
          room: "Biochemistry Lab",
          urgency: "Completed",
        },
      ],
      doctorNotes: "Stress echocardiography showed good exercise capacity. 2D Echo revealed LVEF 60% with normal ventricular wall motion.",
      uploadedReports: [
        {
          id: "rep-12nov-1",
          name: "2D_Transthoracic_Echocardiogram.jpg",
          size: "2.1 MB",
          date: "12 Nov 2025",
          type: "radiology",
          previewUrl: "/images/piyush-report.jpg",
          clinicalImpression: "Normal LV cavity dimensions and systolic contractility. Grade I diastolic relaxation abnormality.",
        },
        {
          id: "rep-12nov-2",
          name: "Serum_Lipid_Profile_Risk_Stratification.jpg",
          size: "870 KB",
          date: "12 Nov 2025",
          type: "lab_report",
          previewUrl: "/images/tripti-report.jpg",
          clinicalImpression: "Mixed dyslipidemia profile. Lifestyle modifications plus statin regimen recommended.",
        },
      ],
    },
    {
      id: "slot-past-3",
      date: "05 Aug 2025",
      time: "11:00 AM",
      formattedDate: "05 Aug 2025",
      category: "OPD",
      department: "Orthopedics & Joint Clinic",
      departmentHi: "हड्डी एवं जोड़ रोग विभाग",
      doctorName: "Dr. Suresh Kulkarni, MS",
      doctorRole: "Senior Orthopedic Surgeon",
      status: "Completed",
      visitType: "Routine Checkup",
      diagnosis: "Mild Lumbar Strain & Early Medial Knee Arthrosis",
      diagnosisHi: "कमर दर्द एवं जोड़ सूजन",
      chiefComplaints: "Lower back stiffness after sitting for long work hours and bilateral knee crepitus when standing up.",
      symptomsReported: ["lower_back_dull_ache", "bilateral_knee_crepitus", "early_morning_stiffness"],
      selectedOrgans: ["spine", "knee_joint"],
      painSeverity: 4,
      duration: "chronic",
      vitals: {
        bp: "122/80 mmHg",
        pulse: "74 bpm",
        spo2: "99%",
        temp: "98.6°F",
      },
      aiSummary: "AI Assessment: Mechanical musculoskeletal strain secondary to sedentary posture. Core strengthening physiotherapy and Calcium/Vitamin D3 supplementation suggested.",
      prescriptions: [
        {
          medicine: "Tab Aceclofenac + Paracetamol",
          dosage: "100/325 mg",
          frequency: "1 BD (Twice daily)",
          duration: "5 Days",
          instructions: "Take strictly after meals for inflammatory pain relief.",
        },
        {
          medicine: "Tab Calcium Citrate + Vit D3",
          dosage: "1000 mg",
          frequency: "1 OD",
          duration: "60 Days",
          instructions: "Bone mineral density maintenance.",
        },
      ],
      recommendedTests: [
        {
          testName: "Digital Radiography Lumbosacral Spine (AP & Lateral)",
          category: "Radiology",
          purpose: "L4-L5 disc space and facet joint alignment assessment",
          room: "X-Ray Room",
          urgency: "Completed",
        },
      ],
      doctorNotes: "Straight Leg Raise test negative bilaterally. Advised lumbar core exercises, ergonomic chair adjustment, and physiotherapist consult.",
      uploadedReports: [
        {
          id: "rep-05aug-1",
          name: "Digital_Radiography_Lumbosacral_Spine.jpg",
          size: "1.9 MB",
          date: "05 Aug 2025",
          type: "radiology",
          previewUrl: "/images/tanmay-report.jpg",
          clinicalImpression: "Early lumbar spondylotic changes without acute osseous injury or listhesis.",
        },
        {
          id: "rep-05aug-2",
          name: "Bilateral_Knee_Ultrasound_Evaluation.jpg",
          size: "1.1 MB",
          date: "05 Aug 2025",
          type: "radiology",
          previewUrl: "/images/aadit-report.jpg",
          clinicalImpression: "Early bilateral medial knee cartilage thinning. Minimal physiological suprapatellar effusion.",
        },
      ],
    },
  ];

  const selectedSlot = appointmentSlots.find((s) => s.id === selectedSlotId) || appointmentSlots[0];
  const activeReport = selectedSlot.uploadedReports[activePageIndex] || selectedSlot.uploadedReports[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col font-sans">
      <Navbar
        lang={lang}
        onLanguageChange={setLang}
        voiceGuide={false}
        onVoiceGuideToggle={() => {}}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 space-y-4">
        
        {/* ── Top Bar: Back to Board & Centered Title ── */}
        <div className="relative flex items-center justify-center p-3.5 sm:p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm min-h-[58px]">
          <Link
            href="/doctor"
            className="absolute left-3 sm:left-4 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95 shadow-sm cursor-pointer z-10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === "hi" ? "वापस कतार बोर्ड" : "Back to Live Queue"}</span>
            <span className="sm:hidden">{lang === "hi" ? "वापस" : "Back"}</span>
          </Link>

          <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white text-center px-12">
            <span>{lang === "hi" ? "मरीज के पिछले चिकित्सा रिकॉर्ड" : "Patient Medical Records & Consultations"}</span>
          </h1>
        </div>

        {/* ── Top Hero Section: Patient Demographics (Left) & Doctor Dealing / Visit Status (Right) on the SAME LINE ── */}
        {/* ── Top Hero: Patient Demographics & Doctor Dealing Side-by-Side ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* Left Side: Patient Demographics Card */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-slate-600 dark:text-slate-300" />
            </div>
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight capitalize truncate">
                {patientName}
              </h2>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
                {patientAge} Yrs • {patientGender}
              </span>
            </div>
          </div>

          {/* Right Side: Doctor Dealing & Visit Category (Same Line) */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
              selectedSlot.category === "Emergency"
                ? "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
                : "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
            }`}>
              {selectedSlot.category === "Emergency" ? (
                <ShieldAlert className="w-6 h-6" />
              ) : (
                <Stethoscope className="w-6 h-6" />
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight truncate">
                {selectedSlot.doctorName}
              </h3>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                selectedSlot.category === "Emergency"
                  ? "bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900"
                  : "bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900"
              }`}>
                <span>{selectedSlot.category === "Emergency" ? "🚨 Emergency" : "🩺 OPD"}</span>
                <span>• {selectedSlot.date === "Today" ? (lang === "hi" ? "आज" : "Today") : selectedSlot.date}</span>
              </span>
            </div>
          </div>

        </div>

        {/* ── Main Workspace: Left Slots Timeline & Right Consultation & Report Viewer ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
          
          {/* ── Left Column: Past Appointments (4 cols) ── */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-3.5 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                  {lang === "hi" ? "पिछली नियुक्तियां" : "Past Appointments"}
                </h3>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {appointmentSlots.length} {lang === "hi" ? "नियुक्तियां" : "Appointments"}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              {lang === "hi"
                ? "तारीख चुनकर उस दिन की ओपीडी/इमरजेंसी, डॉक्टर, एआई सारांश और दस्तावेज देखें।"
                : "Select a date to view OPD/Emergency status, attending doctor, AI summary, and uploaded documents."}
            </p>

            {/* List of Appointment Slots (Clean: Only Date & OPD/Emergency, with Today on top) */}
            <div className="space-y-2">
              {appointmentSlots.map((slot) => {
                const isSelected = slot.id === selectedSlotId;
                const isToday = slot.id === "slot-current" || slot.date === "Today";
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => handleSelectSlot(slot.id)}
                    className={`w-full text-left px-3.5 py-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isSelected
                        ? "border-blue-600 dark:border-cyan-400 bg-blue-50/90 dark:bg-blue-950/50 ring-2 ring-blue-500/20 shadow-sm"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/70 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    {/* Left: Calendar Icon + Date */}
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-slate-300 dark:group-hover:bg-slate-700"
                      }`}>
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-xs sm:text-sm font-black ${
                          isSelected ? "text-blue-950 dark:text-white" : "text-slate-800 dark:text-slate-200"
                        }`}>
                          {isToday ? (lang === "hi" ? "आज (Today)" : "Today") : slot.date}
                        </span>
                        {isToday && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold leading-none mt-0.5">
                            {lang === "hi" ? "वर्तमान सत्र" : "Current Session"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Only OPD or Emergency Badge */}
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm ${
                          slot.category === "Emergency"
                            ? "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                            : "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-cyan-300 border border-blue-300 dark:border-blue-800"
                        }`}
                      >
                        {slot.category === "Emergency"
                          ? (lang === "hi" ? "इमरजेंसी" : "Emergency")
                          : (lang === "hi" ? "ओपीडी" : "OPD")}
                      </span>
                      <ChevronRight className={`w-4 h-4 transition-transform ${
                        isSelected ? "text-blue-600 dark:text-cyan-400 translate-x-0.5" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                      }`} />
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

          {/* ── Right Column: Selected Slot Consultation & Uploaded Reports (8 cols) ── */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* 1. What Patient Filled in the OPD Form */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              
              {/* Header */}
              <div className="flex items-center space-x-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                  <ClipboardList className="w-4 h-4" />
                </div>
                <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                  {lang === "hi" 
                    ? "मरीज द्वारा ओपीडी फॉर्म में भरी गई जानकारी" 
                    : "Details Filled by Patient in OPD Form"}
                </h4>
              </div>

              {/* Patient-Reported Chief Complaint / Reason for Visit */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  {lang === "hi" ? "मुख्य समस्या / लक्षण (Chief Complaint):" : "Chief Complaint / Reason for Visit:"}
                </span>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                  &ldquo;{(() => {
                    const raw = selectedSlot.chiefComplaints || "";
                    if (raw.toLowerCase().includes("acute coronary") || raw.toLowerCase().includes("cardiac arrest")) {
                      return "Severe chest pain, heavy tightness and shortness of breath.";
                    }
                    return raw;
                  })()}&rdquo;
                </p>
              </div>

              {/* Form Intake Parameters: Pain Level, Duration, Affected Body Region */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                
                {/* Pain Severity */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {lang === "hi" ? "दर्द का स्तर (Pain Level)" : "Pain Severity"}
                  </span>
                  <span className="font-black text-base text-slate-900 dark:text-white capitalize block">
                    {lang === "hi"
                      ? ((selectedSlot.painSeverity || 6) >= 7 ? "तीव्र दर्द (Severe)" : (selectedSlot.painSeverity || 6) >= 4 ? "मध्यम दर्द (Moderate)" : "हल्का दर्द (Mild)")
                      : ((selectedSlot.painSeverity || 6) >= 7 ? "Severe" : (selectedSlot.painSeverity || 6) >= 4 ? "Moderate" : "Mild")}
                  </span>
                </div>

                {/* Duration */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {lang === "hi" ? "समस्या की अवधि (Duration)" : "Problem Duration"}
                  </span>
                  <span className="font-black text-base text-slate-900 dark:text-white capitalize block">
                    {selectedSlot.duration ? selectedSlot.duration.replace(/_/g, " ") : "Few Days"}
                  </span>
                </div>

                {/* Selected Body Region / Organ */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {lang === "hi" ? "प्रभावित अंग (Body Region)" : "Affected Body Region"}
                  </span>
                  <span className="font-black text-base text-slate-900 dark:text-white capitalize truncate block">
                    {selectedSlot.selectedOrgans && selectedSlot.selectedOrgans.length > 0
                      ? selectedSlot.selectedOrgans.map(o => o.replace(/_/g, " ")).join(", ")
                      : (selectedSlot.category === "Emergency" ? "Heart / Chest" : "General")}
                  </span>
                </div>

              </div>

              {/* Symptoms Selected by Patient in Form */}
              {selectedSlot.symptomsReported && selectedSlot.symptomsReported.length > 0 && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {lang === "hi" ? "फॉर्म में चुने गए लक्षण (Reported Symptoms):" : "Symptoms Selected by Patient in Form:"}
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedSlot.symptomsReported.map((sym, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 capitalize shadow-sm"
                      >
                        {sym.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* 4. Reports Uploaded by the Person in Page 1, Page 2 Format */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-emerald-500/40 shadow-sm space-y-3">
              
              {/* Header with Document Count */}
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center">
                    <Files className="w-4 h-4 text-emerald-700 dark:text-emerald-300" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                      {lang === "hi" 
                        ? "मरीज द्वारा अपलोड की गई रिपोर्ट" 
                        : "Reports Uploaded by the Person"}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Document Switcher Tabs (Page 1, Page 2...) */}
              {selectedSlot.uploadedReports.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {selectedSlot.uploadedReports.map((doc, idx) => (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => setActivePageIndex(idx)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                        activePageIndex === idx
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500/20"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      <Files className="w-3.5 h-3.5" />
                      <span>{lang === "hi" ? `पेज ${idx + 1}` : `Page ${idx + 1}`}</span>
                      {activePageIndex === idx && <CheckCircle2 className="w-3.5 h-3.5 ml-0.5" />}
                    </button>
                  ))}
                </div>
              )}

              {/* Active Document Visual Preview Frame (Clean Document Photo Image) */}
              {activeReport && (() => {
                const previewImg = activeReport.previewUrl || (activePageIndex % 2 === 0 ? "/images/tanmay-report.jpg" : "/images/aadit-report.jpg");
                return (
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2 relative overflow-hidden flex flex-col items-center justify-center">
                    
                    {/* Scanned Document Photo Image */}
                    <div 
                      onClick={() => handleOpenFullscreen({ ...activeReport, previewUrl: previewImg })}
                      className="relative w-full h-80 sm:h-96 md:h-[480px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900/5 dark:bg-black flex items-center justify-center cursor-zoom-in group shadow-inner"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewImg}
                        alt={activeReport.name}
                        className="w-full h-full object-contain group-hover:scale-[1.01] transition-transform duration-200"
                      />
                    </div>

                  </div>
                );
              })()}

            </div>

          </div>

        </div>

      </main>

      {/* ── Fullscreen High-Resolution Lightbox Modal with Zoom & Pan ── */}
      {fullscreenReport && (
        <div
          onClick={handleCloseFullscreen}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 max-w-4xl w-full h-[90vh] max-h-[90vh] flex flex-col overflow-hidden shadow-2xl text-slate-900 dark:text-white select-none"
          >
            
            {/* Header: Title, Zoom Controls Toolbar, Close Button */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 flex-shrink-0 gap-2">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <h3 className="font-extrabold text-base sm:text-lg truncate">{fullscreenReport.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {fullscreenReport.date} • {fullscreenReport.size} • Full Resolution Diagnostic View
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 flex-shrink-0">
                {/* Header Zoom Controls Toolbar */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 1}
                    className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="px-2 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 min-w-[46px] text-center select-none">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 3.5}
                    className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  {zoomLevel !== 1 && (
                    <button
                      type="button"
                      onClick={handleResetZoom}
                      className="p-1.5 ml-1 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 shadow-sm transition cursor-pointer"
                      title="Reset Zoom (Fit to Screen)"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleCloseFullscreen}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Image Viewport Container with Pan & Zoom */}
            <div 
              className={`flex-1 min-h-0 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950/5 dark:bg-black/50 relative overflow-hidden flex items-center justify-center p-2 sm:p-4 my-2 select-none ${
                zoomLevel > 1 
                  ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') 
                  : 'cursor-zoom-in'
              }`}
              onMouseDown={(e) => {
                if (zoomLevel > 1) {
                  e.preventDefault();
                  setIsDragging(true);
                  setHasMoved(false);
                  setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
                }
              }}
              onMouseMove={(e) => {
                if (isDragging && zoomLevel > 1) {
                  e.preventDefault();
                  setHasMoved(true);
                  setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
                }
              }}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onDoubleClick={() => {
                if (zoomLevel === 1) {
                  setZoomLevel(2);
                } else {
                  handleResetZoom();
                }
              }}
              onWheel={(e) => {
                if (e.ctrlKey || e.metaKey) {
                  e.preventDefault();
                  if (e.deltaY < 0) handleZoomIn();
                  else handleZoomOut();
                } else if (zoomLevel > 1) {
                  setPan((prev) => ({
                    x: prev.x - e.deltaX,
                    y: prev.y - e.deltaY,
                  }));
                }
              }}
              onClick={() => {
                if (!hasMoved && zoomLevel === 1) {
                  setZoomLevel(1.75);
                }
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fullscreenReport.previewUrl || "/images/tanmay-report.jpg"}
                alt={fullscreenReport.name}
                draggable={false}
                style={{
                  transform: zoomLevel > 1 ? `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})` : 'none',
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)',
                }}
                className="max-h-full max-w-full w-auto h-auto object-contain rounded-xl shadow-md pointer-events-none select-none"
              />

              {/* Floating Quick Zoom & Helper Pill */}
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/85 dark:bg-slate-800/90 backdrop-blur-md text-white border border-white/15 rounded-full px-3 py-1 flex items-center space-x-2 shadow-2xl z-10 select-none text-xs pointer-events-auto"
              >
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 1}
                  className="p-1 rounded-full hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="font-mono font-bold px-1.5 py-0.5 hover:bg-white/20 rounded transition cursor-pointer"
                  title="Click to reset zoom"
                >
                  {Math.round(zoomLevel * 100)}%
                </button>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 3.5}
                  className="p-1 rounded-full hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                {zoomLevel !== 1 && (
                  <>
                    <div className="h-3 w-[1px] bg-white/20" />
                    <button
                      type="button"
                      onClick={handleResetZoom}
                      className="p-1 rounded-full hover:bg-white/20 transition cursor-pointer text-[11px] flex items-center gap-1 font-medium"
                      title="Fit to Window"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Row: Helper Hint & Close Button */}
            <div className="flex items-center justify-between pt-1 flex-shrink-0">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium hidden sm:inline-block">
                {zoomLevel > 1 
                  ? "💡 Drag with mouse to pan • Double-click or click Reset to fit" 
                  : "💡 Click image or use controls to zoom in • Double-click to toggle"}
              </span>
              <button
                type="button"
                onClick={handleCloseFullscreen}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs shadow transition-all active:scale-95 cursor-pointer ml-auto"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
