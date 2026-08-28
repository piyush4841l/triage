import { TriageResult, TriageInput } from "./triage";

export type QueueStatus = "WAITING" | "CALLED" | "IN_CONSULTATION" | "COMPLETED" | "TRANSFERRED";

export interface StoredToken {
  id: string;
  result: TriageResult;
  input: TriageInput;
  status: QueueStatus;
  createdAt: string;
  calledAt?: string;
  completedAt?: string;
  ocrDetails?: {
    diagnoses: string[];
    medications: string[];
    allergies: string[];
    rawText: string;
  };
}

const STORAGE_KEY = "sih_opd_tokens_queue_v1";

export const INITIAL_PRELOADED_TOKENS: StoredToken[] = [
  {
    id: "TOKEN-ER-102",
    result: {
      tokenId: "TOKEN-ER-102",
      tokenNumber: "ER-102",
      priorityTier: "RED",
      acuityScoreText: "Level 1: Resuscitation (Emergency Priority)",
      department: "Emergency & Trauma",
      departmentHi: "आपातकालीन एवं ट्रॉमा विभाग",
      roomNumber: "Room 01 (Trauma Bay)",
      counterNumber: "Counter ER-01",
      estimatedWaitMinutes: 0,
      queuePosition: 1,
      chiefComplaintSummaryEn: "Severe Crushing Chest Pain radiating to Left Shoulder & Shortness of Breath",
      chiefComplaintSummaryHi: "सीने में तीव्र दबाव व बाएं कंधे में दर्द, सांस लेने में भारी तकलीफ",
      triageRationaleEn: "Acute cardiac distress protocol triggered. Direct trauma bay entry.",
      triageRationaleHi: "तीव्र हृदय रोग प्रोटोकॉल। सीधा ट्रॉमा बे प्रवेश।",
      suggestedFirstChecks: ["Stat 12-Lead ECG", "Troponin-I Test", "Oxygen Support"],
      assignedDoctorName: "Dr. Vikram Singh (Chief Trauma Officer)",
    },
    input: {
      patientName: "Gopal Prasad Sharma",
      age: 58,
      gender: "Male",
      phone: "9876501234",
      abhaId: "91-4521-8890-1234",
      selectedRegions: ["chest"],
      selectedOrgans: ["heart", "lungs"],
      selectedSymptoms: ["chest_pressure_severe", "breathlessness"],
      isDontKnow: false,
      painSeverity: 10,
      duration: "today",
      isEmergencyOverride: true,
      emergencyConditionType: "cardiac",
    },
    status: "CALLED",
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    calledAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
  },
  {
    id: "TOKEN-CAR-304",
    result: {
      tokenId: "TOKEN-CAR-304",
      tokenNumber: "CAR-304",
      priorityTier: "YELLOW",
      acuityScoreText: "Level 2: Urgent Care (Yellow)",
      department: "Cardiology",
      departmentHi: "हृदय रोग विभाग (Cardiology)",
      roomNumber: "Room 102 (Cardio OPD)",
      counterNumber: "Counter 02",
      estimatedWaitMinutes: 8,
      queuePosition: 2,
      chiefComplaintSummaryEn: "Rapid Palpitations & Burning sensation in Chest",
      chiefComplaintSummaryHi: "तेज धड़कन व सीने में जलन",
      triageRationaleEn: "Cardio-gastric symptom clustering. High urgency due to tachycardia.",
      triageRationaleHi: "हृदय गति में अनियमितता के कारण त्वरित जांच आवश्यक।",
      suggestedFirstChecks: ["Baseline ECG", "BP & Pulse Monitoring"],
      assignedDoctorName: "Dr. Ananya Sharma (Cardiologist)",
    },
    input: {
      patientName: "Meenakshi Sundaram",
      age: 42,
      gender: "Female",
      phone: "9823415678",
      selectedRegions: ["chest", "abdomen"],
      selectedOrgans: ["heart", "upper_stomach"],
      selectedSymptoms: ["palpitations", "burning_chest"],
      isDontKnow: false,
      painSeverity: 7,
      duration: "few_days",
    },
    status: "WAITING",
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
  {
    id: "TOKEN-GAS-512",
    result: {
      tokenId: "TOKEN-GAS-512",
      tokenNumber: "GAS-512",
      priorityTier: "GREEN",
      acuityScoreText: "Level 3: Standard Care (Green)",
      department: "Gastroenterology",
      departmentHi: "पेट व पाचन रोग विभाग (Gastroenterology)",
      roomNumber: "Room 106 (Gastro & Liver)",
      counterNumber: "Counter 06",
      estimatedWaitMinutes: 16,
      queuePosition: 3,
      chiefComplaintSummaryEn: "Severe Acidity, Nausea & Upper Stomach Cramps",
      chiefComplaintSummaryHi: "अत्यधिक एसिडिटी, उल्टी व पेट में मरोड़",
      triageRationaleEn: "Upper gastric tract irritation, normal vitals.",
      triageRationaleHi: "ऊपरी आमाशय में गैस व जलन की समस्या।",
      suggestedFirstChecks: ["Abdominal Palpation", "Antacid Assessment"],
      assignedDoctorName: "Dr. Priya Deshmukh (Gastroenterologist)",
    },
    input: {
      patientName: "Sunita Devi",
      age: 36,
      gender: "Female",
      phone: "9123456780",
      selectedRegions: ["abdomen"],
      selectedOrgans: ["upper_stomach"],
      selectedSymptoms: ["severe_acidity_vomiting", "sharp_stomach_cramps"],
      isDontKnow: false,
      painSeverity: 5,
      duration: "few_days",
    },
    status: "WAITING",
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
  {
    id: "TOKEN-ORT-720",
    result: {
      tokenId: "TOKEN-ORT-720",
      tokenNumber: "ORT-720",
      priorityTier: "GREEN",
      acuityScoreText: "Level 3: Standard Care (Green)",
      department: "Orthopedics",
      departmentHi: "हड्डी व जोड़ रोग विभाग (Orthopedics)",
      roomNumber: "Room 110 (Bone & Joint Clinic)",
      counterNumber: "Counter 10",
      estimatedWaitMinutes: 22,
      queuePosition: 4,
      chiefComplaintSummaryEn: "Severe Knee Pain, Swelling & Difficulty Walking",
      chiefComplaintSummaryHi: "घुटनों में तेज दर्द, सूजन व चलने में परेशानी",
      triageRationaleEn: "Subacute bilateral knee osteoarthritis flare-up.",
      triageRationaleHi: "घुटनों के पुराने दर्द का प्रभाव।",
      suggestedFirstChecks: ["Bilateral Knee X-Ray AP/Lat", "Joint Mobility Exam"],
      assignedDoctorName: "Dr. Suresh Patel (Orthopedic Surgeon)",
    },
    input: {
      patientName: "Ramswaroop Yadav",
      age: 64,
      gender: "Male",
      phone: "9765432109",
      selectedRegions: ["legs_joints"],
      selectedOrgans: ["knee_joints"],
      selectedSymptoms: ["knee_osteoarthritis"],
      isDontKnow: false,
      painSeverity: 6,
      duration: "chronic",
    },
    status: "WAITING",
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  },
];

export function getStoredTokens(): StoredToken[] {
  if (typeof window === "undefined") return INITIAL_PRELOADED_TOKENS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRELOADED_TOKENS));
      return INITIAL_PRELOADED_TOKENS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_PRELOADED_TOKENS;
  }
}

export function saveStoredTokens(tokens: StoredToken[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
    window.dispatchEvent(new Event("opd_queue_updated"));
  } catch (e) {
    console.error("Failed to save tokens:", e);
  }
}

export function addToken(token: StoredToken): StoredToken[] {
  const existing = getStoredTokens();
  // Insert emergencies at top, others appended
  const updated = token.result.priorityTier === "RED" ? [token, ...existing] : [...existing, token];
  saveStoredTokens(updated);
  return updated;
}

export function updateTokenStatus(tokenId: string, newStatus: QueueStatus): StoredToken[] {
  const existing = getStoredTokens();
  const updated = existing.map((t) => {
    if (t.id === tokenId || t.result.tokenId === tokenId) {
      const copy = { ...t, status: newStatus };
      if (newStatus === "CALLED") copy.calledAt = new Date().toISOString();
      if (newStatus === "COMPLETED") copy.completedAt = new Date().toISOString();
      return copy;
    }
    return t;
  });
  saveStoredTokens(updated);
  return updated;
}

export function getTokenById(tokenId: string): StoredToken | undefined {
  const tokens = getStoredTokens();
  return tokens.find((t) => t.id === tokenId || t.result.tokenId === tokenId || t.result.tokenNumber === tokenId);
}
