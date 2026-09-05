export type BodyRegionId =
  | "head_neck"
  | "chest"
  | "abdomen"
  | "spine_back"
  | "arms"
  | "pelvis"
  | "legs_joints"
  | "skin_general";

export interface SubOrgan {
  id: string;
  nameEn: string;
  nameHi: string;
  icon: string;
  descriptionEn: string;
  descriptionHi: string;
}

export interface SymptomItem {
  id: string;
  nameEn: string;
  nameHi: string;
  isEmergencyIndicator?: boolean;
  departmentAffinity: string; // e.g. "Cardiology", "Pulmonology", "Gastroenterology"
}

export interface BodyRegionData {
  id: BodyRegionId;
  nameEn: string;
  nameHi: string;
  colloquialEn: string;
  colloquialHi: string;
  organs: SubOrgan[];
  commonSymptoms: SymptomItem[];
}

export const BODY_REGIONS: Record<BodyRegionId, BodyRegionData> = {
  chest: {
    id: "chest",
    nameEn: "Chest & Ribcage",
    nameHi: "वक्ष / छाती और पसलियां",
    colloquialEn: "Chest, Heart & Breathing area",
    colloquialHi: "छाती, दिल व फेफड़े का हिस्सा",
    organs: [
      {
        id: "heart",
        nameEn: "Heart / Cardiovascular",
        nameHi: "हृदय / दिल",
        icon: "❤️",
        descriptionEn: "Palpitations, chest pressure, irregular beats",
        descriptionHi: "धड़कन तेज होना, भारीपन, सीने में दबाव",
      },
      {
        id: "lungs",
        nameEn: "Lungs / Respiratory",
        nameHi: "फेफड़े / श्वास नली",
        icon: "🫁",
        descriptionEn: "Breathing difficulty, cough, wheezing",
        descriptionHi: "सांस फूलना, खांसी, सीटी जैसी आवाज",
      },
      {
        id: "ribcage",
        nameEn: "Ribcage & Chest Muscles",
        nameHi: "पसलियां एवं मांसपेशियां",
        icon: "🦴",
        descriptionEn: "Muscular soreness, pain on twisting or breathing",
        descriptionHi: "मांसपेशियों में खिंचाव, मुड़ने पर दर्द",
      },
    ],
    commonSymptoms: [
      { id: "chest_pressure_severe", nameEn: "Severe Crushing Chest Pain", nameHi: "सीने में तीव्र दबाव व जकड़न", isEmergencyIndicator: true, departmentAffinity: "Cardiology" },
      { id: "breathlessness", nameEn: "Difficulty Breathing / Shortness of Breath", nameHi: "सांस लेने में भारी तकलीफ", isEmergencyIndicator: true, departmentAffinity: "Pulmonology" },
      { id: "palpitations", nameEn: "Rapid or Irregular Heartbeat", nameHi: "दिल की तेज या असामान्य धड़कन", departmentAffinity: "Cardiology" },
      { id: "dry_wet_cough", nameEn: "Persistent Dry / Wet Cough", nameHi: "लगातार सूखी या बलगम वाली खांसी", departmentAffinity: "Pulmonology" },
      { id: "burning_chest", nameEn: "Burning Sensation / Acidity in Chest", nameHi: "सीने में जलन व खट्टी डकार", departmentAffinity: "Gastroenterology" },
      { id: "chest_muscle_strain", nameEn: "Rib / Muscle Tenderness", nameHi: "पसलियों या मांसपेशियों में दर्द", departmentAffinity: "General Medicine" },
    ],
  },
  abdomen: {
    id: "abdomen",
    nameEn: "Abdomen & Stomach",
    nameHi: "पेट और पाचन तंत्र",
    colloquialEn: "Stomach, Belly & Digestive system",
    colloquialHi: "पेट, आंतें और पाचन अंग",
    organs: [
      {
        id: "upper_stomach",
        nameEn: "Upper Stomach & Gastric",
        nameHi: "ऊपरी पेट व आमाशय",
        icon: "🥣",
        descriptionEn: "Gastric burning, severe acidity, upper cramps",
        descriptionHi: "पेट में जलन, गैस, ऊपरी हिस्से में मरोड़",
      },
      {
        id: "liver_gallbladder",
        nameEn: "Liver & Gallbladder Area",
        nameHi: "लिवर / पित्ताशय क्षेत्र",
        icon: "🫀",
        descriptionEn: "Right side pain under ribs, nausea, jaundice signs",
        descriptionHi: "दाहिनी पसलियों के नीचे दर्द, पीलिया के लक्षण",
      },
      {
        id: "lower_bowel",
        nameEn: "Lower Abdomen & Intestines",
        nameHi: "निचला पेट व आंतें",
        icon: "🌀",
        descriptionEn: "Loose motions, severe constipation, abdominal cramps",
        descriptionHi: "दस्त, कब्ज, पेट में तेज मरोड़ या ऐंठन",
      },
    ],
    commonSymptoms: [
      { id: "severe_acidity_vomiting", nameEn: "Severe Acidity, Nausea & Vomiting", nameHi: "अत्यधिक एसिडिटी, उल्टी व जी मिचलाना", departmentAffinity: "Gastroenterology" },
      { id: "sharp_stomach_cramps", nameEn: "Sharp Colicky Stomach Pain", nameHi: "पेट में अचानक तेज मरोड़ या दर्द", departmentAffinity: "Gastroenterology" },
      { id: "bloating_gas", nameEn: "Bloating, Fullness & Heavy Gas", nameHi: "पेट फूलना व भारी गैस की समस्या", departmentAffinity: "General Medicine" },
      { id: "loose_motions", nameEn: "Diarrhea / Loose Stools", nameHi: "दस्त / बार-बार पतला शौच", departmentAffinity: "General Medicine" },
      { id: "constipation_pain", nameEn: "Chronic Constipation & Hard Stools", nameHi: "गंभीर कब्ज व पेट साफ न होना", departmentAffinity: "Gastroenterology" },
      { id: "appendix_area_pain", nameEn: "Intense Right Lower Belly Pain", nameHi: "निचले दाहिने पेट में असहनीय दर्द", isEmergencyIndicator: true, departmentAffinity: "General Surgery" },
    ],
  },
  head_neck: {
    id: "head_neck",
    nameEn: "Head, Face & Neck",
    nameHi: "सिर, चेहरा एवं गर्दन",
    colloquialEn: "Headache, Throat, Eyes & Ears",
    colloquialHi: "सिरदर्द, गला, आंखें और कान",
    organs: [
      {
        id: "forehead_brain",
        nameEn: "Forehead & Brain Area",
        nameHi: "माथा व सिर",
        icon: "🧠",
        descriptionEn: "Throbbing headache, migraine, dizziness",
        descriptionHi: "तेज सिरदर्द, माइग्रेन, चक्कर आना",
      },
      {
        id: "throat_tonsils",
        nameEn: "Throat & Tonsils",
        nameHi: "गला व टॉन्सिल",
        icon: "🗣️",
        descriptionEn: "Sore throat, difficulty swallowing, tonsil swelling",
        descriptionHi: "गले में खराश, निगलने में दर्द, टॉन्सिल",
      },
      {
        id: "eyes_ears",
        nameEn: "Eyes, Ears & Sinuses",
        nameHi: "आंख, कान व साइनस",
        icon: "👂",
        descriptionEn: "Ear pain/discharge, blurry vision, eye redness",
        descriptionHi: "कान बहना या दर्द, आंख में लालिमा या धुंधलापन",
      },
    ],
    commonSymptoms: [
      { id: "severe_headache_dizzy", nameEn: "Throbbing Headache & Dizziness", nameHi: "तेज सिरदर्द व चक्कर आना", departmentAffinity: "Neurology" },
      { id: "high_fever_chills", nameEn: "High Fever with Shivering", nameHi: "तेज बुखार व कंपकंपी", departmentAffinity: "General Medicine" },
      { id: "sore_throat_swallowing", nameEn: "Severe Throat Pain / Swallowing Difficulty", nameHi: "गले में तेज दर्द व निगलने में तकलीफ", departmentAffinity: "ENT" },
      { id: "ear_pain_discharge", nameEn: "Ear Pain or Liquid Discharge", nameHi: "कान में दर्द या पानी/मवाद बहना", departmentAffinity: "ENT" },
      { id: "eye_redness_blur", nameEn: "Eye Redness, Itching or Blurry Vision", nameHi: "आंखों में लाली, खुजली या धुंधला दिखना", departmentAffinity: "Ophthalmology" },
      { id: "fainting_seizure", nameEn: "Loss of Consciousness / Seizure", nameHi: "बेहोशी या अचानक दौरा पड़ना", isEmergencyIndicator: true, departmentAffinity: "Neurology" },
    ],
  },
  spine_back: {
    id: "spine_back",
    nameEn: "Spine & Back",
    nameHi: "रीढ़ की हड्डी एवं पीठ",
    colloquialEn: "Upper, Mid & Lower Back pain",
    colloquialHi: "पीठ, कमर व रीढ़ का दर्द",
    organs: [
      {
        id: "cervical_spine",
        nameEn: "Neck & Upper Spine (Cervical)",
        nameHi: "गर्दन व ऊपरी रीढ़",
        icon: "🦯",
        descriptionEn: "Stiff neck, pain shooting to arms",
        descriptionHi: "गर्दन में अकड़न, बांहों में खिंचाव",
      },
      {
        id: "lumbar_lower_back",
        nameEn: "Lower Back & Lumbar Spine",
        nameHi: "निचली कमर व रीढ़",
        icon: "🩻",
        descriptionEn: "Sciatica, lower back spasm, pain while bending",
        descriptionHi: "कमर में लचक, झुकने पर असहनीय दर्द, सायटिका",
      },
    ],
    commonSymptoms: [
      { id: "lower_back_sciatica", nameEn: "Lower Back Pain radiating to Legs (Sciatica)", nameHi: "कमर दर्द जो पैरों तक जाता है (सायटिका)", departmentAffinity: "Orthopedics" },
      { id: "cervical_neck_stiffness", nameEn: "Neck Stiffness & Inability to Move Head", nameHi: "गर्दन में तेज जकड़न व घुमाने में दर्द", departmentAffinity: "Orthopedics" },
      { id: "spine_injury_trauma", nameEn: "Back Injury following Fall / Lift", nameHi: "वजन उठाने या गिरने के बाद पीठ में चोट", isEmergencyIndicator: true, departmentAffinity: "Orthopedics" },
      { id: "chronic_back_ache", nameEn: "Dull Constant Ache while Sitting", nameHi: "बैठने या खड़े रहने पर लगातार पीठ दर्द", departmentAffinity: "General Medicine" },
    ],
  },
  arms: {
    id: "arms",
    nameEn: "Arms, Shoulders & Hands",
    nameHi: "हाथ, कंधे एवं हथेलियां",
    colloquialEn: "Shoulders, Elbows, Wrists & Fingers",
    colloquialHi: "कंधे, कोहनी, कलाई और उंगलियां",
    organs: [
      {
        id: "shoulder_joint",
        nameEn: "Shoulder & Rotator Cuff",
        nameHi: "कंधा व जोड़",
        icon: "💪",
        descriptionEn: "Frozen shoulder, unable to lift arm",
        descriptionHi: "कंधा जाम होना, हाथ ऊपर न उठना",
      },
      {
        id: "elbow_wrist_hands",
        nameEn: "Elbow, Wrist & Fingers",
        nameHi: "कोहनी, कलाई व उंगलियां",
        icon: "🖐️",
        descriptionEn: "Wrist sprain, finger tingling, numbness",
        descriptionHi: "कलाई में मोच, उंगलियों में सुन्नपन या झनझनाहट",
      },
    ],
    commonSymptoms: [
      { id: "frozen_shoulder_pain", nameEn: "Severe Shoulder Stiffness (Unable to raise arm)", nameHi: "कंधे में भारी जकड़न व हाथ न उठना", departmentAffinity: "Orthopedics" },
      { id: "wrist_finger_numbness", nameEn: "Hand Numbness, Tingling or Weakness", nameHi: "हाथ में सुन्नपन, झनझनाहट या कमजोरी", departmentAffinity: "Neurology" },
      { id: "arm_fracture_swelling", nameEn: "Bone Swelling / Possible Fracture after Impact", nameHi: "चोट के बाद हाथ में भारी सूजन या फ्रैक्चर की आशंका", isEmergencyIndicator: true, departmentAffinity: "Orthopedics" },
      { id: "joint_tendon_pain", nameEn: "Elbow / Wrist Sprain & Muscle Strain", nameHi: "कोहनी या कलाई में खिंचाव व दर्द", departmentAffinity: "Orthopedics" },
    ],
  },
  pelvis: {
    id: "pelvis",
    nameEn: "Pelvis, Groin & Urinary",
    nameHi: "श्रोणि, कमर का निचला हिस्सा एवं मूत्र मार्ग",
    colloquialEn: "Hip joints, Groin & Urinary system",
    colloquialHi: "कूल्हे, मूत्र संबंधी व श्रोणि अंग",
    organs: [
      {
        id: "urinary_bladder",
        nameEn: "Urinary System & Bladder",
        nameHi: "मूत्राशय एवं मूत्र मार्ग",
        icon: "💧",
        descriptionEn: "Burning urination, frequent urge, blood in urine",
        descriptionHi: "पेशाब में जलन, बार-बार पेशाब आना, खून आना",
      },
      {
        id: "hip_joints",
        nameEn: "Hip Joints & Pelvic Bone",
        nameHi: "कूल्हे के जोड़",
        icon: "🦴",
        descriptionEn: "Hip stiffness, pain on walking",
        descriptionHi: "चलने पर कूल्हे में दर्द, लंगड़ापन",
      },
    ],
    commonSymptoms: [
      { id: "burning_urination_pain", nameEn: "Burning or Pain while Passing Urine", nameHi: "पेशाब करते समय तेज जलन या दर्द", departmentAffinity: "Urology" },
      { id: "blood_in_urine", nameEn: "Discolored / Blood in Urine", nameHi: "पेशाब में खून या गहरा रंग आना", isEmergencyIndicator: true, departmentAffinity: "Urology" },
      { id: "hip_pelvic_pain", nameEn: "Pelvic / Hip Pain while Standing or Walking", nameHi: "खड़े होने या चलने पर कूल्हे में दर्द", departmentAffinity: "Orthopedics" },
      { id: "frequent_night_urination", nameEn: "Excessive Urination Urge", nameHi: "बार-बार पेशाब जाने की तीव्र इच्छा", departmentAffinity: "General Medicine" },
    ],
  },
  legs_joints: {
    id: "legs_joints",
    nameEn: "Legs, Knees & Feet",
    nameHi: "पैर, घुटने एवं पंजे",
    colloquialEn: "Thighs, Knees, Ankles & Foot joints",
    colloquialHi: "जांघें, घुटने, टखने और पैरों के जोड़",
    organs: [
      {
        id: "knee_joints",
        nameEn: "Knee Joints & Cartilage",
        nameHi: "घुटने के जोड़",
        icon: "🦵",
        descriptionEn: "Arthritis, knee swelling, popping sound, difficulty bending",
        descriptionHi: "गठिया, घुटने में सूजन, चटकने की आवाज, मुड़ने में दर्द",
      },
      {
        id: "ankles_feet",
        nameEn: "Ankles, Heels & Feet",
        nameHi: "टखने, एड़ी एवं तलवे",
        icon: "🦶",
        descriptionEn: "Ankle sprain, heel pain in morning, swollen feet",
        descriptionHi: "टखने में मोच, सुबह एड़ी में चुभन, पैरों में सूजन",
      },
    ],
    commonSymptoms: [
      { id: "knee_osteoarthritis", nameEn: "Severe Knee Pain, Swelling & Difficulty Walking", nameHi: "घुटनों में तेज दर्द, सूजन व चलने में असमर्थता", departmentAffinity: "Orthopedics" },
      { id: "ankle_sprain_injury", nameEn: "Twisted Ankle / Inability to bear weight", nameHi: "पैर मुड़ जाना / वजन न रख पाना", departmentAffinity: "Orthopedics" },
      { id: "foot_burning_numbness", nameEn: "Burning Sensation & Numbness in Feet (Diabetic Neuropathy)", nameHi: "पैरों के तलवों में जलन, सुन्नपन या सूइयां चुभना", departmentAffinity: "General Medicine" },
      { id: "calf_muscle_cramps", nameEn: "Severe Night Calf Muscle Cramps", nameHi: "रात में पिंडलियों में तेज ऐंठन व जकड़न", departmentAffinity: "General Medicine" },
    ],
  },
  skin_general: {
    id: "skin_general",
    nameEn: "Skin & Whole Body",
    nameHi: "त्वचा एवं संपूर्ण शरीर",
    colloquialEn: "Rashes, Itching, Fever & General weakness",
    colloquialHi: "खुजली, दाद, लाल चकत्ते व सामान्य कमजोरी",
    organs: [
      {
        id: "skin_surface",
        nameEn: "Skin Surface & Allergy",
        nameHi: "त्वचा की सतह व एलर्जी",
        icon: "🧴",
        descriptionEn: "Itchy red rashes, fungal patches, hives",
        descriptionHi: "खुजली वाले लाल चकत्ते, फंगल दाद, पित्ती",
      },
      {
        id: "whole_body_vitals",
        nameEn: "General Body & Vital Energy",
        nameHi: "संपूर्ण शरीर व सामान्य ऊर्जा",
        icon: "⚡",
        descriptionEn: "Extreme fatigue, weight loss, chronic low fever",
        descriptionHi: "अत्यधिक कमजोरी, वजन गिरना, हल्का बुखार",
      },
    ],
    commonSymptoms: [
      { id: "skin_rashes_itching", nameEn: "Spreading Red Rashes, Severe Itching or Boils", nameHi: "फैलते हुए लाल चकत्ते, तेज खुजली या फुंसियां", departmentAffinity: "Dermatology" },
      { id: "general_weakness_fatigue", nameEn: "Extreme Lethargy & Whole Body Exhaustion", nameHi: "अत्यधिक थकान, शरीर में भारीपन व कमजोरी", departmentAffinity: "General Medicine" },
      { id: "unexplained_weight_loss", nameEn: "Rapid Unintentional Weight Loss", nameHi: "बिना कारण तेजी से वजन घटना", departmentAffinity: "General Medicine" },
      { id: "severe_allergic_reaction", nameEn: "Sudden Full-Body Hives / Swollen Face", nameHi: "अचानक पूरे शरीर पर पित्ती व चेहरे पर सूजन", isEmergencyIndicator: true, departmentAffinity: "Emergency" },
    ],
  },
};
