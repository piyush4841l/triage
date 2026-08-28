import { BodyRegionId, BODY_REGIONS } from "./anatomy-data";

export type PriorityTier = "RED" | "YELLOW" | "GREEN";

export interface TriageInput {
  patientName: string;
  age: number;
  gender: string;
  phone: string;
  abhaId?: string;
  selectedRegions: BodyRegionId[];
  selectedOrgans: string[];
  selectedSymptoms: string[];
  isDontKnow: boolean;
  painSeverity: number; // 1 to 10
  duration: "today" | "few_days" | "more_than_week" | "chronic";
  isEmergencyOverride?: boolean;
  emergencyConditionType?: "cardiac" | "breathing" | "accident" | "fever_trauma";
  ocrExtractedNotes?: string;
}

export interface TriageResult {
  tokenId: string;
  tokenNumber: string;
  priorityTier: PriorityTier;
  acuityScoreText: string;
  department: string;
  departmentHi: string;
  roomNumber: string;
  counterNumber: string;
  estimatedWaitMinutes: number;
  queuePosition: number;
  chiefComplaintSummaryEn: string;
  chiefComplaintSummaryHi: string;
  triageRationaleEn: string;
  triageRationaleHi: string;
  suggestedFirstChecks: string[];
  assignedDoctorName: string;
}

const DEPARTMENT_ROOMS: Record<string, { room: string; counter: string; doctorEn: string; doctorHi: string; baseWait: number }> = {
  "Emergency & Trauma": { room: "Room 01 (Trauma Bay)", counter: "Counter ER-01", doctorEn: "Dr. Vikram Singh (Chief Trauma Officer)", doctorHi: "डॉ. विक्रम सिंह (मुख्य आपातकालीन अधिकारी)", baseWait: 0 },
  "Cardiology": { room: "Room 102 (Cardio OPD)", counter: "Counter 02", doctorEn: "Dr. Ananya Sharma (Cardiologist)", doctorHi: "डॉ. अनन्या शर्मा (हृदय रोग विशेषज्ञ)", baseWait: 15 },
  "Pulmonology": { room: "Room 104 (Chest & Respiratory)", counter: "Counter 04", doctorEn: "Dr. Arvind Mehta (Pulmonologist)", doctorHi: "डॉ. अरविंद मेहता (श्वसन रोग विशेषज्ञ)", baseWait: 10 },
  "Gastroenterology": { room: "Room 106 (Gastro & Liver)", counter: "Counter 06", doctorEn: "Dr. Priya Deshmukh (Gastroenterologist)", doctorHi: "डॉ. प्रिया देशमुख (पेट व यकृत रोग विशेषज्ञ)", baseWait: 12 },
  "Neurology": { room: "Room 108 (Neuro OPD)", counter: "Counter 08", doctorEn: "Dr. Rajesh Iyer (Neurologist)", doctorHi: "डॉ. राजेश अय्यर (मस्तिष्क रोग विशेषज्ञ)", baseWait: 20 },
  "Orthopedics": { room: "Room 110 (Bone & Joint Clinic)", counter: "Counter 10", doctorEn: "Dr. Suresh Patel (Orthopedic Surgeon)", doctorHi: "डॉ. सुरेश पटेल (अस्थि रोग विशेषज्ञ)", baseWait: 15 },
  "ENT": { room: "Room 112 (Ear, Nose & Throat)", counter: "Counter 12", doctorEn: "Dr. Neha Verma (ENT Specialist)", doctorHi: "डॉ. नेहा वर्मा (ईएनटी विशेषज्ञ)", baseWait: 8 },
  "Urology": { room: "Room 114 (Uro & Renal Clinic)", counter: "Counter 14", doctorEn: "Dr. Alok Gupta (Urologist)", doctorHi: "डॉ. आलोक गुप्ता (मूत्र रोग विशेषज्ञ)", baseWait: 14 },
  "Dermatology": { room: "Room 116 (Skin Clinic)", counter: "Counter 16", doctorEn: "Dr. Kavita Nair (Dermatologist)", doctorHi: "डॉ. कविता नायर (त्वचा रोग विशेषज्ञ)", baseWait: 10 },
  "General Medicine": { room: "Room 101 (Primary Care OPD)", counter: "Counter 01", doctorEn: "Dr. Sunita Rao (Senior Physician)", doctorHi: "डॉ. सुनीता राव (वरिष्ठ चिकित्सक)", baseWait: 10 },
  "General Surgery": { room: "Room 118 (Surgical OPD)", counter: "Counter 18", doctorEn: "Dr. Harish Chandra (General Surgeon)", doctorHi: "डॉ. हरीश चंद्र (शल्य चिकित्सक)", baseWait: 15 },
  "Ophthalmology": { room: "Room 120 (Eye OPD)", counter: "Counter 20", doctorEn: "Dr. Madhavan Pillai (Eye Specialist)", doctorHi: "डॉ. माधवन पिल्लई (नेत्र रोग विशेषज्ञ)", baseWait: 10 },
};

export function computeTriage(input: TriageInput, currentDepartmentQueueCounts: Record<string, number> = {}): TriageResult {
  const tokenRandomSuffix = Math.floor(100 + Math.random() * 900);
  const now = new Date();

  // 1. Emergency Fast-Track Protocol
  if (input.isEmergencyOverride) {
    let conditionTextEn = "Critical Acute Emergency";
    let conditionTextHi = "अति गंभीर आपातकालीन स्थिति";
    let checks = ["Immediate ECG (12-Lead)", "Continuous SpO2 & BP Monitoring", "IV Cannula Access"];

    if (input.emergencyConditionType === "cardiac") {
      conditionTextEn = "Suspected Acute Coronary Syndrome / Cardiac Arrest Risk";
      conditionTextHi = "तीव्र हृदय रोग / दिल का दौरा आशंका";
      checks = ["Stat 12-Lead ECG", "Troponin-I Blood Test", "Aspirin & Nitrate protocol", "Defibrillator Standby"];
    } else if (input.emergencyConditionType === "breathing") {
      conditionTextEn = "Severe Acute Respiratory Distress / Hypoxia Risk";
      conditionTextHi = "गंभीर श्वास अवरोध / ऑक्सीजन की तीव्र कमी";
      checks = ["High-Flow Oxygen Nebulization", "Portable Chest X-Ray", "Arterial Blood Gas (ABG)", "Airway Management"];
    } else if (input.emergencyConditionType === "accident") {
      conditionTextEn = "Severe Road Accident / Polytrauma / Active Hemorrhage";
      conditionTextHi = "सड़क दुर्घटना / गंभीर चोट / अत्यधिक रक्तस्राव";
      checks = ["C-Spine Collar Immobilization", "Tourniquet & Pressure Bandaging", "FAST Ultrasound Scan", "Immediate Blood Cross-Match & IV Fluids"];
    } else if (input.emergencyConditionType === "fever_trauma") {
      conditionTextEn = "Hyperpyrexia (>104°F) / Major Trauma / Shock State";
      conditionTextHi = "अत्यधिक तेज बुखार / गंभीर चोट व रक्तस्राव";
      checks = ["Vital Signs Stabilization", "Active Cooling / Wound Pressure Dressing", "IV Fluids Resuscitation"];
    }

    const deptInfo = DEPARTMENT_ROOMS["Emergency & Trauma"];

    return {
      tokenId: `TOKEN-ER-${tokenRandomSuffix}`,
      tokenNumber: `ER-${tokenRandomSuffix}`,
      priorityTier: "RED",
      acuityScoreText: "Level 1: Resuscitation (Emergency Priority)",
      department: "Emergency & Trauma",
      departmentHi: "आपातकालीन एवं ट्रॉमा विभाग",
      roomNumber: deptInfo.room,
      counterNumber: deptInfo.counter,
      estimatedWaitMinutes: 0,
      queuePosition: 1,
      chiefComplaintSummaryEn: conditionTextEn,
      chiefComplaintSummaryHi: conditionTextHi,
      triageRationaleEn: "Direct emergency bypass protocol triggered. Zero queue wait time.",
      triageRationaleHi: "सीधा आपातकालीन बायपास प्रोटोकॉल। कतार में शून्य प्रतीक्षा।",
      suggestedFirstChecks: checks,
      assignedDoctorName: deptInfo.doctorEn,
    };
  }

  // 2. Department scoring based on selected symptoms and organs
  const departmentScores: Record<string, number> = {
    "Cardiology": 0,
    "Pulmonology": 0,
    "Gastroenterology": 0,
    "Neurology": 0,
    "Orthopedics": 0,
    "ENT": 0,
    "Urology": 0,
    "Dermatology": 0,
    "General Medicine": 1, // baseline fallback
    "General Surgery": 0,
    "Ophthalmology": 0,
  };

  let hasEmergencyFlag = false;
  const symptomNamesEn: string[] = [];
  const symptomNamesHi: string[] = [];

  // Inspect selected symptoms across regions
  input.selectedRegions.forEach((regId) => {
    const regionData = BODY_REGIONS[regId];
    if (!regionData) return;

    regionData.commonSymptoms.forEach((s) => {
      if (input.selectedSymptoms.includes(s.id)) {
        symptomNamesEn.push(s.nameEn);
        symptomNamesHi.push(s.nameHi);
        if (s.isEmergencyIndicator) {
          hasEmergencyFlag = true;
        }
        if (departmentScores[s.departmentAffinity] !== undefined) {
          departmentScores[s.departmentAffinity] += 3;
        }
      }
    });

    // Region based baseline score
    if (regId === "chest") {
      departmentScores["Cardiology"] += 1;
      departmentScores["Pulmonology"] += 1;
    } else if (regId === "abdomen") {
      departmentScores["Gastroenterology"] += 2;
    } else if (regId === "head_neck") {
      departmentScores["Neurology"] += 1;
      departmentScores["ENT"] += 1;
    } else if (regId === "spine_back" || regId === "arms" || regId === "legs_joints") {
      departmentScores["Orthopedics"] += 2;
    } else if (regId === "pelvis") {
      departmentScores["Urology"] += 2;
    } else if (regId === "skin_general") {
      departmentScores["Dermatology"] += 2;
    }
  });

  // Pick top department
  let topDepartment = "General Medicine";
  let maxScore = 0;
  for (const [dept, score] of Object.entries(departmentScores)) {
    if (score > maxScore) {
      maxScore = score;
      topDepartment = dept;
    }
  }

  // Determine Acuity Tier (Red, Yellow, Green)
  let priorityTier: PriorityTier = "GREEN";
  let acuityScoreText = "Level 3: Standard Care (Green)";

  if (hasEmergencyFlag || input.painSeverity >= 9) {
    priorityTier = "RED";
    acuityScoreText = "Level 1: Emergent / Critical Care (Red)";
  } else if (input.painSeverity >= 6 || input.duration === "today") {
    priorityTier = "YELLOW";
    acuityScoreText = "Level 2: Urgent Care (Yellow)";
  }

  const deptInfo = DEPARTMENT_ROOMS[topDepartment] || DEPARTMENT_ROOMS["General Medicine"];
  const currentDeptQueue = currentDepartmentQueueCounts[topDepartment] || Math.floor(Math.random() * 4) + 1;

  let estimatedWait = deptInfo.baseWait + currentDeptQueue * 4;
  if (priorityTier === "RED") estimatedWait = Math.min(estimatedWait, 2);
  else if (priorityTier === "YELLOW") estimatedWait = Math.max(5, Math.floor(estimatedWait * 0.5));

  const prefix = priorityTier === "RED" ? "ER" : topDepartment.slice(0, 3).toUpperCase();
  const tokenNumber = `${prefix}-${tokenRandomSuffix}`;

  const deptTranslations: Record<string, string> = {
    "Cardiology": "हृदय रोग विभाग (Cardiology)",
    "Pulmonology": "श्वसन व फेफड़ा रोग विभाग (Pulmonology)",
    "Gastroenterology": "पेट व पाचन रोग विभाग (Gastroenterology)",
    "Neurology": "मस्तिष्क व तंत्रिका रोग विभाग (Neurology)",
    "Orthopedics": "हड्डी व जोड़ रोग विभाग (Orthopedics)",
    "ENT": "कान, नाक व गला विभाग (ENT)",
    "Urology": "मूत्र रोग विभाग (Urology)",
    "Dermatology": "त्वचा रोग विभाग (Dermatology)",
    "General Medicine": "सामान्य चिकित्सा विभाग (General Medicine)",
    "General Surgery": "सामान्य शल्य चिकित्सा विभाग (Surgery)",
    "Ophthalmology": "नेत्र रोग विभाग (Ophthalmology)",
    "Emergency & Trauma": "आपातकालीन एवं ट्रॉमा विभाग",
  };

  const chiefComplaintEn = input.isDontKnow
    ? "General Body Discomfort (Patient unsure of specific organ)"
    : symptomNamesEn.length > 0
    ? symptomNamesEn.join(", ")
    : `Pain in ${input.selectedRegions.map(r => BODY_REGIONS[r]?.nameEn).join(", ")}`;

  const chiefComplaintHi = input.isDontKnow
    ? "सामान्य शारीरिक अस्वस्थता (अंग के प्रति अनिश्चित)"
    : symptomNamesHi.length > 0
    ? symptomNamesHi.join(", ")
    : `${input.selectedRegions.map(r => BODY_REGIONS[r]?.nameHi).join(", ")} में दर्द`;

  const suggestedChecks = [
    "Blood Pressure & Pulse Check",
    "Temperature & Blood Oxygen (SpO2)",
    topDepartment === "Cardiology" ? "12-Lead Baseline ECG" : topDepartment === "Pulmonology" ? "Peak Flow & Chest Auscultation" : "Basic Clinical Palpation",
  ];

  return {
    tokenId: `TOKEN-${tokenNumber}`,
    tokenNumber,
    priorityTier,
    acuityScoreText,
    department: topDepartment,
    departmentHi: deptTranslations[topDepartment] || topDepartment,
    roomNumber: deptInfo.room,
    counterNumber: deptInfo.counter,
    estimatedWaitMinutes: estimatedWait,
    queuePosition: currentDeptQueue + 1,
    chiefComplaintSummaryEn: chiefComplaintEn,
    chiefComplaintSummaryHi: chiefComplaintHi,
    triageRationaleEn: `Assigned to ${topDepartment} based on ${symptomNamesEn.length} specific symptom tags and pain severity ${input.painSeverity}/10.`,
    triageRationaleHi: `${symptomNamesHi.length} दर्ज लक्षणों और दर्द की तीव्रता (${input.painSeverity}/10) के आधार पर ${deptTranslations[topDepartment] || topDepartment} आवंटित।`,
    suggestedFirstChecks: suggestedChecks,
    assignedDoctorName: deptInfo.doctorEn,
  };
}
