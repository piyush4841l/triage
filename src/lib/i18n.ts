export type Language = 
  | "en" 
  | "as"  // Assamese (অসমীয়া)
  | "bn"  // Bengali (বাংলা)
  | "brx" // Bodo (बड़ो)
  | "doi" // Dogri (डोगरी)
  | "gu"  // Gujarati (ગુજરાતી)
  | "hi"  // Hindi (हिंदी)
  | "kn"  // Kannada (ಕನ್ನಡ)
  | "ks"  // Kashmiri (कॉशुर / كٲشُر)
  | "kok" // Konkani (कोंकणी)
  | "mai" // Maithili (मैथिली)
  | "ml"  // Malayalam (മലയാളം)
  | "mni" // Manipuri (Meitei) (মৈতৈলোন্)
  | "mr"  // Marathi (मराठी)
  | "ne"  // Nepali (नेपाली)
  | "or"  // Odia (ଓଡ଼ିଆ)
  | "pa"  // Punjabi (ਪੰਜਾਬੀ)
  | "sa"  // Sanskrit (संस्कृतम्)
  | "sat" // Santali (ᱥᱟᱱᱛᱟᱲᱤ / संताली)
  | "sd"  // Sindhi (سنڌي / सिन्धी)
  | "ta"  // Tamil (தமிழ்)
  | "te"  // Telugu (తెలుగు)
  | "ur"; // Urdu (اردو)

export interface TranslationDictionary {
  // App Header & Navigation
  appTitle: string;
  appSubtitle: string;
  eventBadge: string;
  emergencyFastTrack: string;
  voiceGuide: string;
  voiceGuideActive: string;
  highContrast: string;
  doctorDashboard: string;
  liveDisplay: string;
  kioskHome: string;
  inactivityNotice: string;
  inactivityResetIn: string;
  continueSession: string;
  selectState: string;
  selectLanguage: string;
  
  // Registration Step
  step1Title: string;
  step1Subtitle: string;
  fullName: string;
  fullNamePlaceholder: string;
  age: string;
  agePlaceholder: string;
  gender: string;
  male: string;
  female: string;
  other: string;
  phone: string;
  phonePlaceholder: string;
  abhaId: string;
  abhaIdPlaceholder: string;
  optionalTag: string;
  voiceInputTooltip: string;
  listeningVoice: string;
  quickFillDemo: string;
  demoPatientChest: string;
  demoPatientStomach: string;
  nextStep: string;
  back: string;
  pleaseEnterPhone: string;
  pleaseEnterName: string;
  pleaseEnterAge: string;
  pleaseEnterAbha: string;
  abhaPassword: string;
  abhaPasswordPlaceholder: string;
  pleaseEnterAbhaPassword: string;

  // Anatomy Body Map Step
  step2Title: string;
  step2Subtitle: string;
  frontView: string;
  backView: string;
  selectedZones: string;
  clearSelection: string;
  tapToSelectRegion: string;
  zonesSelectedCount: string;
  continueToSymptoms: string;
  selectAtLeastOneZone: string;

  // Body Regions
  regionHeadNeck: string;
  regionChest: string;
  regionAbdomen: string;
  regionSpineBack: string;
  regionArms: string;
  regionPelvis: string;
  regionLegsJoints: string;
  regionSkinGeneral: string;

  // Symptom Modal & Details
  drillDownTitle: string;
  drillDownSubtitle: string;
  selectOrgans: string;
  selectSymptoms: string;
  dontKnowOption: string;
  dontKnowDesc: string;
  painSeverity: string;
  mild: string;
  moderate: string;
  severe: string;
  duration: string;
  today: string;
  fewDays: string;
  moreThanWeek: string;
  chronic: string;
  saveSymptoms: string;

  // OCR Document Upload Step
  step3Title: string;
  step3Subtitle: string;
  dragDropText: string;
  orBrowseFile: string;
  uploadPrescriptionPdf: string;
  skipStep: string;
  proceedToToken: string;
  analyzingDocument: string;
  ocrSuccess: string;
  extractedDiagnoses: string;
  extractedMedicines: string;
  extractedAllergies: string;
  useSamplePrescription: string;
  useSampleBloodReport: string;

  // Token Generation
  tokenGeneratedTitle: string;
  tokenGeneratedSubtitle: string;
  tokenNumber: string;
  department: string;
  roomCounter: string;
  estimatedWait: string;
  minutes: string;
  priorityLevel: string;
  priorityEmergency: string;
  priorityUrgent: string;
  priorityStandard: string;
  patientName: string;
  patientAge: string;
  maskedPhone: string;
  maskedAbha: string;
  symptomsSummary: string;
  printThermalSlip: string;
  sendWhatsApp: string;
  trackLiveQueue: string;
  createNewToken: string;

  // Emergency Fast-Track Modal
  emergencyModalTitle: string;
  emergencyModalSubtitle: string;
  criticalConditions: string;
  conditionCardiac: string;
  conditionCardiacDesc: string;
  conditionBreathing: string;
  conditionBreathingDesc: string;
  conditionAccident: string;
  conditionAccidentDesc: string;
  conditionFeverTrauma: string;
  conditionFeverTraumaDesc: string;
  emergencyPhonePrompt: string;
  generateEmergencyToken: string;
  emergencyWarning: string;

  // WhatsApp Simulation
  whatsAppTitle: string;
  whatsAppSentTitle: string;
  whatsAppSentDesc: string;
  whatsAppMessagePreview: string;
  openRealWhatsApp: string;
  close: string;

  // Live Queue & Doctor Dashboard
  liveQueueTitle: string;
  queueOverview: string;
  allDepartments: string;
  waitingPatients: string;
  inConsultation: string;
  completedToday: string;
  avgWaitTime: string;
  callNextPatient: string;
  callingAudio: string;
  startConsultation: string;
  markCompleted: string;
  viewOcrRecords: string;
  noPatientsInQueue: string;
  triagePriority: string;
  chiefComplaints: string;
  assignedDoctor: string;
}

// -------------------------------------------------------------
// English (Default)
// -------------------------------------------------------------
const baseEnglish: TranslationDictionary = {
  appTitle: "Smart Visual OPD Triage & Token Kiosk",
  appSubtitle: "AI-Powered Multilingual Patient Self-Registration & Queue Management",
  eventBadge: "Hospital OPD Queue Kiosk",
  emergencyFastTrack: "🚨 Emergency Fast-Track",
  voiceGuide: "Voice Guide",
  voiceGuideActive: "Voice Guide (Active)",
  highContrast: "High Contrast",
  doctorDashboard: "Doctor / Staff Portal",
  liveDisplay: "Live Queue Display",
  kioskHome: "Kiosk Home",
  inactivityNotice: "Are you still there?",
  inactivityResetIn: "Screen will reset in",
  continueSession: "I'm still here (Continue)",
  selectState: "Select State",
  selectLanguage: "Language",

  step1Title: "Patient Registration & Identification",
  step1Subtitle: "Speak or enter your details. Use the microphone icon to dictate.",
  fullName: "Full Name",
  fullNamePlaceholder: "e.g. Ramesh Kumar",
  age: "Age (Years)",
  agePlaceholder: "e.g. 45",
  gender: "Gender",
  male: "Male",
  female: "Female",
  other: "Other",
  phone: "10-Digit Mobile Number",
  phonePlaceholder: "e.g. 9876543210",
  abhaId: "ABHA Health ID / Aadhaar",
  abhaIdPlaceholder: "e.g. 14-digit ABHA ID or Aadhaar",
  optionalTag: "Optional",
  voiceInputTooltip: "Click to speak into microphone",
  listeningVoice: "Listening... speak now",
  quickFillDemo: "Quick Fill Demo Profiles",
  demoPatientChest: "Ramesh (Chest Distress)",
  demoPatientStomach: "Sunita (Severe Acidity)",
  nextStep: "Next: Select Body Pain Zones",
  back: "Back",
  pleaseEnterPhone: "Please enter a valid 10-digit mobile number",
  pleaseEnterName: "Please enter patient name",
  pleaseEnterAge: "Please enter a valid age",
  pleaseEnterAbha: "Please enter valid 14-digit ABHA ID or Aadhaar",
  abhaPassword: "ABHA Password / PIN",
  abhaPasswordPlaceholder: "Enter ABHA Password / PIN",
  pleaseEnterAbhaPassword: "Enter ABHA PIN / Password",

  step2Title: "Select Pain & Symptoms",
  step2Subtitle: "Touch or click the affected body parts on the model or select from the list.",
  frontView: "Front View",
  backView: "Back / Spine View",
  selectedZones: "Selected Zones",
  clearSelection: "Clear All",
  tapToSelectRegion: "Tap any body region to select pain areas",
  zonesSelectedCount: "zones selected",
  continueToSymptoms: "Continue to Symptom Details",
  selectAtLeastOneZone: "Please tap at least one body part or use Emergency Fast-Track",

  regionHeadNeck: "Head & Neck",
  regionChest: "Chest & Ribs",
  regionAbdomen: "Abdomen & Stomach",
  regionSpineBack: "Spine & Back",
  regionArms: "Arms & Shoulders",
  regionPelvis: "Pelvis & Groin",
  regionLegsJoints: "Legs, Knees & Feet",
  regionSkinGeneral: "Skin / General Body",

  drillDownTitle: "Specify Symptoms & Discomfort",
  drillDownSubtitle: "Select organs or everyday symptoms for the highlighted area",
  selectOrgans: "Affected Organs / Sub-areas",
  selectSymptoms: "Common Everyday Symptoms",
  dontKnowOption: "I Don't Know / Not Sure",
  dontKnowDesc: "Triage doctor will perform a general physical examination",
  painSeverity: "Pain / Discomfort Level",
  mild: "Mild (1-3)",
  moderate: "Moderate (4-7)",
  severe: "Severe (8-10)",
  duration: "How long have you had this?",
  today: "Since Today",
  fewDays: "2 - 3 Days",
  moreThanWeek: "Over 1 Week",
  chronic: "Long Term / Chronic",
  saveSymptoms: "Confirm Symptom Details",

  step3Title: "Upload Past Medical Records (Optional)",
  step3Subtitle: "Upload previous doctor prescriptions or lab reports for AI OCR extraction. You can skip this step.",
  dragDropText: "Upload Documents",
  orBrowseFile: "Browse from device or take photo",
  uploadPrescriptionPdf: "Supports JPG, PNG, PDF up to 10MB",
  skipStep: "Skip & Generate Token Now",
  proceedToToken: "Proceed with Uploaded Records",
  analyzingDocument: "Extracting clinical findings with Medical OCR...",
  ocrSuccess: "OCR Extraction Complete",
  extractedDiagnoses: "Detected Conditions / Past Diagnoses",
  extractedMedicines: "Past / Current Medications",
  extractedAllergies: "Reported Allergies / Notes",
  useSamplePrescription: "Load Sample Prescription (Cardiology)",
  useSampleBloodReport: "Load Sample Gastro Report",

  tokenGeneratedTitle: "OPD Token Issued Successfully!",
  tokenGeneratedSubtitle: "Your digital token has been registered in the hospital live queue system.",
  tokenNumber: "Token Number",
  department: "Assigned Department",
  roomCounter: "OPD Room & Counter",
  estimatedWait: "Estimated Wait Time",
  minutes: "mins",
  priorityLevel: "Triage Priority Level",
  priorityEmergency: "RED (Emergency Priority)",
  priorityUrgent: "YELLOW (Urgent Care)",
  priorityStandard: "GREEN (Standard Queue)",
  patientName: "Patient Name",
  patientAge: "Age / Gender",
  maskedPhone: "Mobile (SMS/WhatsApp)",
  maskedAbha: "ABHA Health ID",
  symptomsSummary: "Reported Symptoms Summary",
  printThermalSlip: "🖨️ Print 80mm Thermal Receipt Slip",
  sendWhatsApp: "📱 Send Token to WhatsApp",
  trackLiveQueue: "🔍 Track Live Queue on Phone",
  createNewToken: "Register New Patient",

  emergencyModalTitle: "🚨 Emergency Fast-Track Protocol",
  emergencyModalSubtitle: "Instant high-priority token dispatch bypassing standard queues in under 15 seconds.",
  criticalConditions: "Select Critical Condition",
  conditionCardiac: "Acute Chest Pain / Cardiac Pressure",
  conditionCardiacDesc: "Crushing chest tightness, radiating arm/jaw pain, heavy breathing",
  conditionBreathing: "Severe Breathlessness / Choking",
  conditionBreathingDesc: "Inability to breathe, severe asthma attack, stridor or gasping",
  conditionAccident: "Severe Road Accident / Collision / Trauma",
  conditionAccidentDesc: "Vehicle crash, polytrauma, heavy bleeding, open fractures",
  conditionFeverTrauma: "Hyperpyrexia (>104°F) / Major Trauma / Unconscious",
  conditionFeverTraumaDesc: "Severe head injury, heavy bleeding, seizure or sudden collapse",
  emergencyPhonePrompt: "Enter contact mobile number (or ABHA ID)",
  generateEmergencyToken: "Generate Instant RED-Tier Token (ER)",
  emergencyWarning: "Emergency tokens immediately alert the triage trauma team and assign Room 01 (Trauma Bay).",

  whatsAppTitle: "WhatsApp Token Notification",
  whatsAppSentTitle: "Token Sent via WhatsApp!",
  whatsAppSentDesc: "Automated multilingual OPD ticket with real-time queue tracking link dispatched.",
  whatsAppMessagePreview: "WhatsApp Message Preview",
  openRealWhatsApp: "Open in Real WhatsApp (wa.me)",
  close: "Close",

  liveQueueTitle: "Hospital Live OPD Queue & Triage Dashboard",
  queueOverview: "Real-time Patient Flow & Triage Department Allocation",
  allDepartments: "All Departments",
  waitingPatients: "Waiting in Queue",
  inConsultation: "In Consultation",
  completedToday: "Completed Consultations",
  avgWaitTime: "Avg Intake to Consult",
  callNextPatient: "📢 Call Next Patient (Bilingual Announcement)",
  callingAudio: "Calling patient via audio broadcast...",
  startConsultation: "Begin Consultation",
  markCompleted: "Complete Consultation",
  viewOcrRecords: "View Past Medical Records",
  noPatientsInQueue: "No patients currently waiting in this department queue.",
  triagePriority: "Triage Priority",
  chiefComplaints: "Chief Complaints",
  assignedDoctor: "Attending Doctor / Room",
};

// -------------------------------------------------------------
// Hindi (हिंदी)
// -------------------------------------------------------------
const baseHindi: TranslationDictionary = {
  ...baseEnglish,
  appTitle: "स्मार्ट विजुअल ओपीडी ट्राइएज व टोकन कियोस्क",
  appSubtitle: "एआई आधारित बहुभाषी मरीज स्व-पंजीकरण एवं कतार प्रबंधन",
  eventBadge: "अस्पताल ओपीडी कियोस्क",
  emergencyFastTrack: "🚨 आपातकालीन फास्ट-ट्रैक",
  voiceGuide: "आवाज सहायक",
  voiceGuideActive: "आवाज सहायक (सक्रिय)",
  highContrast: "उच्च कंट्रास्ट",
  doctorDashboard: "डॉक्टर / स्टाफ पोर्टल",
  liveDisplay: "लाइव प्रतीक्षा बोर्ड",
  kioskHome: "कियोस्क होम",
  inactivityNotice: "क्या आप अभी भी स्क्रीन पर हैं?",
  inactivityResetIn: "स्क्रीन रीसेट हो जाएगी",
  continueSession: "हाँ, जारी रखें (जारी रखें)",
  selectState: "राज्य चुनें",
  selectLanguage: "भाषा",

  step1Title: "मरीज पंजीकरण एवं पहचान",
  step1Subtitle: "अपनी जानकारी बोलें या लिखें। माइक बटन दबाकर बोल सकते हैं।",
  fullName: "पूरा नाम",
  fullNamePlaceholder: "उदा. रमेश कुमार",
  age: "उम्र (वर्ष)",
  agePlaceholder: "उदा. 45",
  gender: "लिंग",
  male: "पुरुष",
  female: "महिला",
  other: "अन्य",
  phone: "10 अंकों का मोबाइल नंबर",
  phonePlaceholder: "उदा. 9876543210",
  abhaId: "आभा आईडी / आधार",
  abhaIdPlaceholder: "14 अंकों की आभा आईडी या आधार",
  optionalTag: "वैकल्पिक",
  voiceInputTooltip: "माइक से बोलने के लिए क्लिक करें",
  listeningVoice: "सुन रहे हैं... अब बोलें",
  quickFillDemo: "त्वरित डेमो प्रोफाइल भरें",
  demoPatientChest: "रमेश (सीने में दर्द / बेचैनी)",
  demoPatientStomach: "सुनीता (तीव्र एसिडिटी / पेट दर्द)",
  nextStep: "आगे बढ़ें: दर्द वाले अंग चुनें",
  back: "पीछे जाएं",
  pleaseEnterPhone: "कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें",
  pleaseEnterName: "कृपया मरीज का नाम दर्ज करें",
  pleaseEnterAge: "कृपया वैध उम्र दर्ज करें",
  pleaseEnterAbha: "कृपया वैध 14 अंकों की आभा आईडी या आधार दर्ज करें",
  abhaPassword: "आभा पासवर्ड / पिन",
  abhaPasswordPlaceholder: "आभा पासवर्ड / पिन दर्ज करें",
  pleaseEnterAbhaPassword: "आभा पिन दर्ज करें",

  step2Title: "दर्द और लक्षण चुनें",
  step2Subtitle: "मानव शरीर के चित्र पर जहां दर्द या समस्या है, वहां छूएं। एक से अधिक अंग चुन सकते हैं।",
  frontView: "सामने का दृश्य",
  backView: "पीछे / रीढ़ का दृश्य",
  selectedZones: "चुने गए अंग",
  clearSelection: "सभी हटाएं",
  tapToSelectRegion: "दर्द वाले अंग चुनने के लिए शरीर पर कहीं भी छूएं",
  zonesSelectedCount: "अंग चुने गए",
  continueToSymptoms: "विस्तृत लक्षण भरें",
  selectAtLeastOneZone: "कृपया कम से कम एक अंग चुनें या आपातकालीन सेवा का उपयोग करें",

  regionHeadNeck: "सिर और गर्दन",
  regionChest: "छाती व पसलियां",
  regionAbdomen: "पेट और पाचन तंत्र",
  regionSpineBack: "रीढ़ व पीठ",
  regionArms: "हाथ और कंधे",
  regionPelvis: "कमर व पेल्विस",
  regionLegsJoints: "पैर, घुटने व जोड़",
  regionSkinGeneral: "त्वचा / पूरा शरीर",

  drillDownTitle: "विस्तृत लक्षण व समस्या स्पष्ट करें",
  drillDownSubtitle: "चुने गए अंग के अनुसार प्रभावित भाग या रोजमर्रा के लक्षण चुनें",
  selectOrgans: "प्रभावित अंग / उप-भाग",
  selectSymptoms: "आम लक्षण",
  dontKnowOption: "मुझे पता नहीं / समझ नहीं आ रहा",
  dontKnowDesc: "ट्राइएज डॉक्टर सामान्य शारीरिक जांच करेंगे",
  painSeverity: "दर्द / तकलीफ की तीव्रता",
  mild: "हल्का (1-3)",
  moderate: "मध्यम (4-7)",
  severe: "अत्यधिक तेज (8-10)",
  duration: "यह समस्या कितने समय से है?",
  today: "आज से ही",
  fewDays: "2 - 3 दिन से",
  moreThanWeek: "1 सप्ताह से अधिक",
  chronic: "काफी पुराना / लंबे समय से",
  saveSymptoms: "लक्षण सुरक्षित करें",

  step3Title: "पुराने मेडिकल पर्चे या रिपोर्ट अपलोड करें (वैकल्पिक)",
  step3Subtitle: "पुराने डॉक्टर के पर्चे या खून जांच रिपोर्ट की फोटो अपलोड करें। इसे छोड़ भी सकते हैं।",
  dragDropText: "दस्तावेज़ अपलोड करें (Upload Documents)",
  orBrowseFile: "डिवाइस से चुनें या फोटो खींचें",
  uploadPrescriptionPdf: "JPG, PNG, PDF (10MB तक)",
  skipStep: "छोड़ें और सीधे टोकन बनाएं",
  proceedToToken: "अपलोड रिपोर्ट के साथ आगे बढ़ें",
  analyzingDocument: "मेडिकल ओसीआर से रिपोर्ट की जांच हो रही है...",
  ocrSuccess: "ओसीआर जांच पूरी हुई",
  extractedDiagnoses: "पहचानी गई बीमारी / पिछली स्थिति",
  extractedMedicines: "पिछली दवाइयां",
  extractedAllergies: "एलर्जी / विशेष टिप्पणी",
  useSamplePrescription: "सैंपल पर्चा लोड करें (कार्डियोलॉजी)",
  useSampleBloodReport: "सैंपल गैस्ट्रो रिपोर्ट लोड करें",

  tokenGeneratedTitle: "ओपीडी टोकन सफलतापूर्वक जारी हुआ!",
  tokenGeneratedSubtitle: "आपका डिजिटल टोकन अस्पताल की लाइव कतार में पंजीकृत हो चुका है।",
  tokenNumber: "टोकन नंबर",
  department: "आवंटित विभाग",
  roomCounter: "ओपीडी कमरा व काउंटर",
  estimatedWait: "अनुमानित प्रतीक्षा समय",
  minutes: "मिनट",
  priorityLevel: "ट्राइएज प्राथमिकता",
  priorityEmergency: "लाल (आपातकालीन प्राथमिकता)",
  priorityUrgent: "पीला (त्वरित देखभाल)",
  priorityStandard: "हरा (सामान्य कतार)",
  patientName: "मरीज का नाम",
  patientAge: "उम्र / लिंग",
  maskedPhone: "मोबाइल (एसएमएस/व्हाट्सएप)",
  maskedAbha: "आभा हेल्थ आईडी",
  symptomsSummary: "दर्ज लक्षणों का सारांश",
  printThermalSlip: "🖨️ 80mm थर्मल रसीद प्रिंट करें",
  sendWhatsApp: "📱 व्हाट्सएप पर टोकन भेजें",
  trackLiveQueue: "🔍 फोन पर लाइव कतार देखें",
  createNewToken: "नया मरीज पंजीकृत करें",

  emergencyModalTitle: "🚨 आपातकालीन फास्ट-ट्रैक प्रोटोकॉल",
  emergencyModalSubtitle: "15 सेकंड से भी कम समय में बिना कतार तत्काल उच्च प्राथमिकता टोकन प्राप्त करें।",
  criticalConditions: "गंभीर स्थिति का चयन करें",
  conditionCardiac: "सीने में तीव्र दर्द / दिल का दौरा के लक्षण",
  conditionCardiacDesc: "सीने में अत्यधिक दबाव, जबड़े या बाएं हाथ में खिंचाव, सांस फूलना",
  conditionBreathing: "गंभीर सांस की तकलीफ / दम घुटना",
  conditionBreathingDesc: "सांस न ले पाना, अस्थमा का गंभीर दौरा, भारी घरघराहट",
  conditionAccident: "सड़क दुर्घटना / गंभीर आघात / एक्सीडेंट",
  conditionAccidentDesc: "वाहन दुर्घटना, गंभीर चोट, फ्रैक्चर, अत्यधिक रक्तस्राव",
  conditionFeverTrauma: "अत्यधिक तेज बुखार / बेहोशी / गंभीर चोट",
  conditionFeverTraumaDesc: "104°F से अधिक बुखार, गहरा घाव व खून बहना, बेहोशी, दौरा",
  emergencyPhonePrompt: "संपर्क मोबाइल नंबर (या आभा आईडी) दर्ज करें",
  generateEmergencyToken: "तत्काल रेड-टियर टोकन बनाएं (ER)",
  emergencyWarning: "आपातकालीन टोकन तुरंत ट्राइएज ट्रॉमा टीम को सतर्क करता है और कमरा 1 (आपातकालीन वार्ड) आवंटित करता है।",

  whatsAppTitle: "व्हाट्सएप सूचना प्रेषण",
  whatsAppSentTitle: "व्हाट्सएप टोकन भेज दिया गया!",
  whatsAppSentDesc: "लाइव ट्रैकिंग लिंक के साथ स्वचालित बहुभाषी टोकन रसीद भेजी गई।",
  whatsAppMessagePreview: "व्हाट्सएप संदेश सिमुलेशन",
  openRealWhatsApp: "असली व्हाट्सएप में खोलें (wa.me)",
  close: "बंद करें",

  liveQueueTitle: "अस्पताल लाइव ओपीडी कतार व ट्राइएज डैशबोर्ड",
  queueOverview: "मरीजों का रीयल-टाइम प्रवाह एवं ट्राइएज विभाग आवंटन",
  allDepartments: "सभी विभाग",
  waitingPatients: "कतार में प्रतीक्षारत",
  inConsultation: "परामर्श जारी है",
  completedToday: "आज पूर्ण परामर्श",
  avgWaitTime: "औसत प्रतीक्षा समय",
  callNextPatient: "📢 अगले मरीज को बुलाएं (हिंदी व अंग्रेजी घोषणा)",
  callingAudio: "टोकन की आवाज में घोषणा हो रही है...",
  startConsultation: "परामर्श शुरू करें",
  markCompleted: "परामर्श संपन्न हुआ",
  viewOcrRecords: "पुराने मेडिकल रिकॉर्ड देखें",
  noPatientsInQueue: "इस विभाग की कतार में वर्तमान में कोई मरीज प्रतीक्षारत नहीं है।",
  triagePriority: "प्राथमिकता स्तर",
  chiefComplaints: "मुख्य शिकायतें",
  assignedDoctor: "उपस्थित डॉक्टर / कमरा",
};

// -------------------------------------------------------------
// Marathi (मराठी)
// -------------------------------------------------------------
const baseMarathi: TranslationDictionary = {
  ...baseHindi,
  appTitle: "स्मार्ट व्हिज्युअल ट्रायज व टोकन किऑस्क",
  appSubtitle: "एआय आधारित बहुभाषिक रुग्ण स्व-नोंदणी व रांग व्यवस्थापन",
  emergencyFastTrack: "🚨 आपत्कालीन फास्ट-ट्रॅक",
  voiceGuide: "ध्वनी सहाय्यक",
  voiceGuideActive: "ध्वनी सहाय्यक (सुरू)",
  kioskHome: "किऑस्क मुख्यपृष्ठ",
  selectState: "राज्य निवडा",
  selectLanguage: "भाषा",

  step1Title: "रुग्ण नोंदणी व माहिती",
  step1Subtitle: "आपले नाव, वय आणि मोबाईल नंबर प्रविष्ट करा किंवा बोला.",
  fullName: "पूर्ण नाव",
  fullNamePlaceholder: "उदा. रमेश जोशी",
  age: "वय (वर्षे)",
  agePlaceholder: "उदा. ४५",
  gender: "लिंग",
  male: "पुरुष",
  female: "महिला",
  other: "इतर",
  phone: "१० अंकी मोबाईल नंबर",
  phonePlaceholder: "उदा. ९८७६५४३२१०",
  abhaId: "आभा हेल्थ आयडी / आधार",
  abhaIdPlaceholder: "१४ अंकी आभा आयडी किंवा आधार",
  optionalTag: "ऐच्छिक",
  voiceInputTooltip: "माइकवर बोलण्यासाठी क्लिक करा",
  listeningVoice: "ऐकत आहे... आता बोला",
  quickFillDemo: "डेमो प्रोफाइल भरा",
  demoPatientChest: "रमेश (छातीत तीव्र वेदना)",
  demoPatientStomach: "सुनीता (तीव्र पित्त / पोटदुखी)",
  nextStep: "पुढे",
  back: "मागे जा",
  pleaseEnterPhone: "कृपया १० अंकी वैध मोबाईल नंबर प्रविष्ट करा",
  pleaseEnterName: "कृपया रुग्णाचे नाव प्रविष्ट करा",
  pleaseEnterAge: "कृपया वैध वय प्रविष्ट करा",
  pleaseEnterAbha: "कृपया वैध १४ अंकी आभा आयडी किंवा आधार प्रविष्ट करा",
  abhaPassword: "आभा पासवर्ड / पिन",
  abhaPasswordPlaceholder: "आभा पासवर्ड / पिन प्रविष्ट करा",
  pleaseEnterAbhaPassword: "आभा पिन प्रविष्ट करा",

  step2Title: "मानवी शरीर वेदना व अवयव निवड",
  step2Subtitle: "शरीराच्या दुखणाऱ्या भागावर स्पर्श करा. आपण एकापेक्षा जास्त अवयव निवडू शकता.",
  frontView: "पुढील बाजू",
  backView: "मागील बाजू / पाठीचा कणा",
  selectedZones: "निवडलेले अवयव",
  clearSelection: "सर्व काढा",
  tapToSelectRegion: "दुखणारे अवयव निवडण्यासाठी शरीरावर स्पर्श करा",
  zonesSelectedCount: "अवयव निवडले",
  continueToSymptoms: "लक्षणांची माहिती भरा",
  selectAtLeastOneZone: "कृपया किमान एक अवयव निवडा किंवा आपत्कालीन सेवा वापरा",

  regionHeadNeck: "डोके व मान",
  regionChest: "छाती व बरगड्या",
  regionAbdomen: "पोट व पचनसंस्था",
  regionSpineBack: "पाठीचा कणा व पाठ",
  regionArms: "हात व खांदे",
  regionPelvis: "कंबर व ओटीपोट",
  regionLegsJoints: "पाय, गुडघे व सांधे",
  regionSkinGeneral: "त्वचा / संपूर्ण शरीर",

  drillDownTitle: "लक्षणे व वेदना स्पष्ट करा",
  drillDownSubtitle: "निवडलेल्या भागातील अवयव किंवा सामान्य लक्षणे निवडा",
  selectOrgans: "प्रभावित अवयव / उप-भाग",
  selectSymptoms: "दैनंदिन लक्षणे",
  dontKnowOption: "मला खात्री नाही / माहित नाही",
  dontKnowDesc: "डॉक्टर सामान्य शारीरिक तपासणी करतील",
  painSeverity: "वेदनेची तीव्रता",
  mild: "सौम्य (१-३)",
  moderate: "मध्यम (४-७)",
  severe: "तीव्र (८-१०)",
  duration: "ही समस्या किती दिवसांपासून आहे?",
  today: "आजपासून",
  fewDays: "२ - ३ दिवस",
  moreThanWeek: "१ आठवड्यापेक्षा जास्त",
  chronic: "दीर्घकालीन / जुनाट",
  saveSymptoms: "लक्षणे जतन करा",

  step3Title: "मागील वैद्यकीय अहवाल / प्रिस्क्रिप्शन अपलोड",
  step3Subtitle: "मागील डॉक्टरांचे प्रिस्क्रिप्शन किंवा लॅब रिपोर्ट अपलोड करा. आपण हे वगळू शकता.",
  dragDropText: "प्रिस्क्रिप्शन किंवा रिपोर्टची फोटो येथे टाका",
  orBrowseFile: "फाइल निवडा किंवा फोटो काढा",
  skipStep: "वगळा व टोकन बनवा",
  proceedToToken: "अपलोड केलेल्या रिपोर्टसह पुढे जा",
  analyzingDocument: "मेडिकल ओसीआर द्वारे रिपोर्ट तपासत आहे...",
  ocrSuccess: "ओसीआर तपासणी पूर्ण झाली",
  extractedDiagnoses: "निदान झालेले आजार",
  extractedMedicines: "मागील औषधे",
  extractedAllergies: "अलर्जी / टीप",

  tokenGeneratedTitle: "ओपीडी टोकन यशस्वीरीत्या तयार झाले!",
  tokenGeneratedSubtitle: "आपला डिजिटल टोकन रुग्णालयाच्या थेट रांगेत नोंदवला गेला आहे.",
  tokenNumber: "टोकन क्रमांक",
  department: "नियुक्त विभाग",
  roomCounter: "खोली व काउंटर",
  estimatedWait: "अंदाजे प्रतीक्षा वेळ",
  minutes: "मिनिटे",
  priorityLevel: "ट्रायज प्राधान्यता",
  priorityEmergency: "लाल (तातडीची आपत्कालीन सेवा)",
  priorityUrgent: "पिवळा (त्वरित तपासणी)",
  priorityStandard: "हिरवा (सामान्य रांग)",
  patientName: "रुग्णाचे नाव",
  patientAge: "वय / लिंग",
  maskedPhone: "मोबाईल (एसएमएस/व्हॉट्सॲप)",
  maskedAbha: "आभा हेल्थ आयडी",
  symptomsSummary: "नोंदवलेल्या लक्षणांचा सारांश",
  printThermalSlip: "🖨️ पावती प्रिंट करा",
  sendWhatsApp: "📱 व्हॉट्सॲपवर टोकन पाठवा",
  trackLiveQueue: "🔍 थेट रांग तपासा",
  createNewToken: "पुढील रुग्ण नोंदणी",

  conditionCardiac: "छातीत तीव्र वेदना / हृदयविकाराचे लक्षण",
  conditionCardiacDesc: "छातीत प्रचंड दाब, डाव्या हातात किंवा जबड्यात वेदना, दम लागणे",
  conditionBreathing: "श्वास घेण्यास तीव्र अडचण / दम लागणे",
  conditionBreathingDesc: "श्वास घेता न येणे, दम्याचा तीव्र झटका, घरघर लागणे",
  conditionAccident: "अपघात / रस्ते अपघात / गंभीर जखम",
  conditionAccidentDesc: "वाहन अपघात, गंभीर मार, फ्रॅक्चर किंवा प्रचंड रक्तस्त्राव",
  conditionFeverTrauma: "अतिशय तीव्र ताप (>104°F) / बेशुद्धी / गंभीर दुखापत",
  conditionFeverTraumaDesc: "डोक्याला मार, रक्तस्त्राव, फिट येणे किंवा बेशुद्ध होणे",
  generateEmergencyToken: "तातडीचा रेड-टियर टोकन बनवा (ER)",
  emergencyWarning: "आपत्कालीन टोकन थेट ट्रॉमा टीमला सतर्क करते आणि रूम ०१ (ट्रॉमा वॉर्ड) वाटप करते.",

  liveQueueTitle: "रुग्णालय थेट ओपीडी रांग व ट्रायज फलक",
  waitingPatients: "प्रतीक्षारत रुग्ण",
  inConsultation: "तपासणी सुरू",
  completedToday: "आज पूर्ण झालेले",
  callNextPatient: "📢 पुढील रुग्णाला बोलवा (मराठी व इंग्रजी घोषणा)",
};

// -------------------------------------------------------------
// Kannada (ಕನ್ನಡ)
// -------------------------------------------------------------
const baseKannada: TranslationDictionary = {
  ...baseEnglish,
  appTitle: "ಸ್ಮಾರ್ಟ್ ಟ್ರಯೇಜ್ ಮತ್ತು ಓಪಿಡಿ ಟೋಕನ್ ಕಿಯೋಸ್ಕ್",
  appSubtitle: "ಎಐ ಆಧಾರಿತ ರೋಗಿ ಸ್ವಯಂ ನೋಂದಣಿ ಮತ್ತು ಸಾಲು ನಿರ್ವಹಣೆ",
  emergencyFastTrack: "🚨 ತುರ್ತು ಸೇವೆ",
  voiceGuide: "ಧ್ವನಿ ಸಹಾಯಕ",
  voiceGuideActive: "ಧ್ವನಿ ಸಹಾಯಕ (ಸಕ್ರಿಯ)",
  kioskHome: "ಮುಖಪುಟ",
  selectState: "ರಾಜ್ಯ ಆಯ್ಕೆಮಾಡಿ",
  selectLanguage: "ಭಾಷೆ",

  step1Title: "ರೋಗಿ ನೋಂದಣಿ ಮತ್ತು ವಿವರಗಳು",
  step1Subtitle: "ನಿಮ್ಮ ಹೆಸರು, ವಯಸ್ಸು ಮತ್ತು ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ ಅಥವಾ ಮಾತನಾಡಿ.",
  fullName: "ಪೂರ್ಣ ಹೆಸರು",
  fullNamePlaceholder: "ಉದಾ. ರಮೇಶ್ ಕುಮಾರ್",
  age: "ವಯಸ್ಸು (ವರ್ಷಗಳು)",
  agePlaceholder: "ಉದಾ. ೪೫",
  gender: "ಲಿಂಗ",
  male: "ಪುರುಷ",
  female: "ಮಹಿಳೆ",
  other: "ಇತರೆ",
  phone: "೧೦ ಅಂಕಿಗಳ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
  phonePlaceholder: "ಉದಾ. ೯೮೭೬೫೪೩೨೧೦",
  nextStep: "ಮುಂದೆ",
  back: "ಹಿಂದೆ",

  step2Title: "ಮಾನವ ದೇಹದ ನೋವಿನ ಭಾಗಗಳ ನಕ್ಷೆ",
  step2Subtitle: "ದೇಹದ ನೋವಿರುವ ಭಾಗವನ್ನು ಸ್ಪರ್ಶಿಸಿ ಆಯ್ಕೆಮಾಡಿ.",
  frontView: "ಮುಂಭಾಗ",
  backView: "ಹಿಂಭಾಗ",
  selectedZones: "ಆಯ್ಕೆಮಾಡಿದ ಭಾಗಗಳು",
  clearSelection: "ಎಲ್ಲವನ್ನೂ ಅಳಿಸಿ",
  continueToSymptoms: "ಲಕ್ಷಣಗಳ ವಿವರ ಮುಂದುವರಿಸಿ",
  saveSymptoms: "ವಿವರಗಳನ್ನು ಉಳಿಸಿ",

  regionHeadNeck: "ತಲೆ ಮತ್ತು ಕುತ್ತಿಗೆ",
  regionChest: "ಎದೆ ಮತ್ತು ಪಕ್ಕೆಲುಬುಗಳು",
  regionAbdomen: "ಹೊಟ್ಟೆ ಮತ್ತು ಜೀರ್ಣಾಂಗ",
  regionSpineBack: "ಬೆನ್ನುಮೂಳೆ ಮತ್ತು ಬೆನ್ನು",
  regionArms: "ಕೈಗಳು ಮತ್ತು ಭುಜಗಳು",
  regionPelvis: "ಸೊಂಟ ಮತ್ತು ಶ್ರೋಣಿ",
  regionLegsJoints: "ಕಾಲುಗಳು, ಮೊಣಕಾಲುಗಳು ಮತ್ತು ಕೀಲುಗಳು",
  regionSkinGeneral: "ಚರ್ಮ / ಸಾಮಾನ್ಯ ದೇಹ",

  drillDownTitle: "ಲಕ್ಷಣಗಳು ಮತ್ತು ನೋವನ್ನು ವಿವರಿಸಿ",
  drillDownSubtitle: "ಆಯ್ಕೆಮಾಡಿದ ಪ್ರದೇಶದ ಅಂಗಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ",
  selectOrgans: "ಬಾಧಿತ ಅಂಗಗಳು",
  selectSymptoms: "ಸಾಮಾನ್ಯ ಲಕ್ಷಣಗಳು",
  dontKnowOption: "ನನಗೆ ಗೊತ್ತಿಲ್ಲ / ಖಚಿತವಿಲ್ಲ",
  painSeverity: "ನೋವಿನ ತೀವ್ರತೆ",
  mild: "ಸೌಮ್ಯ (೧-೩)",
  moderate: "ಮಧ್ಯಮ (೪-೭)",
  severe: "ತೀವ್ರ (೮-೧೦)",
  duration: "ಇದು ಎಷ್ಟು ದಿನಗಳಿಂದ ಇದೆ?",
  today: "ಇಂದಿನಿಂದ",
  fewDays: "೨ - ೩ ದಿನಗಳು",
  moreThanWeek: "೧ ವಾರಕ್ಕೂ ಹೆಚ್ಚು",
  chronic: "ದೀರ್ಘಕಾಲೀನ",

  step3Title: "ಹಳೆಯ ವೈದ್ಯಕೀಯ ವರದಿಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
  skipStep: "ಬಿಟ್ಟು ಟೋಕನ್ ಪಡೆಯಿರಿ",
  proceedToToken: "ವರದಿಯೊಂದಿಗೆ ಮುಂದುವರಿಯಿರಿ",

  tokenGeneratedTitle: "ಟೋಕನ್ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ!",
  tokenNumber: "ಟೋಕನ್ ಸಂಖ್ಯೆ",
  department: "ನಿಯೋಜಿತ ವಿಭಾಗ",
  roomCounter: "ಕೊಠಡಿ ಮತ್ತು ಕೌಂಟರ್",
  estimatedWait: "ಅಂದಾಜು ಕಾಯುವ ಸಮಯ",
  minutes: "ನಿಮಿಷಗಳು",
  printThermalSlip: "🖨️ ರಶೀದಿ ಮುದ್ರಿಸಿ",
  sendWhatsApp: "📱 ವಾಟ್ಸಾಪ್‌ಗೆ ಕಳುಹಿಸಿ",
  trackLiveQueue: "🔍 ನೇರ ಸಾಲು ಪರಿಶೀಲಿಸಿ",
  createNewToken: "ಮುಂದಿನ ರೋಗಿ ನೋಂದಣಿ",
  liveQueueTitle: "ನೇರ ಓಪಿಡಿ ಸರದಿ ಫಲಕ",
  waitingPatients: "ಕಾಯುತ್ತಿರುವ ರೋಗಿಗಳು",
  inConsultation: "ಪರಿಶೀಲನೆಯಲ್ಲಿದ್ದಾರೆ",
  completedToday: "ಇಂದು ಪೂರ್ಣಗೊಂಡಿದೆ",
};

// -------------------------------------------------------------
// Tamil (தமிழ்)
// -------------------------------------------------------------
const baseTamil: TranslationDictionary = {
  ...baseEnglish,
  appTitle: "ஸ்மார்ட் ட்ரையேஜ் மற்றும் ஓபிடி டோக்கன் கியோஸ்க்",
  appSubtitle: "AI அடிப்படையிலான நோயாளி சுய பதிவு மற்றும் வரிசை மேலாண்மை",
  emergencyFastTrack: "🚨 அவசர சிகிச்சை",
  voiceGuide: "குரல் உதவியாளர்",
  voiceGuideActive: "குரல் உதவியாளர் (இயக்கத்தில்)",
  kioskHome: "முகப்பு",
  selectState: "மாநிலத்தைத் தேர்ந்தெடுக்கவும்",
  selectLanguage: "மொழி",

  step1Title: "நோயாளி பதிவு மற்றும் விவரங்கள்",
  step1Subtitle: "உங்கள் பெயர், வயது மற்றும் மொபைல் எண்ணை உள்ளிடவும் அல்லது பேசவும்.",
  fullName: "முழுப் பெயர்",
  fullNamePlaceholder: "எ.கா. ரமேஷ் குமார்",
  age: "வயது (ஆண்டுகள்)",
  agePlaceholder: "எ.கா. 45",
  gender: "பாலினம்",
  male: "ஆண்",
  female: "பெண்",
  other: "மற்றவை",
  phone: "10 இலக்க மொபைல் எண்",
  phonePlaceholder: "எ.கா. 9876543210",
  nextStep: "அடுத்து",
  back: "பின்செல்லவும்",

  step2Title: "மனித உடல் வலி வரைபடம்",
  step2Subtitle: "வலியை உணரும் உடல் பகுதியைத் தொடவும்.",
  frontView: "முன்புறம்",
  backView: "பின்புறம்",
  selectedZones: "தேர்ந்தெடுக்கப்பட்ட பகுதிகள்",
  clearSelection: "அனைத்தையும் நீக்கு",
  continueToSymptoms: "அறிகுறிகள் விவரம்",
  saveSymptoms: "விவரங்களைச் சேமிக்கவும்",

  regionHeadNeck: "தலை மற்றும் கழுத்து",
  regionChest: "மார்பு மற்றும் விலா எலும்புகள்",
  regionAbdomen: "வயிறு மற்றும் செரிமான அமைப்பு",
  regionSpineBack: "முதுகெலும்பு மற்றும் முதுகு",
  regionArms: "கைகள் மற்றும் தோள்கள்",
  regionPelvis: "இடுப்பு பகுதி",
  regionLegsJoints: "கால்கள், முழங்கால்கள் மற்றும் மூட்டுகள்",
  regionSkinGeneral: "தோல் / பொதுவான உடல்",

  drillDownTitle: "அறிகுறிகள் மற்றும் அசௌகரியத்தை குறிப்பிடவும்",
  drillDownSubtitle: "பாதிக்கப்பட்ட பகுதியின் உறுப்புகளைத் தேர்ந்தெடுக்கவும்",
  selectOrgans: "பாதிக்கப்பட்ட உறுப்புகள்",
  selectSymptoms: "பொதுவான அறிகுறிகள்",
  dontKnowOption: "எனக்குத் தெரியாது / உறுதியாக இல்லை",
  painSeverity: "வலி அளவு",
  mild: "லேசான (1-3)",
  moderate: "மிதமான (4-7)",
  severe: "கடுமையான (8-10)",
  duration: "இது எவ்வளவு காலமாக உள்ளது?",
  today: "இன்றிலிருந்து",
  fewDays: "2 - 3 நாட்கள்",
  moreThanWeek: "1 வாரத்திற்கு மேல்",
  chronic: "நீண்ட கால பிரச்சனை",

  step3Title: "மருத்துவ ஆவணங்களைப் பதிவேற்றவும்",
  skipStep: "டோக்கன் பெறவும்",
  proceedToToken: "பதிவேற்றிய ஆவணங்களுடன் தொடரவும்",

  tokenGeneratedTitle: "டோக்கன் வெற்றிகரமாக உருவாக்கப்பட்டது!",
  tokenNumber: "டோக்கன் எண்",
  department: "ஒதுக்கப்பட்ட துறை",
  roomCounter: "அறை & கவுண்டர்",
  estimatedWait: "மதிப்பிடப்பட்ட காத்திருப்பு நேரம்",
  minutes: "நிமிடங்கள்",
  printThermalSlip: "🖨️ ரசீது அச்சிடுக",
  sendWhatsApp: "📱 வாட்ஸ்அப்பில் பெறுக",
  trackLiveQueue: "🔍 நேரலை வரிசையைக் காண்க",
  createNewToken: "அடுத்த நோயாளி பதிவு",
  liveQueueTitle: "நேரலை ஓபிடி வரிசைப் பலகை",
  waitingPatients: "காத்திருக்கும் நோயாளிகள்",
  inConsultation: "சிகிச்சையில் உள்ளவர்கள்",
  completedToday: "இன்று முடிக்கப்பட்டவை",
};

// -------------------------------------------------------------
// Telugu (తెలుగు)
// -------------------------------------------------------------
const baseTelugu: TranslationDictionary = {
  ...baseEnglish,
  appTitle: "స్మార్ట్ ట్రయాజ్ & ఓపీడీ టోకెన్ కియోస్క్",
  emergencyFastTrack: "🚨 అత్యవసర సేవ",
  voiceGuide: "వాయిస్ అసిస్టెంట్",
  kioskHome: "హోమ్",
  selectState: "రాష్ట్రం ఎంచుకోండి",
  selectLanguage: "భాష",

  step1Title: "రోగి నమోదు & వివరాలు",
  step1Subtitle: "మీ పేరు, వయస్సు మరియు మొబైల్ నంబర్ నమోదు చేయండి లేదా మాట్లాడండి.",
  fullName: "పూర్తి పేరు",
  fullNamePlaceholder: "ఉదా. రమేష్ కుమార్",
  age: "వయస్సు (సంవత్సరాలు)",
  gender: "లింగం",
  male: "పురుషుడు",
  female: "స్త్రీ",
  other: "ఇతర",
  phone: "10 అంకెల మొబైల్ నంబర్",
  nextStep: "తర్వాత",
  back: "వెనుకకు",

  step2Title: "మానవ శరీర నొప్పి మ్యాప్",
  step2Subtitle: "నొప్పి ఉన్న శరీర భాగాన్ని తాకండి.",
  frontView: "ముందు భాగం",
  backView: "వెనుక భాగం",
  selectedZones: "ఎంచుకున్న భాగాలు",
  clearSelection: "అన్నీ తొలగించు",
  continueToSymptoms: "లక్షణాల వివరాలు",
  saveSymptoms: "వివరాలను సేవ్ చేయండి",

  regionHeadNeck: "తల & మెడ",
  regionChest: "ఛాతీ & పక్కటెముకలు",
  regionAbdomen: "పొట్ట & జీర్ణవ్యవస్థ",
  regionSpineBack: "వెన్నెముక & వెనుక భాగం",
  regionArms: "చేతులు & భుజాలు",
  regionPelvis: "కటి భాగం",
  regionLegsJoints: "కాళ్ళు, మోకాళ్ళు & కీళ్ళు",
  regionSkinGeneral: "చర్మం / సాధారణ శరీరం",

  step3Title: "పాత ప్రిస్క్రిప్షన్ అప్‌లోడ్ చేయండి",
  skipStep: "టోకెన్ పొందండి",
  proceedToToken: "నివేదికతో కొనసాగండి",

  tokenGeneratedTitle: "ఓపీడీ టోకెన్ విజయవంతంగా జారీ చేయబడింది!",
  tokenNumber: "టోకెన్ సంఖ్య",
  department: "కేటాయించిన విభాగం",
  roomCounter: "గది & కౌంటర్",
  estimatedWait: "వేచి ఉండే సమయం",
  minutes: "నిమిషాలు",
  printThermalSlip: "🖨️ రశీదు ప్రింట్ చేయండి",
  sendWhatsApp: "📱 వాట్సాప్‌కు పంపండి",
  trackLiveQueue: "🔍 లైవ్ క్యూ చూడండి",
  createNewToken: "మరొక రోగి నమోదు",
  liveQueueTitle: "లైవ్ ఓపీడీ క్యూ బోర్డ్",
  waitingPatients: "వేచి ఉన్న రోగులు",
  inConsultation: "వైద్య పరీక్ష జరుగుతోంది",
  completedToday: "ఈరోజు పూర్తయినవి",
};

// -------------------------------------------------------------
// Bengali (বাংলা)
// -------------------------------------------------------------
const baseBengali: TranslationDictionary = {
  ...baseEnglish,
  appTitle: "স্মার্ট ট্রায়াজ এবং ওপিডি টোকেন কিয়স্ক",
  emergencyFastTrack: "🚨 জরুরি সেবা",
  voiceGuide: "ভয়েস সহায়ক",
  kioskHome: "হোম পেজ",
  selectState: "রাজ্য নির্বাচন করুন",
  selectLanguage: "ভাষা",

  step1Title: "রোগী নিবন্ধন এবং বিবরণ",
  step1Subtitle: "আপনার নাম, বয়স এবং মোবাইল নম্বর লিখুন বা বলুন।",
  fullName: "পুরো নাম",
  fullNamePlaceholder: "যেমন: রমেশ কুমার",
  age: "বয়স (বছর)",
  gender: "লিঙ্গ",
  male: "পুরুষ",
  female: "মহিলা",
  other: "অন্যান্য",
  phone: "১০ অঙ্কের মোবাইল নম্বর",
  nextStep: "পরবর্তী",
  back: "পেছনে যান",

  step2Title: "মানব শরীরের ব্যথার মানচিত্র",
  step2Subtitle: "শরীরের ব্যথার স্থানে স্পর্শ করুন।",
  frontView: "সামনের দৃশ্য",
  backView: "পেছনের দৃশ্য",
  selectedZones: "নির্বাচিত অংশ",
  clearSelection: "সব মুছুন",
  continueToSymptoms: "লক্ষণ বিস্তারিত লিখুন",
  saveSymptoms: "সংরক্ষণ করুন",

  regionHeadNeck: "মাথা ও ঘাড়",
  regionChest: "বুক ও পাঁজর",
  regionAbdomen: "পেট ও পরিপাকতন্ত্র",
  regionSpineBack: "মেরুদণ্ড ও পিঠ",
  regionArms: "হাত ও কাঁধ",
  regionPelvis: "কোমর ও পেলভিস",
  regionLegsJoints: "পা, হাঁটু ও সন্ধি",
  regionSkinGeneral: "ত্বক / সামগ্রিক শরীর",

  step3Title: "পুরনো প্রেসক্রিপশন আপলোড করুন",
  skipStep: "টোকেন তৈরি করুন",
  proceedToToken: "রিপোর্টের সাথে এগিয়ে যান",

  tokenGeneratedTitle: "ওপিডি টোকেন সফলভাবে তৈরি হয়েছে!",
  tokenNumber: "টোকেন নম্বর",
  department: "বরাদ্দকৃত বিভাগ",
  roomCounter: "রুম ও কাউন্টার",
  estimatedWait: "আনুমানিক অপেক্ষার সময়",
  minutes: "মিনিট",
  printThermalSlip: "🖨️ স্লিপ প্রিন্ট করুন",
  sendWhatsApp: "📱 হোয়াটসঅ্যাপে পাঠান",
  trackLiveQueue: "🔍 লাইভ কিউ দেখুন",
  createNewToken: "নতুন রোগী নিবন্ধন",
  liveQueueTitle: "লাইভ ওপিডি কিউ বোর্ড",
  waitingPatients: "অপেক্ষারত রোগী",
  inConsultation: "পরামর্শ চলছে",
  completedToday: "আজ সম্পন্ন হয়েছে",
};

// -------------------------------------------------------------
// Gujarati (ગુજરાતી)
// -------------------------------------------------------------
const baseGujarati: TranslationDictionary = {
  ...baseHindi,
  appTitle: "સ્માર્ટ ટ્રાયજ અને ઓપીડી ટોકન કિઓસ્ક",
  emergencyFastTrack: "🚨 ઇમરજન્સી ફાસ્ટ-ટ્રેક",
  voiceGuide: "અવાજ સહાયક",
  kioskHome: "હોમ પેજ",
  selectState: "રાજ્ય પસંદ કરો",
  selectLanguage: "ભાષા",

  step1Title: "દર્દી નોંધણી અને વિગતો",
  step1Subtitle: "તમારું નામ, ઉંમર અને મોબાઇલ નંબર દાખલ કરો અથવા બોલો.",
  fullName: "પૂરું નામ",
  fullNamePlaceholder: "દા.ત. રમેશ કુમાર",
  age: "ઉંમર (વર્ષ)",
  gender: "જાતિ",
  male: "પુરુષ",
  female: "સ્ત્રી",
  other: "અન્ય",
  phone: "10 અંકનો મોબાઇલ નંબર",
  nextStep: "આગળ",
  back: "પાછા જાઓ",

  step2Title: "માનવ શરીર દુખાવો નકશો",
  step2Subtitle: "દુખાવો થતા શરીરના ભાગ પર સ્પર્શ કરો.",
  frontView: "આગળનો ભાગ",
  backView: "પાછળનો ભાગ",
  selectedZones: "પસંદ કરેલા ભાગો",
  clearSelection: "બધું સાફ કરો",
  continueToSymptoms: "લક્ષણોની વિગતો ભરો",
  saveSymptoms: "વિગતો સાચવો",

  regionHeadNeck: "માથું અને ગરદન",
  regionChest: "છાતી અને પાંસળીઓ",
  regionAbdomen: "પેટ અને પાચનતંત્ર",
  regionSpineBack: "કરોડરજ્જુ અને પીઠ",
  regionArms: "હાથ અને ખભા",
  regionPelvis: "કમર અને પેલ્વિસ",
  regionLegsJoints: "પગ, ઘૂંટણ અને સાંધા",
  regionSkinGeneral: "ત્વચા / આખું શરીર",

  step3Title: "જૂનો રિપોર્ટ અપલોડ કરો",
  skipStep: "ટોકન બનાવો",
  proceedToToken: "આગળ વધો",

  tokenGeneratedTitle: "ટોકન સફળતાપૂર્વક જનરેટ થયું!",
  tokenNumber: "ટોકન નંબર",
  department: "વિભાગ",
  roomCounter: "રૂમ અને કાઉન્ટર",
  estimatedWait: "અંદાજિત સમય",
  minutes: "મિનિટ",
  printThermalSlip: "🖨️ પહોંચ પ્રિન્ટ કરો",
  sendWhatsApp: "📱 વ્હોટ્સએપ પર મેળવો",
  trackLiveQueue: "🔍 લાઇવ લાઇન તપાસો",
  createNewToken: "નવા દર્દીની નોંધણી",
  liveQueueTitle: "લાઇવ ઓપીડી કતાર બોર્ડ",
};

// -------------------------------------------------------------
// Punjabi (ਪੰਜਾਬੀ)
// -------------------------------------------------------------
const basePunjabi: TranslationDictionary = {
  ...baseHindi,
  appTitle: "ਸਮਾਰਟ ਟ੍ਰਾਈਏਜ ਅਤੇ ਓਪੀਡੀ ਟੋਕਨ ਕਿਓਸਕ",
  emergencyFastTrack: "🚨 ਐਮਰਜੈਂਸੀ ਸੇਵਾ",
  voiceGuide: "ਆਵਾਜ਼ ਸਹਾਇਕ",
  kioskHome: "ਮੁੱਖ ਸਫ਼ਾ",
  selectState: "ਰਾਜ ਚੁਣੋ",
  selectLanguage: "ਭਾਸ਼ਾ",

  step1Title: "ਮਰੀਜ਼ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਅਤੇ ਵੇਰਵੇ",
  step1Subtitle: "ਆਪਣਾ ਨਾਮ, ਉਮਰ ਅਤੇ ਮੋਬਾਈਲ ਨੰਬਰ ਦਰਜ ਕਰੋ ਜਾਂ ਬੋਲੋ।",
  fullName: "ਪੂਰਾ ਨਾਮ",
  fullNamePlaceholder: "ਉਦਾਹਰਣ: ਰਮੇਸ਼ ਕੁਮਾਰ",
  age: "ਉਮਰ (ਸਾਲ)",
  gender: "ਲਿੰਗ",
  male: "ਪੁਰਸ਼",
  female: "ਮਹਿਲਾ",
  other: "ਹੋਰ",
  phone: "10 ਅੰਕਾਂ ਦਾ ਮੋਬਾਈਲ ਨੰਬਰ",
  nextStep: "ਅੱਗੇ",
  back: "ਪਿੱਛੇ",

  step2Title: "ਮਨੁੱਖੀ ਸਰੀਰ ਦਰਦ ਦਾ ਨਕਸ਼ਾ",
  step2Subtitle: "ਸਰੀਰ ਦੇ ਦਰਦ ਵਾਲੇ ਹਿੱਸੇ 'ਤੇ ਛੂਹੋ।",
  frontView: "ਸਾਹਮਣਾ ਪਾਸਾ",
  backView: "ਪਿਛਲਾ ਪਾਸਾ",
  selectedZones: "ਚੁਣੇ ਗਏ ਹਿੱਸੇ",
  clearSelection: "ਸਭ ਹਟਾਓ",
  continueToSymptoms: "ਲੱਛਣਾਂ ਦਾ ਵੇਰਵਾ ਭਰੋ",
  saveSymptoms: "ਵੇਰਵਾ ਸੰਭਾਲੋ",

  regionHeadNeck: "ਸਿਰ ਅਤੇ ਗਰਦਨ",
  regionChest: "ਛਾਤੀ ਅਤੇ ਪਸਲੀਆਂ",
  regionAbdomen: "ਢਿੱਡ ਅਤੇ ਪਾਚਨ ਪ੍ਰਣਾਲੀ",
  regionSpineBack: "ਰੀੜ੍ਹ ਦੀ ਹੱਡੀ ਅਤੇ ਪਿੱਠ",
  regionArms: "ਬਾਹਾਂ ਅਤੇ ਮੋਢੇ",
  regionPelvis: "ਲੱਕ ਅਤੇ ਪੇਡੂ",
  regionLegsJoints: "ਲੱਤਾਂ, ਗੋਡੇ ਅਤੇ ਜੋੜ",
  regionSkinGeneral: "ਚਮੜੀ / ਪੂਰਾ ਸਰੀਰ",

  step3Title: "ਪੁਰਾਣੀ ਪਰਚੀ ਅੱਪਲੋਡ ਕਰੋ",
  skipStep: "ਟੋਕਨ ਪ੍ਰਾਪਤ ਕਰੋ",
  proceedToToken: "ਅੱਗੇ ਵਧੋ",

  tokenGeneratedTitle: "ਟੋਕਨ ਸਫਲਤਾਪੂਰਵਕ ਜਾਰੀ ਕੀਤਾ ਗਿਆ!",
  tokenNumber: "ਟੋਕਨ ਨੰਬਰ",
  department: "ਨਿਰਧਾਰਤ ਵਿਭਾਗ",
  roomCounter: "ਕਮਰਾ ਅਤੇ ਕਾਊਂਟਰ",
  estimatedWait: "ਅੰਦਾਜ਼ਨ ਉਡੀਕ ਸਮਾਂ",
  minutes: "ਮਿੰਟ",
  printThermalSlip: "🖨️ ਪਰਚੀ ਪ੍ਰਿੰਟ ਕਰੋ",
  sendWhatsApp: "📱 ਵਟਸਐਪ 'ਤੇ ਭੇਜੋ",
  trackLiveQueue: "🔍 ਲਾਈਵ ਕਤਾਰ ਦੇਖੋ",
  createNewToken: "ਅਗਲਾ ਮਰੀਜ਼ ਦਰਜ ਕਰੋ",
  liveQueueTitle: "ਲਾਈਵ ਓਪੀਡੀ ਕਤਾਰ ਬੋਰਡ",
};

// -------------------------------------------------------------
// Malayalam (മലയാളം)
// -------------------------------------------------------------
const baseMalayalam: TranslationDictionary = {
  ...baseEnglish,
  appTitle: "സ്മാർട്ട് ട്രയാജ് & ഒപിഡി ടോക്കൺ കിയോസ്ക്",
  emergencyFastTrack: "🚨 അടിയന്തര ചികിത്സ",
  voiceGuide: "ശബ്ദ സഹായി",
  kioskHome: "ഹോം പേജ്",
  selectState: "സംസ്ഥാനം തിരഞ്ഞെടുക്കുക",
  selectLanguage: "ഭാഷ",

  step1Title: "രോഗി രജിസ്ട്രേഷൻ",
  step1Subtitle: "നിങ്ങളുടെ പേര്, പ്രായം, മൊബൈൽ നമ്പർ നൽകുക അല്ലെങ്കിൽ സംസാരിക്കുക.",
  fullName: "പൂർണ്ണമായ പേര്",
  fullNamePlaceholder: "ഉദാ: രമേഷ് കുമാർ",
  age: "പ്രായം (വർഷങ്ങൾ)",
  gender: "ലിംഗം",
  male: "പുരുഷൻ",
  female: "സ്ത്രീ",
  other: "മറ്റുള്ളവ",
  phone: "10 അക്ക മൊബൈൽ നമ്പർ",
  nextStep: "അടുത്തത്",
  back: "പിന്നോട്ട്",

  step2Title: "ശരീര വേദന മാപ്പ്",
  step2Subtitle: "വേദന അനുഭവപ്പെടുന്ന ഭാഗത്ത് സ്പർശിക്കുക.",
  frontView: "മുൻഭാഗം",
  backView: "പിൻഭാഗം",
  selectedZones: "തിരഞ്ഞെടുത്ത ഭാഗങ്ങൾ",
  clearSelection: "എല്ലാം മായ്ക്കുക",
  continueToSymptoms: "ലക്ഷണങ്ങളുടെ വിവരങ്ങൾ",
  saveSymptoms: "വിവരങ്ങൾ സംരക്ഷിക്കുക",

  regionHeadNeck: "തലയും കഴുത്തും",
  regionChest: "നെഞ്ചും വാരിയെല്ലുകളും",
  regionAbdomen: "വയറും ദഹനവ്യവസ്ഥയും",
  regionSpineBack: "നട്ടെല്ലും പുറംഭാഗവും",
  regionArms: "കൈകളും തോളുകളും",
  regionPelvis: "ഇടുപ്പ് ഭാഗം",
  regionLegsJoints: "കാലുകൾ, കാൽമുട്ടുകൾ, സന്ധികൾ",
  regionSkinGeneral: "ചർമ്മം / ശരീരം",

  step3Title: "പഴയ മെഡിക്കൽ രേഖകൾ അപ്‌ലോഡ് ചെയ്യുക",
  skipStep: "ടോക്കൺ നേടുക",
  proceedToToken: "തുടരുക",

  tokenGeneratedTitle: "ടോക്കൺ വിജയകരമായി സൃഷ്ടിച്ചു!",
  tokenNumber: "ടോക്കൺ നമ്പർ",
  department: "വകുപ്പ്",
  roomCounter: "മുറിയും കൗണ്ടറും",
  estimatedWait: "പ്രതീക്ഷിക്കുന്ന സമയം",
  minutes: "മിനിറ്റുകൾ",
  printThermalSlip: "🖨️ രസീത് പ്രിന്റ് ചെയ്യുക",
  sendWhatsApp: "📱 വാട്ട്‌സ്ആപ്പിലേക്ക് അയക്കുക",
  trackLiveQueue: "🔍 തത്സമയ ക്യൂ പരിശോധിക്കുക",
  createNewToken: "അടുത്ത രോഗി രജിസ്ട്രേഷൻ",
  liveQueueTitle: "തത്സമയ ഒപിഡി ക്യൂ ബോർഡ്",
};

// -------------------------------------------------------------
// Odia (ଓଡ଼ିଆ)
// -------------------------------------------------------------
const baseOdia: TranslationDictionary = {
  ...baseHindi,
  appTitle: "ସ୍ମାର୍ଟ ଟ୍ରାଇଏଜ୍ ଏବଂ ଓପିଡି ଟୋକନ୍ କିଓସ୍କ",
  emergencyFastTrack: "🚨 ଜରୁରୀକାଳୀନ ସେବା",
  voiceGuide: "ଭଏସ୍ ସହାୟକ",
  kioskHome: "ମୁଖ୍ୟ ପୃଷ୍ଠା",
  selectState: "ରାଜ୍ୟ ଚୟନ କରନ୍ତୁ",
  selectLanguage: "ଭାଷା",

  step1Title: "ରୋଗୀ ପଞ୍ଜୀକରଣ",
  fullName: "ପୂରା ନାମ",
  age: "ବୟସ (ବର୍ଷ)",
  gender: "ଲିଙ୍ଗ",
  male: "ପୁରୁଷ",
  female: "ମହିଳା",
  other: "ଅନ୍ୟାନ୍ୟ",
  phone: "୧୦ ଅଙ୍କ ବିଶିଷ୍ଟ ମୋବାଇଲ୍ ନମ୍ବର",
  nextStep: "ପରବର୍ତ୍ତୀ",
  back: "ପଛକୁ",

  step2Title: "ମାନବ ଶରୀର ଯନ୍ତ୍ରଣା ମାନଚିତ୍ର",
  step2Subtitle: "ଯନ୍ତ୍ରଣା ହେଉଥିବା ଅଙ୍ଗରେ ସ୍ପର୍ଶ କରନ୍ତୁ।",
  frontView: "ଆଗ ଦୃଶ୍ୟ",
  backView: "ପଛ ଦୃଶ୍ୟ",
  selectedZones: "ଚୟନିତ ଅଙ୍ଗ",
  clearSelection: "ସବୁ ହଟାନ୍ତୁ",
  continueToSymptoms: "ଲକ୍ଷଣ ବିବରଣୀ",
  saveSymptoms: "ସାଇତନ୍ତୁ",

  regionHeadNeck: "ମୁଣ୍ଡ ଓ ବେକ",
  regionChest: "ଛାତି ଓ ପଞ୍ଜରାହାଡ଼",
  regionAbdomen: "ପେଟ ଓ ପାଚନତନ୍ତ୍ର",
  regionSpineBack: "ମେରୁଦଣ୍ଡ ଓ ପିଠି",
  regionArms: "ହାତ ଓ କାନ୍ଧ",
  regionPelvis: "କଟି ଓ ପେଲଭିସ୍",
  regionLegsJoints: "ଗୋଡ଼, ଆଣ୍ଠୁ ଓ ଗଣ୍ଠି",
  regionSkinGeneral: "ଚର୍ମ / ସମଗ୍ର ଶରୀର",

  tokenGeneratedTitle: "ଟୋକନ୍ ସଫଳତାର ସହ ଜାରି ହୋଇଛି!",
  tokenNumber: "ଟୋକନ୍ ନମ୍ବର",
  department: "ବିଭାଗ",
  roomCounter: "ରୁମ୍ ଓ କାଉଣ୍ଟର",
  estimatedWait: "ଅନୁମାନିତ ସମୟ",
  minutes: "ମିନିଟ୍",
  printThermalSlip: "🖨️ ରସିଦ୍ ପ୍ରିଣ୍ଟ କରନ୍ତୁ",
  sendWhatsApp: "📱 ହ୍ୱାଟ୍ସଆପ୍‌ରେ ପଠାନ୍ତୁ",
  createNewToken: "ନୂଆ ରୋଗୀ ପଞ୍ଜୀକରଣ",
};

// -------------------------------------------------------------
// Assamese (অসমীয়া)
// -------------------------------------------------------------
const baseAssamese: TranslationDictionary = {
  ...baseBengali,
  appTitle: "স্মাৰ্ট ট্ৰায়াজ আৰু ওপিডি টোকেন কিঅ'স্ক",
  emergencyFastTrack: "🚨 জৰুৰীকালীন সেৱা",
  voiceGuide: "ভইচ সহায়ক",
  kioskHome: "মূল পৃষ্ঠা",
  selectState: "ৰাজ্য বাছক",
  selectLanguage: "ভাষা",

  step1Title: "ৰোগীৰ পঞ্জীয়ন",
  fullName: "সম্পূৰ্ণ নাম",
  age: "বয়স (বছৰ)",
  gender: "লিংগ",
  male: "পুৰুষ",
  female: "মহিলা",
  other: "অন্যান্য",
  phone: "১০ টা সংখ্যাৰ মোবাইল নম্বৰ",
  nextStep: "পৰৱৰ্তী",
  back: "পিছলৈ",

  step2Title: "মানৱ শৰীৰ বিষৰ মানচিত্ৰ",
  step2Subtitle: "বিষ হোৱা স্থানত স্পৰ্শ কৰক।",
  frontView: "আগত দৃশ্য",
  backView: "পিছৰ দৃশ্য",
  selectedZones: "নিৰ্বাচিত অংশ",
  clearSelection: "সকলো আঁতৰাওক",
  continueToSymptoms: "লক্ষণৰ বিৱৰণ",
  saveSymptoms: "সংৰক্ষণ কৰক",

  regionHeadNeck: "মূৰ আৰু ডিঙি",
  regionChest: "বুকু আৰু কামিহাড়",
  regionAbdomen: "পেট আৰু পাচনতন্ত্ৰ",
  regionSpineBack: "মেৰুদণ্ড আৰু পিঠি",
  regionArms: "হাত আৰু কান্ধ",
  regionPelvis: "কঁকাল আৰু শ্ৰোণী",
  regionLegsJoints: "ভৰি, আঁঠু আৰু গাঁঠি",
  regionSkinGeneral: "ছাল / সমগ্ৰ শৰীৰ",

  tokenGeneratedTitle: "টোকেন সফলতাৰে প্ৰস্তুত কৰা হ'ল!",
  tokenNumber: "টোকেন নম্বৰ",
  department: "বিভাগ",
  roomCounter: "কোঠা আৰু কাউণ্টাৰ",
  estimatedWait: "আনুমানিক সময়",
  minutes: "মিনিট",
  printThermalSlip: "🖨️ ৰচিদ প্ৰিণ্ট কৰক",
  sendWhatsApp: "📱 হোৱাটছএপত প্ৰেৰণ কৰক",
  createNewToken: "নতুন ৰোগীৰ পঞ্জীয়ন",
};

// -------------------------------------------------------------
// Urdu (اردو)
// -------------------------------------------------------------
const baseUrdu: TranslationDictionary = {
  ...baseHindi,
  appTitle: "اسمارٹ ٹرائیج اور او پی ڈی ٹوکن کیوسک",
  emergencyFastTrack: "🚨 ہنگامی سروس",
  voiceGuide: "صوتی معاون",
  kioskHome: "مرکزی صفحہ",
  selectState: "ریاست منتخب کریں",
  selectLanguage: "زبان",

  step1Title: "مریض کا اندراج",
  step1Subtitle: "اپنی تفصیلات درج کریں یا بولیں۔",
  fullName: "پورا نام",
  fullNamePlaceholder: "مثال: رمیش کمار",
  age: "عمر (سال)",
  gender: "جنس",
  male: "مرد",
  female: "عورت",
  other: "دیگر",
  phone: "10 ہندسوں کا موبائل نمبر",
  nextStep: "اگلا",
  back: "پیچھے",

  step2Title: "انسانی جسم درد کا نقشہ",
  step2Subtitle: "درد والے حصے پر چھوئیں۔",
  frontView: "سامنے کا منظر",
  backView: "پیچھے کا منظر",
  selectedZones: "منتخب کردہ حصے",
  clearSelection: "تمام صاف کریں",
  continueToSymptoms: "علامات کی تفصیل",
  saveSymptoms: "محفوظ کریں",

  regionHeadNeck: "سر اور گردن",
  regionChest: "سینہ اور پسلیاں",
  regionAbdomen: "پیٹ اور نظام انہضام",
  regionSpineBack: "ریڑھ کی ہڈی اور کمر",
  regionArms: "بازو اور کندھے",
  regionPelvis: "کمر اور پیڑو",
  regionLegsJoints: "ٹانگیں، گھٹنے اور جوڑ",
  regionSkinGeneral: "جلد / پورا جسم",

  tokenGeneratedTitle: "ٹوکن کامیابی کے ساتھ جاری کیا گیا!",
  tokenNumber: "ٹوکن نمبر",
  department: "شعبہ",
  roomCounter: "کمرہ اور کاؤنٹر",
  estimatedWait: "متوقع وقت",
  minutes: "منٹ",
  printThermalSlip: "🖨️ رسید پرنٹ کریں",
  sendWhatsApp: "📱 واٹس ایپ پر بھیجیں",
  createNewToken: "نیا مریض درج کریں",
};



// -------------------------------------------------------------
// Bodo (बड़ो)
// -------------------------------------------------------------
const baseBodo: TranslationDictionary = {
  ...baseHindi,
  appTitle: "स्मार्ट ट्राइएज आरो ओपिडि टोकन किओस्क (Bodo)",
  appSubtitle: "AI-मददजों गावनि मुं थिसननाय आरो लारि सामलायनाय",
  emergencyFastTrack: "🚨 गोख्रों रैखा",
  voiceGuide: "राव हेफाजाब",
  selectLanguage: "राव",
  step1Title: "मरीज मुं थिसननाय",
  step1Subtitle: "नोंथांनि मोन्दांथि हो नङाब्ला बुं।",
  fullName: "आबुं मुं",
  age: "बैसो (बोसोर)",
  gender: "लिंग",
  male: "हौवा",
  female: "हिनजाव",
  other: "गुबुन",
  phone: "10-अनजिमा मोवाइल नम्बर",
  nextStep: "थांखि / सिगां",
  back: "उनजाय",
  step2Title: "सानाय मोन्दांथि देहा मेप",
  step2Subtitle: "सानाय बाहागोखौ थु।",
  frontView: "सिगांनि नुथाय",
  backView: "उननि नुथाय",
  selectedZones: "सायखनाय बाहागो",
  clearSelection: "गासैबो फोजोब",
  continueToSymptoms: "सानायनि गुवार खौरां",
  regionHeadNeck: "खर\x27 आरो गोदोना",
  regionChest: "बिखा आरो खारै",
  regionAbdomen: "उदै आरो फाचन",
  regionSpineBack: "बिजिर आरो अनान",
  regionArms: "आखाय आरो आथिं",
  regionPelvis: "खांखोर",
  regionLegsJoints: "आथिं आरो जोइन्ट",
  regionSkinGeneral: "बिगुर / गासै देहा",
  tokenGeneratedTitle: "टोकन जाफुंसारै सोमजिखाबाय!",
  tokenNumber: "टोकन अनजिमा",
  department: "बिफान",
  roomCounter: "खथा आरो काउन्टार",
  estimatedWait: "सानमोन्दां सम",
  minutes: "मिनिट",
  printThermalSlip: "🖨️ रसीद प्रिन्ट खालाम",
  sendWhatsApp: "📱 ह्वाट्सएपआव थिनहर",
  createNewToken: "गोदान मरीज थिसन",
};

// -------------------------------------------------------------
// Dogri (डोगरी)
// -------------------------------------------------------------
const baseDogri: TranslationDictionary = {
  ...baseHindi,
  appTitle: "स्मार्ट ट्राइएज ते ओपीडी टोकन कियोस्क (डोगरी)",
  appSubtitle: "एआई-संचालित मरीज पंजीकरण ते कतार प्रबंधन",
  emergencyFastTrack: "🚨 आपातकालीन सेवा",
  voiceGuide: "आवाज सहायक",
  selectLanguage: "बोली / भाषा",
  step1Title: "मरीज पंजीकरण ते पहचान",
  step1Subtitle: "अपणी जानकारी दर्ज करो जां बोलिये दस्सो।",
  fullName: "पूरा नां",
  age: "उमर (साल)",
  gender: "लिंग",
  male: "मर्द",
  female: "जनानी",
  other: "होर",
  phone: "10-अंकी मोबाइल नंबर",
  nextStep: "अग्गे",
  back: "पिच्छे",
  step2Title: "शरीर दा दर्द नक्शा",
  step2Subtitle: "दर्द आले अंगै गी छुओ जां चुनो।",
  frontView: "साम्हने दा रूप",
  backView: "पिच्छला रूप",
  selectedZones: "चुनेदे हिस्से",
  clearSelection: "सब साफ करो",
  continueToSymptoms: "लक्षणें दा विवरण",
  regionHeadNeck: "सिर ते गर्दन",
  regionChest: "छाती ते पसलियां",
  regionAbdomen: "पेट ते पाचन",
  regionSpineBack: "कंड ते मेरुदंड",
  regionArms: "बाहवां ते मोढे",
  regionPelvis: "कमर ते पेल्विस",
  regionLegsJoints: "लत्तां, गोड्डे ते जोड़",
  regionSkinGeneral: "चमड़ी / पूरा शरीर",
  tokenGeneratedTitle: "टोकन सफलतापूर्वक जारी होई गेया!",
  tokenNumber: "टोकन नंबर",
  department: "विभाग",
  roomCounter: "कमरा ते काउंटर",
  estimatedWait: "अनुमानित समां",
  minutes: "मिनट",
  printThermalSlip: "🖨️ पर्ची प्रिंट करो",
  sendWhatsApp: "📱 व्हाट्सऐप पर भेजो",
  createNewToken: "नवां मरीज दर्ज करो",
};

// -------------------------------------------------------------
// Kashmiri (कॉशुर / كٲشُر)
// -------------------------------------------------------------
const baseKashmiri: TranslationDictionary = {
  ...baseUrdu,
  appTitle: "سمارٹ ٹرائیج تہٕ او پی ڈی ٹوکن کیوسک (کٲشُر)",
  appSubtitle: "اے آئی مریض اندراج تہٕ قطار انتظام",
  emergencyFastTrack: "🚨 ہنگامی سروس",
  voiceGuide: "آوازک مددگار",
  selectLanguage: "زبان",
  step1Title: "مریض سند اندراج",
  step1Subtitle: "پنین تفصیٖلات درج کٔریو یا بٲن کٔریو۔",
  fullName: "پوٗرٕ ناو",
  age: "وٲنس (ؤری)",
  gender: "جنس",
  male: "مرد",
  female: "زنان",
  other: "بیاکھ",
  phone: "10 ہندسَن ہند موبائل نمبر",
  nextStep: "برونہہ کن",
  back: "پتھ کن",
  step2Title: "جسمچ دگک نقشہٕ",
  step2Subtitle: "دگ وٲلِس حصَس پؠٹھ کٔریو ٹچ۔",
  frontView: "برونہم نظارہ",
  backView: "پتھم نظارہ",
  selectedZones: "منتخب حصہٕ",
  clearSelection: "سٲری صاف کٔریو",
  continueToSymptoms: "علامتَن ہنز تفصیل",
  regionHeadNeck: "کلہٕ تہٕ گردن",
  regionChest: "سینہٕ تہٕ پسیل",
  regionAbdomen: "میدٕ تہٕ یڈ",
  regionSpineBack: "کمر تہٕ کنڈا",
  regionArms: "اتھٕ تہٕ پیٹھ",
  regionPelvis: "کمر تہٕ چولا",
  regionLegsJoints: "زنگہٕ، کھور تہٕ گوڈٕ",
  regionSkinGeneral: "چمڑٕ / پورٕ جسم",
  tokenGeneratedTitle: "ٹوکن گو کامیابی سان جاری!",
  tokenNumber: "ٹوکن نمبر",
  department: "شعبہٕ",
  roomCounter: "کمرٕ تہٕ کاؤنٹر",
  estimatedWait: "تخمینی وقت",
  minutes: "منٹ",
  printThermalSlip: "🖨️ پرچی پرنٹ کٔریو",
  sendWhatsApp: "📱 واٹس ایپ پؠٹھ سوزیو",
  createNewToken: "نۆو مریض اندراج",
};

// -------------------------------------------------------------
// Konkani (कोंकणी)
// -------------------------------------------------------------
const baseKonkani: TranslationDictionary = {
  ...baseMarathi,
  appTitle: "स्मार्ट ट्रायज आनी ओपीडी टोकन कियोस्क (कोंकणी)",
  appSubtitle: "एआय-सक्षम दुयेंती नोंदणी आनी रांक व्यवस्थापन",
  emergencyFastTrack: "🚨 तातडीची सेवा",
  voiceGuide: "आवाज मार्गदर्शक",
  selectLanguage: "भास",
  step1Title: "दुयेंती नोंदणी आनी वळख",
  step1Subtitle: "तुमची म्हायती बरोव्यात वा उलोवन सांगात.",
  fullName: "पुरें नांव",
  age: "पिराय (वर्सां)",
  gender: "लिंग",
  male: "दादलो",
  female: "बाय्ल",
  other: "हेर",
  phone: "10-आंकडी मोबाईल नंबर",
  nextStep: "मुखार",
  back: "फाटीं",
  step2Title: "कुडीचो दूख नकासो",
  step2Subtitle: "दूख आशिल्ल्या भागाचेर स्पर्श करात.",
  frontView: "मुखलो देखावो",
  backView: "फाटलो देखावो",
  selectedZones: "वेंचून काडिल्ले भाग",
  clearSelection: "सगळें साफ करात",
  continueToSymptoms: "लक्षणांचो तपशील",
  regionHeadNeck: "तकली आनी गळो",
  regionChest: "छाती आनी फासळ्यो",
  regionAbdomen: "पोट आनी पचन",
  regionSpineBack: "फाटीचो कणा आनी फाट",
  regionArms: "हात आनी खांदे",
  regionPelvis: "कमर आनी पेल्विस",
  regionLegsJoints: "पांय, दिम आनी सांदे",
  regionSkinGeneral: "कात / पुराय कूड",
  tokenGeneratedTitle: "टोकन येशस्वीपणान जारी केलो!",
  tokenNumber: "टोकन नंबर",
  department: "विभाग",
  roomCounter: "कूड आनी काउंटर",
  estimatedWait: "अंदाजीत वेळ",
  minutes: "मिनटां",
  printThermalSlip: "🖨️ पावती प्रिंट करात",
  sendWhatsApp: "📱 व्हॉट्सअ‍ॅपाचेर धाडांत",
  createNewToken: "नवो दुयेंती नोंद करात",
};

// -------------------------------------------------------------
// Maithili (मैथिली)
// -------------------------------------------------------------
const baseMaithili: TranslationDictionary = {
  ...baseHindi,
  appTitle: "स्मार्ट ट्राइएज आ ओपीडी टोकन कियोस्क (मैथिली)",
  appSubtitle: "एआई-संचालित रोगी पंजीकरण आ पाँती प्रबंधन",
  emergencyFastTrack: "🚨 आपातकालीन सेवा",
  voiceGuide: "ध्वनि सहायक",
  selectLanguage: "भाषा",
  step1Title: "रोगी पंजीकरण आ पहचान",
  step1Subtitle: "अपन विवरण दर्ज करू वा बोलि कऽ बताऊ।",
  fullName: "पूरा नाम",
  age: "उमिर (वर्ष)",
  gender: "लिंग",
  male: "पुरुष",
  female: "महिला",
  other: "अन्य",
  phone: "10-अंकीय मोबाइल नंबर",
  nextStep: "आगाँ",
  back: "पाछाँ",
  step2Title: "शारीरिक दर्द मानचित्र",
  step2Subtitle: "पीड़ित अंग पर स्पर्श करू वा चुनू।",
  frontView: "आगाँक दृश्य",
  backView: "पाछाँक दृश्य",
  selectedZones: "चुनल गेल भाग",
  clearSelection: "सभटा साफ करू",
  continueToSymptoms: "लक्षण विवरण",
  regionHeadNeck: "माथ आ गर्दन",
  regionChest: "छाती आ पंजर",
  regionAbdomen: "पेट आ पाचन",
  regionSpineBack: "पीठ आ मेरुदंड",
  regionArms: "हाथ आ काँध",
  regionPelvis: "कमर आ पेल्विस",
  regionLegsJoints: "पैर, ठेहुन आ जोड़",
  regionSkinGeneral: "चमड़ा / सम्पूर्ण देह",
  tokenGeneratedTitle: "टोकन सफलतापूर्वक जारी भेल!",
  tokenNumber: "टोकन नंबर",
  department: "विभाग",
  roomCounter: "कोठरी आ काउंटर",
  estimatedWait: "अनुमानित समय",
  minutes: "मिनट",
  printThermalSlip: "🖨️ रसीद प्रिंट करू",
  sendWhatsApp: "📱 व्हाट्सऐप पर पठाउ",
  createNewToken: "नव रोगी दर्ज करू",
};

// -------------------------------------------------------------
// Manipuri (Meitei) (মৈতৈলোন্)
// -------------------------------------------------------------
const baseManipuri: TranslationDictionary = {
  ...baseBengali,
  appTitle: "স্মার্ট ট্রাইয়েজ অমসুং ওপিডি টোকেন কিয়োস্ক (মৈতৈলোন্)",
  appSubtitle: "AI-না শিজিন্নদুনা অনাবা মীওই রেজিষ্ট্রেশন অমসুং লাইরিং শেম্বা",
  emergencyFastTrack: "🚨 অখন্নবা ইমার্জেন্সী",
  voiceGuide: "খোন্থাোক্কী মতেং",
  selectLanguage: "লোন",
  step1Title: "অনাবা মীওই রেজিষ্ট্রেশন",
  step1Subtitle: "নহাক্কী অকুপ্পা মরোলশিং ইখত্লু নত্রগা ঙাংলগা ফোংদোকউ।",
  fullName: "অপূনবা মমিং",
  age: "চহী",
  gender: "লিংগ",
  male: "নুপা",
  female: "নুপী",
  other: "অতোপ্পা",
  phone: "১০-মশিংগী মোবাইল নম্বর",
  nextStep: "মখা তাবা",
  back: "হনবা",
  step2Title: "হকচাংগী নানথিবা মেপ",
  step2Subtitle: "অনাবা মফমদা থুংলগা খল্লু।",
  frontView: "মাংথংবা উইউ",
  backView: "তুংথংবা উইউ",
  selectedZones: "খল্লবা মফমশিং",
  clearSelection: "পুম্নমক মুত্থত্পা",
  continueToSymptoms: "অনাবাগী লক্ষণশিং",
  regionHeadNeck: "কোক অমসুং ঙক",
  regionChest: "থবাক অমসুং য়োকশং",
  regionAbdomen: "পুক অমসুং হকচাংগী কোং",
  regionSpineBack: "নাকোল অমসুং মকু",
  regionArms: "খুৎ অমসুং লেন্থাং",
  regionPelvis: "খবাং অমসুং পেলভিস",
  regionLegsJoints: "খোং, খুউ অমসুং মরু",
  regionSkinGeneral: "উনসা / হকচাং পুম্বদা",
  tokenGeneratedTitle: "টোকেন মায় পাক্না ফংলে!",
  tokenNumber: "টোকেন নম্বর",
  department: "বিভাগ",
  roomCounter: "কা অমসুং কাউন্টার",
  estimatedWait: "চাউরাকপা মতم",
  minutes: "মিনিট",
  printThermalSlip: "🖨️ চে-রসিদ প্রিন্ট তৌবা",
  sendWhatsApp: "📱 হোয়াটসঅ্যাপতা থাবা",
  createNewToken: "অনৌবা অনাবা মীওই হাপ্পা",
};

// -------------------------------------------------------------
// Nepali (नेपाली)
// -------------------------------------------------------------
const baseNepali: TranslationDictionary = {
  ...baseHindi,
  appTitle: "स्मार्ट ट्राइएज र ओपीडी टोकन कियोस्क (नेपाली)",
  appSubtitle: "एआई-संचालित बिरामी दर्ता र पालो व्यवस्थापन",
  emergencyFastTrack: "🚨 आकस्मिक सेवा",
  voiceGuide: "आवाज सहायक",
  selectLanguage: "भाषा",
  step1Title: "बिरामी दर्ता र पहिचान",
  step1Subtitle: "आफ्नो विवरण प्रविष्ट गर्नुहोस् वा बोलेर बताउनुहोस्।",
  fullName: "पूरा नाम",
  age: "उमेर (वर्ष)",
  gender: "लिङ्ग",
  male: "पुरुष",
  female: "महिला",
  other: "अन्य",
  phone: "१०-अङ्कको मोबाइल नम्बर",
  nextStep: "अर्को",
  back: "पछाडि",
  step2Title: "शरीरको दुखाइ नक्सा",
  step2Subtitle: "दुखेको भागमा छुनुहोस् वा सूचीबाट रोज्नुहोस्।",
  frontView: "अगाडिको दृश्य",
  backView: "पछाडिको दृश्य",
  selectedZones: "छानिएका भागहरू",
  clearSelection: "सबै हटाउनुहोस्",
  continueToSymptoms: "लक्षणहरूको विवरण",
  regionHeadNeck: "टाउको र घाँटी",
  regionChest: "छाती र करङ",
  regionAbdomen: "पेट र पाचन",
  regionSpineBack: "ढाड र मेरुदण्ड",
  regionArms: "हात र काँध",
  regionPelvis: "कम्मर र पेल्भिस",
  regionLegsJoints: "खुट्टा, घुँडा र जोर्नी",
  regionSkinGeneral: "छाला / सम्पूर्ण शरीर",
  tokenGeneratedTitle: "टोकन सफलतापूर्वक जारी गरियो!",
  tokenNumber: "टोकन नम्बर",
  department: "विभाग",
  roomCounter: "कोठा र काउन्टर",
  estimatedWait: "अनुमानित समय",
  minutes: "मिनेट",
  printThermalSlip: "🖨️ रसिद प्रिन्ट गर्नुहोस्",
  sendWhatsApp: "📱 ह्वाट्सएपमा पठाउनुहोस्",
  createNewToken: "नयाँ बिरामी दर्ता गर्नुहोस्",
};

// -------------------------------------------------------------
// Sanskrit (संस्कृतम्)
// -------------------------------------------------------------
const baseSanskrit: TranslationDictionary = {
  ...baseHindi,
  appTitle: "स्मार्ट ट्राइएज तथा ओपीडी टोकन कियोस्क (संस्कृतम्)",
  appSubtitle: "कृत्रिमप्रज्ञया रोगी पञ्जीकरणम् तथा क्रमप्रबन्धनम्",
  emergencyFastTrack: "🚨 आपत्कालीन सेवा",
  voiceGuide: "ध्वनिमार्गदर्शकः",
  selectLanguage: "भाषा",
  step1Title: "रोगी पञ्जीकरणम् तथा परिचयः",
  step1Subtitle: "स्वविवरणं लिखन्तु अथवा वदन्तु।",
  fullName: "पूर्णं नाम",
  age: "आयुः (वर्षाणि)",
  gender: "लिङ्गम्",
  male: "पुरुषः",
  female: "महिला",
  other: "अन्यत्",
  phone: "१०-अङ्कीयः चलदूरभाषक्रमाङ्कः",
  nextStep: "अग्रिमम्",
  back: "प्रतिगमनम्",
  step2Title: "शारीरिक वेदना मानचित्रम्",
  step2Subtitle: "वेदनायुक्तं भागं स्पृशन्तु वा चिनुत।",
  frontView: "अग्रदृश्यम्",
  backView: "पृष्ठदृश्यम्",
  selectedZones: "चयनितभागाः",
  clearSelection: "सर्वं दूरीकुरु",
  continueToSymptoms: "लक्षणविवरणम्",
  regionHeadNeck: "शिरः तथा ग्रीवा",
  regionChest: "वक्षःस्थलम् तथा पर्शुकाः",
  regionAbdomen: "उदरम् तथा पाचनतन्त्रम्",
  regionSpineBack: "पृष्ठवंशः तथा पृष्ठम्",
  regionArms: "हस्तौ तथा स्कन्धौ",
  regionPelvis: "कटिः तथा श्रोणिः",
  regionLegsJoints: "पादौ, जानूनी तथा सन्धयः",
  regionSkinGeneral: "त्वचा / समग्रं शरीरम्",
  tokenGeneratedTitle: "टोकन-पत्रं साफल्येन निर्गमितम्!",
  tokenNumber: "टोकन क्रमाङ्कः",
  department: "विभागः",
  roomCounter: "कक्षः तथा गणकपीठम्",
  estimatedWait: "अनुमानितः समयः",
  minutes: "निमेषाः",
  printThermalSlip: "🖨️ पत्रं मुद्रयतु",
  sendWhatsApp: "📱 व्हाट्सऐप-माध्यमेन प्रेषयतु",
  createNewToken: "नवीनरोगी पञ्जीकरणम्",
};

// -------------------------------------------------------------
// Santali (ᱥᱟᱱᱛᱟᱲᱤ / संताली)
// -------------------------------------------------------------
const baseSantali: TranslationDictionary = {
  ...baseHindi,
  appTitle: "ᱥᱢᱟᱨᱴ ᱴᱨᱟᱭᱮᱡᱽ ᱟᱨ ᱚᱯᱤᱰᱤ ᱴᱳᱠᱮᱱ ᱠᱤᱭᱳᱥᱠ (Santali)",
  appSubtitle: "AI ᱛᱮ ᱨᱩᱣᱟᱹ ᱦᱚᱲ ᱧᱩᱛᱩᱢ ᱚᱞ ᱟᱨ ᱞᱟᱭᱤᱱ ᱥᱟᱵ",
  emergencyFastTrack: "🚨 ᱞᱚᱜᱚᱱ ᱜᱚᱲᱚ",
  voiceGuide: "ᱟᱲᱟᱝ ᱜᱚᱲᱚ",
  selectLanguage: "ᱯᱟᱹᱨᱥᱤ",
  step1Title: "ᱨᱩᱣᱟᱹ ᱦᱚᱲ ᱧᱩᱛᱩᱢ ᱚᱞ",
  step1Subtitle: "ᱟᱢᱟᱜ ᱠᱟᱛᱷᱟ ᱚᱞ ᱢᱮ ᱥᱮ ᱞᱟᱹᱭ ᱢᱮ᱾",
  fullName: "ᱯᱩᱨᱟᱹ ᱧᱩᱛᱩᱢ",
  age: "ᱩᱢᱟᱹᱨ (ᱥᱮᱨᱢᱟ)",
  gender: "ᱡᱟᱱᱟᱝ",
  male: "ᱠᱚᱲᱟ",
  female: "ᱠᱩᱲᱤ",
  other: "ᱮᱴᱟᱜ",
  phone: "᱑᱐-ᱮᱞ ᱢᱳᱵᱟᱭᱤᱞ ᱱᱚᱢᱵᱚᱨ",
  nextStep: "ᱞᱟᱦᱟ",
  back: "ᱛᱟᱭᱚᱢ",
  step2Title: "ᱦᱚᱲᱢᱚ ᱦᱟᱹᱥᱩ ᱢᱮᱯ",
  step2Subtitle: "ᱦᱟᱹᱥᱩ ᱦᱟᱹᱴᱤᱧ ᱨᱮ ᱡᱚᱴᱮᱫ ᱢᱮ᱾",
  frontView: "ᱥᱟᱢᱟᱝ ᱧᱮᱞ",
  backView: "ᱛᱟᱭᱚᱢ ᱧᱮᱞ",
  selectedZones: "ᱵᱟᱪᱷᱟᱣ ᱦᱟᱹᱴᱤᱧ",
  clearSelection: "ᱡᱚᱛᱚ ᱜᱤᱰᱤ",
  continueToSymptoms: "ᱞᱚᱠᱷᱭᱚᱱ ᱵᱤᱵᱚᱨᱚᱱ",
  regionHeadNeck: "ᱵᱚᱦᱚᱜ ᱟᱨ ᱦᱚᱴᱚᱜ",
  regionChest: "ᱠᱚᱲᱟᱢ ᱟᱨ ᱯᱟᱹᱧᱡᱚᱨ",
  regionAbdomen: "ᱞᱟᱡ ᱟᱨ ᱦᱚᱡᱚᱢ",
  regionSpineBack: "ᱫᱮᱭᱟ ᱟᱨ ᱡᱟᱝ",
  regionArms: "ᱛᱤ ᱟᱨ ᱛᱟᱨᱮᱱ",
  regionPelvis: "ᱰᱟᱸᱰᱟ ᱟᱨ ᱯᱮᱞᱵᱷᱤᱥ",
  regionLegsJoints: "ᱡᱟᱝᱜᱟ, ᱤᱠᱤᱨ ᱟᱨ ᱡᱚᱲ",
  regionSkinGeneral: "ᱦᱟᱨᱛᱟ / ᱜᱚᱴᱟ ᱦᱚᱲᱢᱚ",
  tokenGeneratedTitle: "ᱴᱳᱠᱮᱱ ᱥᱟᱹᱛ ᱮᱱᱟ!",
  tokenNumber: "ᱴᱳᱠᱮᱱ ᱮᱞ",
  department: "ᱵᱤᱵᱷᱟᱜᱽ",
  roomCounter: "ᱚᱲᱟᱜ ᱟᱨ ᱠᱟᱣᱩᱱᱴᱟᱨ",
  estimatedWait: "ᱟᱢᱫᱟᱡᱽ ᱚᱠᱛᱚ",
  minutes: "ᱴᱤᱲᱤᱡ",
  printThermalSlip: "🖨️ ᱥᱞᱤᱯ ᱪᱷᱟᱯᱟᱭ ᱢᱮ",
  sendWhatsApp: "📱 ᱦᱣᱟᱴᱥᱮᱯ ᱨᱮ ᱵᱷᱮᱡᱟᱭ ᱢᱮ",
  createNewToken: "ᱱᱟᱣᱟ ᱨᱩᱣᱟᱹ ᱦᱚᱲ ᱚᱞ",
};

// -------------------------------------------------------------
// Sindhi (سنڌي / सिन्धी)
// -------------------------------------------------------------
const baseSindhi: TranslationDictionary = {
  ...baseUrdu,
  appTitle: "سمارٽ ٽرائيج ۽ او پي ڊي ٽوڪن ڪيوسڪ (سنڌي)",
  appSubtitle: "اي آءِ مريض رجسٽريشن ۽ قطار انتظام",
  emergencyFastTrack: "🚨 هنگامي سروس",
  voiceGuide: "آواز مددگار",
  selectLanguage: "ٻولي",
  step1Title: "مريض جو اندراج ۽ سڃاڻپ",
  step1Subtitle: "پنهنجا تفصيل داخل ڪريو يا ڳالهايو.",
  fullName: "پورو نالو",
  age: "عمر (سال)",
  gender: "جنس",
  male: "مرد",
  female: "عورت",
  other: "ٻيو",
  phone: "10 انگن وارو موبائل نمبر",
  nextStep: "اڳيان",
  back: "پوئتي",
  step2Title: "جسماني سور جو نقشو",
  step2Subtitle: "سور واري حصي کي ڇهو يا چونڊيو.",
  frontView: "اڳيون ڏيک",
  backView: "پويون ڏيک",
  selectedZones: "چونڊيل حصا",
  clearSelection: "سڀ صاف ڪريو",
  continueToSymptoms: "علامتن جي تفصيل",
  regionHeadNeck: "مٿو ۽ ڳچي",
  regionChest: "ڇاتي ۽ پاسريون",
  regionAbdomen: "پيٽ ۽ هاضمو",
  regionSpineBack: "پٺي ۽ ڪرنگھو",
  regionArms: "هٿ ۽ ڪلها",
  regionPelvis: "ڪمر ۽ چيلهه",
  regionLegsJoints: "ٽنگون، گوڏا ۽ سنڌا",
  regionSkinGeneral: "چمڙي / پورو جسم",
  tokenGeneratedTitle: "ٽوڪن ڪاميابي سان جاري ڪيو ويو!",
  tokenNumber: "ٽوڪن نمبر",
  department: "شعبو",
  roomCounter: "ڪمرو ۽ ڪائونٽر",
  estimatedWait: "اندازي وقت",
  minutes: "منٽ",
  printThermalSlip: "🖨️ رسيد پرنٽ ڪريو",
  sendWhatsApp: "📱 واٽس ايپ تي موڪليو",
  createNewToken: "نئون مريض رجسٽر ڪريو",
};


export const translations: Record<Language, TranslationDictionary> = {
  en: baseEnglish,
  as: baseAssamese,
  bn: baseBengali,
  brx: baseBodo,
  doi: baseDogri,
  gu: baseGujarati,
  hi: baseHindi,
  kn: baseKannada,
  ks: baseKashmiri,
  kok: baseKonkani,
  mai: baseMaithili,
  ml: baseMalayalam,
  mni: baseManipuri,
  mr: baseMarathi,
  ne: baseNepali,
  or: baseOdia,
  pa: basePunjabi,
  sa: baseSanskrit,
  sat: baseSantali,
  sd: baseSindhi,
  ta: baseTamil,
  te: baseTelugu,
  ur: baseUrdu,
};

export interface LanguageMeta {
  code: Language;
  label: string;
  subLabel: string;
  ttsLocale: string;
}

export const ALL_SCHEDULED_LANGUAGES: LanguageMeta[] = [
  { code: "en", label: "English", subLabel: "English", ttsLocale: "en-IN" },
  { code: "hi", label: "हिंदी", subLabel: "Hindi", ttsLocale: "hi-IN" },
  { code: "as", label: "অসমীয়া", subLabel: "Assamese", ttsLocale: "as-IN" },
  { code: "bn", label: "বাংলা", subLabel: "Bengali", ttsLocale: "bn-IN" },
  { code: "brx", label: "बड़ो", subLabel: "Bodo", ttsLocale: "brx-IN" },
  { code: "doi", label: "डोगरी", subLabel: "Dogri", ttsLocale: "doi-IN" },
  { code: "gu", label: "ગુજરાતી", subLabel: "Gujarati", ttsLocale: "gu-IN" },
  { code: "kn", label: "ಕನ್ನಡ", subLabel: "Kannada", ttsLocale: "kn-IN" },
  { code: "ks", label: "कॉशुर / كٲشُر", subLabel: "Kashmiri", ttsLocale: "ks-IN" },
  { code: "kok", label: "कोंकणी", subLabel: "Konkani", ttsLocale: "kok-IN" },
  { code: "mai", label: "मैथिली", subLabel: "Maithili", ttsLocale: "mai-IN" },
  { code: "ml", label: "മലയാളം", subLabel: "Malayalam", ttsLocale: "ml-IN" },
  { code: "mni", label: "মৈতৈলোন্", subLabel: "Manipuri (Meitei)", ttsLocale: "mni-IN" },
  { code: "mr", label: "मराठी", subLabel: "Marathi", ttsLocale: "mr-IN" },
  { code: "ne", label: "नेपाली", subLabel: "Nepali", ttsLocale: "ne-NP" },
  { code: "or", label: "ଓଡ଼ିଆ", subLabel: "Odia", ttsLocale: "or-IN" },
  { code: "pa", label: "ਪੰਜਾਬੀ", subLabel: "Punjabi", ttsLocale: "pa-IN" },
  { code: "sa", label: "संस्कृतम्", subLabel: "Sanskrit", ttsLocale: "sa-IN" },
  { code: "sat", label: "ᱥᱟᱱᱛᱟᱲᱤ", subLabel: "Santali", ttsLocale: "sat-IN" },
  { code: "sd", label: "سنڌي / सिन्धी", subLabel: "Sindhi", ttsLocale: "sd-IN" },
  { code: "ta", label: "தமிழ்", subLabel: "Tamil", ttsLocale: "ta-IN" },
  { code: "te", label: "తెలుగు", subLabel: "Telugu", ttsLocale: "te-IN" },
  { code: "ur", label: "اردو", subLabel: "Urdu", ttsLocale: "ur-IN" },
];

