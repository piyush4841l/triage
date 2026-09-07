"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import {
  AlertOctagon,
  ArrowLeft,
  ArrowRight,
  User,
  Phone,
  Mic,
  MicOff,
  CheckCircle2,
  X,
  CreditCard,
  Fingerprint,
  HeartPulse,
  Check,
  ShieldCheck,
  Lock,
  Loader2,
} from "lucide-react";
import { computeTriage } from "@/lib/triage";
import { addToken, StoredToken } from "@/lib/store";
import { globalSpeechRecognizer } from "@/lib/speech";
import { TokenReceiptModal } from "@/components/token/TokenReceiptModal";
import { WhatsAppDispatchModal } from "@/components/token/WhatsAppDispatchModal";
import { Language, getIdentityLabels } from "@/lib/i18n";
import { speakText } from "@/lib/speech";
import { useLanguage } from "@/lib/language-context";
import { MOCK_ABHA_DATABASE } from "@/lib/mock-abha";

interface EmergencyTexts {
  back: string;
  helpDispatched: string;
  helpDispatchedDesc: string;
  callStretcher: string;
  callStretcherDesc: string;
  fastTrackTitle: string;
  fastTrackSubtitle: string;
  fullName: string;
  namePlaceholder: string;
  mobileNumber: string;
  mobilePlaceholder: string;
  identityLabel: string;
  fillEither: string;
  abhaLabel: string;
  abhaPlaceholder: string;
  aadhaarLabel: string;
  aadhaarPlaceholder: string;
  generateToken: string;
  generating: string;
  confirmTitle: string;
  confirmDesc: (c: number) => string;
  cancel: string;
  confirm: string;
}

const EMERGENCY_TEXTS: Record<Language, EmergencyTexts> = {
  en: {
    back: "Back",
    helpDispatched: "Help is on the way!",
    helpDispatchedDesc: "A stretcher / wheelchair has been dispatched. Please fill in your details below.",
    callStretcher: "Call a Stretcher / Wheelchair",
    callStretcherDesc: "Tap to dispatch immediate physical assistance to your location",
    fastTrackTitle: "Patient Details",
    fastTrackSubtitle: "Fill details while help arrives",
    fullName: "Full Name",
    namePlaceholder: "e.g. Ramesh Kumar",
    mobileNumber: "Mobile Number",
    mobilePlaceholder: "10-digit mobile number",
    identityLabel: "ABHA ID / Aadhaar Number",
    fillEither: "(Fill either one)",
    abhaLabel: "ABHA ID (14 digits)",
    abhaPlaceholder: "e.g. 14-8890-4432-1102",
    aadhaarLabel: "Aadhaar Number (12 digits)",
    aadhaarPlaceholder: "12-digit Aadhaar",
    generateToken: "Generate Token",
    generating: "Generating...",
    confirmTitle: "Call a Stretcher?",
    confirmDesc: (c) => `A stretcher / wheelchair will be dispatched to you immediately. Auto-confirming in ${c}s.`,
    cancel: "Cancel",
    confirm: "Confirm",
  },
  hi: {
    back: "पीछे जाएं",
    helpDispatched: "सहायता आ रही है!",
    helpDispatchedDesc: "स्ट्रेचर / व्हीलचेयर रवाना कर दी गई है। कृपया नीचे अपना विवरण भरें।",
    callStretcher: "स्ट्रेचर / व्हीलचेयर बुलाएं",
    callStretcherDesc: "तत्काल सहायता प्राप्त करने के लिए यहां स्पर्श करें",
    fastTrackTitle: "मरीज़ का विवरण",
    fastTrackSubtitle: "सहायता आने तक विवरण दर्ज करें",
    fullName: "पूरा नाम",
    namePlaceholder: "उदा. रमेश कुमार",
    mobileNumber: "मोबाइल नंबर",
    mobilePlaceholder: "10-अंकों का मोबाइल नंबर",
    identityLabel: "आभा आईडी / आधार संख्या",
    fillEither: "(कोई एक भरें)",
    abhaLabel: "आभा आईडी (14 अंक)",
    abhaPlaceholder: "उदा. 14-8890-4432-1102",
    aadhaarLabel: "आधार संख्या (12 अंक)",
    aadhaarPlaceholder: "12-अंकों का आधार",
    generateToken: "टोकन बनाएं",
    generating: "टोकन बन रहा है...",
    confirmTitle: "स्ट्रेचर बुलाएं?",
    confirmDesc: (c) => `स्ट्रेचर / व्हीलचेयर तुरंत भेजी जाएगी। स्वतः पुष्टि ${c} सेकंड में।`,
    cancel: "रद्द करें",
    confirm: "पुष्टि करें",
  },
  as: {
    back: "উভতি যাওক",
    helpDispatched: "সহায়তা আহি আছে!",
    helpDispatchedDesc: "ষ্ট্ৰেচাৰ / হুইলচেয়াৰ প্ৰেৰণ কৰা হৈছে। তলত তথ্য পূৰণ কৰক।",
    callStretcher: "ষ্ট্ৰেচাৰ / হুইলচেয়াৰ মাতক",
    callStretcherDesc: "ক্ষিপ্ৰ সহায় পাবলৈ ইয়াত স্পৰ্শ কৰক",
    fastTrackTitle: "জৰুৰীকালীন ফাষ্ট-ট্ৰেক",
    fastTrackSubtitle: "সহায় অহা পৰ্যন্ত তথ্য পূৰণ কৰক",
    fullName: "সম্পূৰ্ণ নাম",
    namePlaceholder: "যেনে ৰমেশ কুমাৰ",
    mobileNumber: "মোবাইল নম্বৰ",
    mobilePlaceholder: "১০-টা সংখ্যাৰ মোবাইল নম্বৰ",
    identityLabel: "আভা আইডি / আধাৰ নম্বৰ",
    fillEither: "(যিকোনো এটা পূৰণ কৰক)",
    abhaLabel: "আভা আইডি (১৪ টা সংখ্যা)",
    abhaPlaceholder: "যেনে ১৪-৮৮৯০-৪৪৩২-১১০২",
    aadhaarLabel: "আধাৰ নম্বৰ (১২ টা সংখ্যা)",
    aadhaarPlaceholder: "১২ টা সংখ্যাৰ আধাৰ",
    generateToken: "টোকেন সৃষ্টি কৰক",
    generating: "টোকেন সৃষ্টি হৈ আছে...",
    confirmTitle: "ষ্ট্ৰেচাৰ মাতিব নেকি?",
    confirmDesc: (c) => `ষ্ট্ৰেচাৰ / হুইলচেয়াৰ প্ৰেৰণ কৰা হ'ব। ${c} ছেকেণ্ডত নিশ্চিত হ'ব।`,
    cancel: "বাতিল কৰক",
    confirm: "নিশ্চিত কৰক",
  },
  bn: {
    back: "ফিরে যান",
    helpDispatched: "সাহায্য আসছে!",
    helpDispatchedDesc: "স্ট্রেচার / হুইলচেয়ার পাঠানো হয়েছে। নিচে আপনার তথ্য দিন।",
    callStretcher: "স্ট্রেচার / হুইলচেয়ার ডাকুন",
    callStretcherDesc: "তাত্ক্ষণিক শারীরিক সহায়তার জন্য স্পর্শ করুন",
    fastTrackTitle: "জরুরী ফাস্ট-ট্র্যাক",
    fastTrackSubtitle: "সহায়তা আসার পূর্বে তথ্য পূরণ করুন",
    fullName: "পুরো নাম",
    namePlaceholder: "যেমন: রমেশ কুমার",
    mobileNumber: "মোবাইল নম্বর",
    mobilePlaceholder: "১০-ডিজিটের মোবাইল নম্বর",
    identityLabel: "আভা আইডি / আধার নম্বর",
    fillEither: "(যেকোনো একটি দিন)",
    abhaLabel: "আভা আইডি (১৪ ডিজিট)",
    abhaPlaceholder: "যেমন: ১৪-৮৮৯০-৪৪৩২-১১০২",
    aadhaarLabel: "আধার নম্বর (১২ ডিজিট)",
    aadhaarPlaceholder: "১২-ডিজিটের আধার",
    generateToken: "টোকেন তৈরি করুন",
    generating: "টোকেন তৈরি হচ্ছে...",
    confirmTitle: "স্ট্রেচার ডাকবেন?",
    confirmDesc: (c) => `স্ট্রেচার অবিলম্বে পাঠানো হবে। ${c} সেকেন্ডে নিশ্চিত হবে।`,
    cancel: "বাতিল",
    confirm: "নিশ্চিত করুন",
  },
  brx: {
    back: "उलथाय थां",
    helpDispatched: "मदद फैगासिनो दं!",
    helpDispatchedDesc: "स्ट्रेसार / ह्वीलचेयार थिसननाय जाबाय। गाहायाव खौरां थिसन।",
    callStretcher: "स्ट्रेसार / ह्वीलचेयार लिगं",
    callStretcherDesc: "गोख्रों मदद मोननो थाखाय थु",
    fastTrackTitle: "गोख्रों फाहामथाय",
    fastTrackSubtitle: "मदद फैजासिम खौरां थिसन",
    fullName: "आबुं मुं",
    namePlaceholder: "उदा. रमेश कुमार",
    mobileNumber: "मबाइल नम्बर",
    mobilePlaceholder: "१०-अनजिमानि मबाइल",
    identityLabel: "आभा आइदि / आधार नम्बर",
    fillEither: "(मोनसे थिसन)",
    abhaLabel: "आभा आइदि (१४ अनजिमा)",
    abhaPlaceholder: "उदा. १४-८८९०-४४३२-११०२",
    aadhaarLabel: "आधार नम्बर (१२ अनजिमा)",
    aadhaarPlaceholder: "१२-अनजिमानि आधार",
    generateToken: "टोकन बानाय",
    generating: "टोकन बानायगासिनो...",
    confirmTitle: "स्ट्रेसार लिगंनो?",
    confirmDesc: (c) => `स्ट्रेसार गोख्रों हरनाय जागोन। ${c} सेकेन्डआव रोखा जागोन।`,
    cancel: "नेवसि",
    confirm: "रोखा खालाम",
  },
  doi: {
    back: "पिच्छे जाओ",
    helpDispatched: "मदद पौहंची रही ऐ!",
    helpDispatchedDesc: "स्ट्रेचर / व्हीलचेयर भेजी दित्ती गेई ऐ। कृपया हेठ अपना विवरण भरो।",
    callStretcher: "स्ट्रेचर / व्हीलचेयर बुलाओ",
    callStretcherDesc: "फौरी मदद वास्ते एत्थे दबाओ",
    fastTrackTitle: "आपातकालीन फास्ट-ट्रैक",
    fastTrackSubtitle: "मदद औने तगर विवरण भरो",
    fullName: "पूरा नां",
    namePlaceholder: "उदा. रमेश कुमार",
    mobileNumber: "मोबाइल नंबर",
    mobilePlaceholder: "१०-अंकें दा मोबाइल नंबर",
    identityLabel: "आभा आईडी / आधार नंबर",
    fillEither: "(कोई इक्क भरो)",
    abhaLabel: "आभा आईडी (१४ अंक)",
    abhaPlaceholder: "उदा. १४-८८९०-४४३२-११०२",
    aadhaarLabel: "आधार नंबर (१२ अंक)",
    aadhaarPlaceholder: "१२-अंकें दा आधार",
    generateToken: "टोकन बणाओ",
    generating: "टोकन बणी रेहा ऐ...",
    confirmTitle: "स्ट्रेचर बुलाना ऐ?",
    confirmDesc: (c) => `स्ट्रेचर तुरंत भेजेया जाग। ${c} सैकंडें च पक्का होग।`,
    cancel: "रद्द करो",
    confirm: "पक्का करो",
  },
  gu: {
    back: "પાછળ જાઓ",
    helpDispatched: "મદદ આવી રહી છે!",
    helpDispatchedDesc: "સ્ટ્રેચર / વ્હીલચેર મોકલી દેવામાં આવી છે. કૃપા કરીને નીચે તમારી વિગત ભરો.",
    callStretcher: "સ્ટ્રેચર / વ્હીલચેર બોલાવો",
    callStretcherDesc: "ત્વરિત મદદ માટે અહીં સ્પર્શ કરો",
    fastTrackTitle: "ઇમરજન્સી ફાસ્ટ-ટ્રેક",
    fastTrackSubtitle: "સહાય પહોંચે ત્યાં સુધી વિગત ભરો",
    fullName: "પૂરું નામ",
    namePlaceholder: "દા.ત. રમેશ કુમાર",
    mobileNumber: "મોબાઇલ નંબર",
    mobilePlaceholder: "૧૦-અંકનો મોબાઇલ નંબર",
    identityLabel: "આભા આઈડી / આધાર નંબર",
    fillEither: "(કોઈપણ એક ભરો)",
    abhaLabel: "આભા આઈડી (૧૪ અંક)",
    abhaPlaceholder: "દા.ત. ૧૪-૮૮૯૦-૪૪૩૨-૧૧૦૨",
    aadhaarLabel: "આધાર નંબર (૧૨ અંક)",
    aadhaarPlaceholder: "૧૨-અંકનો આધાર",
    generateToken: "ટોકન બનાવો",
    generating: "ટોકન બની રહ્યો છે...",
    confirmTitle: "સ્ટ્રેચર બોલાવવું છે?",
    confirmDesc: (c) => `સ્ટ્રેચર તાત્કાલિક મોકલવામાં આવશે. ${c} સેકન્ડમાં પુષ્ટિ થશે.`,
    cancel: "રદ કરો",
    confirm: "પુષ્ટિ કરો",
  },
  kn: {
    back: "ಹಿಂದಕ್ಕೆ",
    helpDispatched: "ಸಹಾಯ ಬರುತ್ತಿದೆ!",
    helpDispatchedDesc: "ಸ್ಟ್ರೆಚರ್ / ಗಾಲಿಕುರ್ಚಿಯನ್ನು ಕಳುಹಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಕೆಳಗೆ ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.",
    callStretcher: "ಸ್ಟ್ರೆಚರ್ / ವ್ಹೀಲ್‌ಚೇರ್ ಕರೆಸಿ",
    callStretcherDesc: "ತಕ್ಷಣದ ಭೌತಿಕ ಸಹಾಯಕ್ಕಾಗಿ ಸ್ಪರ್ಶಿಸಿ",
    fastTrackTitle: "ತುರ್ತು ಫಾಸ್ಟ್-ಟ್ರ್ಯಾಕ್",
    fastTrackSubtitle: "ಸಹಾಯ ಬರುವವರೆಗೆ ವಿವರ ಭರ್ತಿ ಮಾಡಿ",
    fullName: "ಪೂರ್ಣ ಹೆಸರು",
    namePlaceholder: "ಉದಾ. ರಮೇಶ್ ಕುಮಾರ್",
    mobileNumber: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    mobilePlaceholder: "೧೦-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    identityLabel: "ಆಭಾ ಐಡಿ / ಆಧಾರ್ ಸಂಖ್ಯೆ",
    fillEither: "(ಯಾವುದಾದರೂ ಒಂದನ್ನು ಭರ್ತಿ ಮಾಡಿ)",
    abhaLabel: "ಆಭಾ ಐಡಿ (೧೪ ಅಂಕಿಗಳು)",
    abhaPlaceholder: "ಉದಾ. ೧೪-೮೮೯೦-೪೪೩೨-೧೧೦೨",
    aadhaarLabel: "ಆಧಾರ್ ಸಂಖ್ಯೆ (೧೨ ಅಂಕಿಗಳು)",
    aadhaarPlaceholder: "೧೨-ಅಂಕಿಯ ಆಧಾರ್",
    generateToken: "ಟೋಕನ್ ರಚಿಸಿ",
    generating: "ಟೋಕನ್ ರಚಿಸಲಾಗುತ್ತಿದೆ...",
    confirmTitle: "ಸ್ಟ್ರೆಚರ್ ಕರೆಯಬೇಕೇ?",
    confirmDesc: (c) => `ಸ್ಟ್ರೆಚರ್ ತಕ್ಷಣ ರವಾನೆಯಾಗುತ್ತದೆ. ${c} ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಖಚಿತವಾಗುತ್ತದೆ.`,
    cancel: "ರದ್ದುಮಾಡಿ",
    confirm: "ದೃಢೀಕರಿಸಿ",
  },
  ks: {
    back: "واپس",
    helpDispatched: "مدد چھُ یوان!",
    helpDispatchedDesc: "سٹریچر / وہیل چیئر چھِ سوزنہٕ آمٕژ۔ مہربانی کٔرِتھ پنہٕ تفصیل درج کٔرِو۔",
    callStretcher: "سٹریچر / وہیل چیئر منگاوِو",
    callStretcherDesc: "فوری مدد خٲطرٕ ژھوو",
    fastTrackTitle: "ایمرجنسی فاسٹ ٹریک",
    fastTrackSubtitle: "مدد واژنہٕ تام تفصیل درج کٔرِو",
    fullName: "پوٗرٕ ناو",
    namePlaceholder: "مثلاً رمیش کمار",
    mobileNumber: "موبائل نمبر",
    mobilePlaceholder: "۱۰-ہندسَن ہُنٛد موبائل نمبر",
    identityLabel: "آبھا آئی ڈی / آدھار نمبر",
    fillEither: "(کانٛہہ اکھ بھٔرِو)",
    abhaLabel: "آبھا آئی ڈی (۱۴ ہندسہٕ)",
    abhaPlaceholder: "مثلاً ۱۴-۸۸۹۰-۴۴۳۲-۱۱۰۲",
    aadhaarLabel: "آدھار نمبر (۱۲ ہندسہٕ)",
    aadhaarPlaceholder: "۱۲-ہندسَن ہُنٛد آدھار",
    generateToken: "ٹوکن بناوِو",
    generating: "ٹوکن بنان چھُ...",
    confirmTitle: "سٹریچر منگاوُن چھا؟",
    confirmDesc: (c) => `سٹریچر یِیہِ فوراً سوزنہٕ۔ ${c} سیکنڈن مَنٛز تصدیق۔`,
    cancel: "منسوخ",
    confirm: "تصدیق",
  },
  kok: {
    back: "फाटीं वचात",
    helpDispatched: "मदत येता!",
    helpDispatchedDesc: "स्ट्रेचर / व्हीलचेअर धाडला. उपकार करून सकयल तुमचो तपशील भरात.",
    callStretcher: "स्ट्रेचर / व्हीलचेअर आपयात",
    callStretcherDesc: "तात्काळ मदती खातीर हांगा दाबा",
    fastTrackTitle: "तातडीची मदत फास्ट-ट्रॅक",
    fastTrackSubtitle: "मदत ये मेरेन तपशील भरात",
    fullName: "पूर्ण नांव",
    namePlaceholder: "उदा. रमेश कुमार",
    mobileNumber: "मोबाईल नंबर",
    mobilePlaceholder: "१०-आंकड्यांचो मोबाईल",
    identityLabel: "आभा आयडी / आधार नंबर",
    fillEither: "(खंयचेंय एक भरात)",
    abhaLabel: "आभा आयडी (१४ आकडे)",
    abhaPlaceholder: "उदा. १४-८८९०-४४३२-११०२",
    aadhaarLabel: "आधार नंबर (१२ आकडे)",
    aadhaarPlaceholder: "१२-आंकड्यांचो आधार",
    generateToken: "टोकन तयार करात",
    generating: "टोकन तयार जाता...",
    confirmTitle: "स्ट्रेचर आपोवचो?",
    confirmDesc: (c) => `स्ट्रेचर तात्काळ धाडटले. ${c} सेकंदांनी खात्री जातली.`,
    cancel: "रद्द करात",
    confirm: "खात्री करात",
  },
  mai: {
    back: "पाछाँ जाउ",
    helpDispatched: "मदद आबि रहल अछि!",
    helpDispatchedDesc: "स्ट्रेचर / व्हीलचेयर पठाओल गेल अछि। कृप्या नीचाँ अपन विवरण भरू।",
    callStretcher: "स्ट्रेचर / व्हीलचेयर बजाउ",
    callStretcherDesc: "तत्काल सहायता लेल एतय स्पर्श करू",
    fastTrackTitle: "आपातकालीन फास्ट-ट्रैक",
    fastTrackSubtitle: "मदद अबैत धरि विवरण भरू",
    fullName: "पूरा नाम",
    namePlaceholder: "उदा. रमेश कुमार",
    mobileNumber: "मोबाइल नंबर",
    mobilePlaceholder: "१०-अंकक मोबाइल नंबर",
    identityLabel: "आभा आईडी / आधार नंबर",
    fillEither: "(कोनो एक भरू)",
    abhaLabel: "आभा आईडी (१४ अंक)",
    abhaPlaceholder: "उदा. १४-८८९०-४४३२-११०२",
    aadhaarLabel: "आधार नंबर (१२ अंक)",
    aadhaarPlaceholder: "१२-अंकक आधार",
    generateToken: "टोकन बनाउ",
    generating: "टोकन बनि रहल अछि...",
    confirmTitle: "स्ट्रेचर बजाबी?",
    confirmDesc: (c) => `स्ट्रेचर तुरंत पठाओल जायत। ${c} सेकंड मे स्वतः पुष्टि।`,
    cancel: "रद्द करू",
    confirm: "पुष्टि करू",
  },
  ml: {
    back: "തിരികെ",
    helpDispatched: "സഹായം ഉടൻ എത്തും!",
    helpDispatchedDesc: "സ്ട്രെച്ചർ / വീൽചെയർ അയച്ചിട്ടുണ്ട്. ദയവായി താഴെ വിവരങ്ങൾ നൽകുക.",
    callStretcher: "സ്ട്രെച്ചർ / വീൽചെയർ വിളിക്കുക",
    callStretcherDesc: "അടിയന്തിര സഹായത്തിനായി സ്പർശിക്കുക",
    fastTrackTitle: "അടിയന്തിര ഫാസ്റ്റ് ട്രാക്ക്",
    fastTrackSubtitle: "സഹായം എത്തുന്നതുവരെ വിവരങ്ങൾ നൽകുക",
    fullName: "പൂർണ്ണമായ പേര്",
    namePlaceholder: "ഉദാ. രമേഷ് കുമാർ",
    mobileNumber: "മൊബൈൽ നമ്പർ",
    mobilePlaceholder: "10 അക്ക മൊബൈൽ നമ്പർ",
    identityLabel: "ആഭാ ഐഡി / ആധാർ നമ്പർ",
    fillEither: "(ഏതെങ്കിലും ഒന്ന് നൽകുക)",
    abhaLabel: "ആഭാ ഐഡി (14 അക്കങ്ങൾ)",
    abhaPlaceholder: "ഉദാ. 14-8890-4432-1102",
    aadhaarLabel: "ആധാർ നമ്പർ (12 അക്കങ്ങൾ)",
    aadhaarPlaceholder: "12 അക്ക ആധാർ",
    generateToken: "ടോക്കൺ സൃഷ്ടിക്കുക",
    generating: "ടോക്കൺ സൃഷ്ടിക്കുന്നു...",
    confirmTitle: "സ്ട്രെച്ചർ വിളിക്കണോ?",
    confirmDesc: (c) => `സ്ട്രെച്ചർ ഉടൻ അയക്കും. ${c} സെക്കൻഡിൽ സ്ഥിരീകരിക്കും.`,
    cancel: "റദ്ദാക്കുക",
    confirm: "സ്ഥിരീകരിക്കുക",
  },
  mni: {
    back: "হন্দোকপা",
    helpDispatched: "মতেং লাক্লি!",
    helpDispatchedDesc: "ষ্ট্রেচর / হুইলচেয়ার থারক্লে। মখাদা নহাক্কী মরোল থাগৎলু।",
    callStretcher: "ষ্ট্রেচর / হুইলচেয়ার কৌবা",
    callStretcherDesc: "খুদক্তা মতেং ফংনবা মসিদা থম্বু",
    fastTrackTitle: "অনাবাগী ৱারোল",
    fastTrackSubtitle: "মতেং য়ৌরক্ত্রিঙৈদা মরোল থাগৎলু",
    fullName: "অপূম্বা মিং",
    namePlaceholder: "খুদম: রমেশ কুমার",
    mobileNumber: "মোবাইল নম্বর",
    mobilePlaceholder: "১০-মপোক মোবাইল নম্বর",
    identityLabel: "আভা আইদি / আধার নম্বর",
    fillEither: "(অমখক থাগৎলু)",
    abhaLabel: "আভা আইদি (১৪ মপোক)",
    abhaPlaceholder: "খুদম: ১৪-৮৮৯০-৪৪৩২-১১০২",
    aadhaarLabel: "আধার নম্বর (১২ মপোক)",
    aadhaarPlaceholder: "১২-মপোক আধার",
    generateToken: "টোকেন শেম্বা",
    generating: "টোকেন শেম্বা চৎথরি...",
    confirmTitle: "ষ্ট্রেচর কৌগদ্রা?",
    confirmDesc: (c) => `ষ্ট্রেচর খুদক্তা থারক্লগনি। সেকেণ্ড ${c} দা লোইশিনগনি।`,
    cancel: "তোকপা",
    confirm: "য়ারকপা",
  },
  mr: {
    back: "मागे जा",
    helpDispatched: "मदत येत आहे!",
    helpDispatchedDesc: "स्ट्रेचर / व्हीलचेअर पाठवली आहे. कृपया खाली आपली माहिती भरा.",
    callStretcher: "स्ट्रेचर / व्हीलचेअर बोलवा",
    callStretcherDesc: "तातडीच्या मदतीसाठी येथे स्पर्श करा",
    fastTrackTitle: "तातडीची मदत फास्ट-ट्रॅक",
    fastTrackSubtitle: "मदत येईपर्यंत माहिती भरा",
    fullName: "पूर्ण नाव",
    namePlaceholder: "उदा. रमेश कुमार",
    mobileNumber: "मोबाईल नंबर",
    mobilePlaceholder: "१०-अंकी मोबाईल नंबर",
    identityLabel: "आभा आयडी / आधार क्रमांक",
    fillEither: "(कोणतेही एक भरा)",
    abhaLabel: "आभा आयडी (१४ अंक)",
    abhaPlaceholder: "उदा. १४-८८९०-४४३२-११०२",
    aadhaarLabel: "आधार क्रमांक (१२ अंक)",
    aadhaarPlaceholder: "१२-अंकी आधार",
    generateToken: "टोकन तयार करा",
    generating: "टोकन तयार होत आहे...",
    confirmTitle: "स्ट्रेचर बोलवायचे आहे का?",
    confirmDesc: (c) => `स्ट्रेचर त्वरित पाठवले जाईल. ${c} सेकंदात आपोआप निश्चित होईल.`,
    cancel: "रद्द करा",
    confirm: "निश्चित करा",
  },
  ne: {
    back: "पछाडि",
    helpDispatched: "सहयोग आउँदैछ!",
    helpDispatchedDesc: "स्ट्रेचर / व्हीलचेयर पठाइएको छ। कृपया तल आफ्नो विवरण भर्नुहोस्।",
    callStretcher: "स्ट्रेचर / व्हीलचेयर बोलाउनुहोस्",
    callStretcherDesc: "तत्काल सहयोगका लागि यहाँ छुनुहोस्",
    fastTrackTitle: "आकस्मिक फास्ट-ट्र्याक",
    fastTrackSubtitle: "सहयोग नआएसम्म विवरण भर्नुहोस्",
    fullName: "पूरा नाम",
    namePlaceholder: "उदा. रमेश कुमार",
    mobileNumber: "मोबाइल नम्बर",
    mobilePlaceholder: "१०-अङ्कको मोबाइल नम्बर",
    identityLabel: "आभा आईडी / आधार नम्बर",
    fillEither: "(कुनै एक भर्नुहोस्)",
    abhaLabel: "आभा आईडी (१४ अङ्क)",
    abhaPlaceholder: "उदा. १४-८८९०-४४३२-११०२",
    aadhaarLabel: "आधार नम्बर (१२ अङ्क)",
    aadhaarPlaceholder: "१२-अङ्कको आधार",
    generateToken: "टोकन बनाउनुहोस्",
    generating: "टोकन बन्दैछ...",
    confirmTitle: "स्ट्रेचर बोलाउने?",
    confirmDesc: (c) => `स्ट्रेचर तुरुन्त पठाइनेछ। ${c} सेकेन्डमा स्वतः पुष्टि हुनेछ।`,
    cancel: "रद्द",
    confirm: "पुष्टि गर्नुहोस्",
  },
  or: {
    back: "ପଛକୁ ଫେରନ୍ତୁ",
    helpDispatched: "ସାହାଯ୍ୟ ଆସୁଅଛି!",
    helpDispatchedDesc: "ଷ୍ଟ୍ରେଚର୍ / ହ୍ଵିଲ୍ ଚେୟାର୍ ପଠାଯାଇଛି। ଦୟାକରି ତଳେ ଆପଣଙ୍କ ବିବରଣୀ ଦିଅନ୍ତୁ।",
    callStretcher: "ଷ୍ଟ୍ରେଚର୍ / ହ୍ଵିଲ୍ ଚେୟାର୍ ଡାକନ୍ତୁ",
    callStretcherDesc: "ତୁରନ୍ତ ଡାକ୍ତରୀ ସାହାଯ୍ୟ ପାଇଁ ସ୍ପର୍ଶ କରନ୍ତୁ",
    fastTrackTitle: "ଜରୁରୀକାଳୀନ ଫାଷ୍ଟ-ଟ୍ରାକ୍",
    fastTrackSubtitle: "ସାହାଯ୍ୟ ପହଞ୍ଚିବା ଯାଏଁ ବିବରଣୀ ଭରନ୍ତୁ",
    fullName: "ପୂରା ନାମ",
    namePlaceholder: "ଯଥା: ରମେଶ କୁମାର",
    mobileNumber: "ମୋବାଇଲ୍ ନମ୍ବର",
    mobilePlaceholder: "୧୦-ଅଙ୍କ ବିଶିଷ୍ଟ ମୋବାଇଲ୍",
    identityLabel: "ଆଭା ଆଇଡି / ଆଧାର ନମ୍ବର",
    fillEither: "(ଯେକୌଣସି ଗୋଟିଏ ଦିଅନ୍ତୁ)",
    abhaLabel: "ଆଭା ଆଇଡି (୧୪ ଅଙ୍କ)",
    abhaPlaceholder: "ଯଥା: ୧୪-୮୮୯୦-୪୪୩୨-୧୧୦୨",
    aadhaarLabel: "ଆଧାର ନମ୍ବର (୧୨ ଅଙ୍କ)",
    aadhaarPlaceholder: "୧୨-ଅଙ୍କ ବିଶିଷ୍ଟ ଆଧାର",
    generateToken: "ଟୋକନ୍ ତିଆରି କରନ୍ତୁ",
    generating: "ଟୋକନ୍ ତିଆରି ହେଉଛି...",
    confirmTitle: "ଷ୍ଟ୍ରେଚର୍ ଡାକିବେ?",
    confirmDesc: (c) => `ଷ୍ଟ୍ରେଚର୍ ତୁରନ୍ତ ପଠାଯିବ। ${c} ସେକେଣ୍ଡରେ ନିଶ୍ଚିତ ହେବ।`,
    cancel: "ବାତିଲ୍ କରନ୍ତୁ",
    confirm: "ନିଶ୍ଚିତ କରନ୍ତୁ",
  },
  pa: {
    back: "ਪਿੱਛੇ ਜਾਓ",
    helpDispatched: "ਮਦਦ ਆ ਰਹੀ ਹੈ!",
    helpDispatchedDesc: "ਸਟ੍ਰੈਚਰ / ਵ੍ਹੀਲਚੇਅਰ ਭੇਜੀ ਗਈ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹੇਠਾਂ ਵੇਰਵੇ ਭਰੋ।",
    callStretcher: "ਸਟ੍ਰੈਚਰ / ਵ੍ਹੀਲਚੇਅਰ ਮੰਗਵਾਓ",
    callStretcherDesc: "ਤੁਰੰਤ ਮਦਦ ਲਈ ਇੱਥੇ ਛੂਹੋ",
    fastTrackTitle: "ਐਮਰਜੈਂਸੀ ਫਾਸਟ-ਟਰੈਕ",
    fastTrackSubtitle: "ਮਦਦ ਆਉਣ ਤੱਕ ਵੇਰਵੇ ਦਰਜ ਕਰੋ",
    fullName: "ਪੂਰਾ ਨਾਮ",
    namePlaceholder: "ਜਿਵੇਂ ਰਮੇਸ਼ ਕੁਮਾਰ",
    mobileNumber: "ਮੋਬਾਈਲ ਨੰਬਰ",
    mobilePlaceholder: "੧੦-ਅੰਕਾਂ ਦਾ ਮੋਬਾਈਲ ਨੰਬਰ",
    identityLabel: "ਆਭਾ ਆਈਡੀ / ਆਧਾਰ ਨੰਬਰ",
    fillEither: "(ਕੋਈ ਇੱਕ ਭਰੋ)",
    abhaLabel: "ਆਭਾ ਆਈਡੀ (੧੪ ਅੰਕ)",
    abhaPlaceholder: "ਜਿਵੇਂ ੧੪-੮੮੯੦-੪੪੩੨-੧੧੦੨",
    aadhaarLabel: "ਆਧਾਰ ਨੰਬਰ (੧੨ ਅੰਕ)",
    aadhaarPlaceholder: "੧੨-ਅੰਕਾਂ ਦਾ ਆਧਾਰ",
    generateToken: "ਟੋਕਨ ਤਿਆਰ ਕਰੋ",
    generating: "ਟੋਕਨ ਬਣ ਰਿਹਾ ਹੈ...",
    confirmTitle: "ਸਟ੍ਰੈਚਰ ਮੰਗਵਾਉਣਾ ਹੈ?",
    confirmDesc: (c) => `ਸਟ੍ਰੈਚਰ ਤੁਰੰਤ ਭੇਜਿਆ ਜਾਵੇਗਾ। ${c} ਸਕਿੰਟਾਂ ਵਿੱਚ ਪੁਸ਼ਟੀ।`,
    cancel: "ਰੱਦ ਕਰੋ",
    confirm: "ਪੁਸ਼ਟੀ ਕਰੋ",
  },
  sa: {
    back: "प्रतिनिवर्तताम्",
    helpDispatched: "सहायता आगच्छति!",
    helpDispatchedDesc: "स्ट्रेचर / चक्रासनं प्रेषितम्। कृपया अधः स्वविवरणं पूरयतु।",
    callStretcher: "स्ट्रेचर / चक्रासनम् आह्वयतु",
    callStretcherDesc: "सद्यः साहाय्यार्थं अत्र स्पृशतु",
    fastTrackTitle: "आपत्कालीन द्रुत-मार्गः",
    fastTrackSubtitle: "सहायतायाः आगमनात् पूर्वं विवरणं लिखतु",
    fullName: "पूर्णं नाम",
    namePlaceholder: "उदा. रमेश कुमारः",
    mobileNumber: "चलदूरभाषसङ्ख्या",
    mobilePlaceholder: "१०-अङ्कीय चलदूरभाषः",
    identityLabel: "आभा परिचयपत्रम् / आधारसङ्ख्या",
    fillEither: "(एकतरं लिखतु)",
    abhaLabel: "आभा परिचयपत्रम् (१४ अङ्काः)",
    abhaPlaceholder: "उदा. १४-८८९०-४४३२-११०२",
    aadhaarLabel: "आधारसङ्ख्या (१२ अङ्काः)",
    aadhaarPlaceholder: "१२-अङ्कीयं आधारपत्रम्",
    generateToken: "टोकन पत्रं सृजतु",
    generating: "टोकन पत्रं निर्मीयते...",
    confirmTitle: "स्ट्रेचर आह्वयतु?",
    confirmDesc: (c) => `स्ट्रेचर शीघ्रं प्रेषयिष्यते। ${c} क्षणाभ्यन्तरे पुष्टिः।`,
    cancel: "निरस्यतु",
    confirm: "दृढीकरोतु",
  },
  sat: {
    back: "ᱛᱟᱭᱚᱢ",
    helpDispatched: "ᱜᱚᱲᱚ ᱦᱤᱡᱩᱜ ᱠᱟᱱᱟ!",
    helpDispatchedDesc: "ᱥᱴᱨᱮᱪᱟᱨ / ᱦᱩᱭᱤᱞᱪᱮᱭᱟᱨ ᱠᱩᱞ ᱮᱱᱟ᱾ ᱞᱟᱛᱟᱨ ᱨᱮ ᱠᱟᱛᱷᱟ ᱚᱞ ᱢᱮ᱾",
    callStretcher: "ᱥᱴᱨᱮᱪᱟᱨ / ᱦᱩᱭᱤᱞᱪᱮᱭᱟᱨ ᱦᱚᱦᱚᱭ ᱢᱮ",
    callStretcherDesc: "ᱞᱚᱜᱚᱱ ᱜᱚᱲᱚ ᱧᱟᱢ ᱞᱟᱹᱜᱤᱫ ᱡᱚᱴᱮᱫ ᱢᱮ",
    fastTrackTitle: "ᱨᱩᱜᱤ ᱵᱟᱵᱚᱛ",
    fastTrackSubtitle: "ᱜᱚᱲᱚ ᱦᱤᱡᱩᱜ ᱫᱷᱟᱹᱵᱤᱡ ᱚᱞ ᱢᱮ",
    fullName: "ᱯᱩᱨᱟᱹ ᱧᱩᱛᱩᱢ",
    namePlaceholder: "ᱡᱮᱞᱮᱠᱟ: ᱨᱚᱢᱮᱥ ᱠᱩᱢᱟᱨ",
    mobileNumber: "ᱢᱳᱵᱟᱭᱤᱞ ᱱᱚᱢᱵᱚᱨ",
    mobilePlaceholder: "᱑᱐-ᱮᱞᱟᱝ ᱢᱳᱵᱟᱭᱤᱞ",
    identityLabel: "ᱟᱵᱷᱟ ᱟᱭᱰᱤ / ᱟᱫᱷᱟᱨ ᱮᱞ",
    fillEither: "(ᱡᱟᱦᱟᱸ ᱢᱤᱫᱴᱟᱝ)",
    abhaLabel: "ᱟᱵᱷᱟ ᱟᱭᱰᱤ (᱑᱔ ᱮᱞ)",
    abhaPlaceholder: "ᱡᱮᱞᱮᱠᱟ: ᱑᱔-᱘᱘᱙᱐-᱔᱔᱓᱒-᱑᱑᱐᱒",
    aadhaarLabel: "ᱟᱫᱷᱟᱨ ᱮᱞ (᱑᱒ ᱮᱞ)",
    aadhaarPlaceholder: "᱑᱒-ᱮᱞ ᱟᱫᱷᱟᱨ",
    generateToken: "ᱴᱳᱠᱮᱱ ᱵᱮᱱᱟᱣ ᱢᱮ",
    generating: "ᱴᱳᱠᱮᱱ ᱵᱮᱱᱟᱜ ᱠᱟᱱᱟ...",
    confirmTitle: "ᱥᱴᱨᱮᱪᱟᱨ ᱦᱚᱦᱚᱭᱟ?",
    confirmDesc: (c) => `ᱥᱴᱨᱮᱪᱟᱨ ᱞᱚᱜᱚᱱ ᱠᱩᱞᱚᱜ-ᱟ᱾ ${c} ᱴᱤᱲᱤᱡ ᱨᱮ ᱴᱷᱟᱹᱣᱠᱟᱹᱜ-ᱟ᱾`,
    cancel: "ᱵᱟᱹᱜᱤ",
    confirm: "ᱴᱷᱟᱹᱣᱠᱟᱹ",
  },
  sd: {
    back: "واپس",
    helpDispatched: "مدد اچي رهي آهي!",
    helpDispatchedDesc: "اسٽريچر / ويل چيئر روانو ڪيو ويو آهي. مهرباني ڪري پنهنجو تفصيل ڀريو.",
    callStretcher: "اسٽريچر / ويل چيئر گهرايو",
    callStretcherDesc: "فوري مدد لاءِ هتي دٻايو",
    fastTrackTitle: "هنگامي فاسٽ ٽريڪ",
    fastTrackSubtitle: "مدد اچڻ تائين تفصيل ڀريو",
    fullName: "پورو نالو",
    namePlaceholder: "مثال طور رميش ڪمار",
    mobileNumber: "موبائيل نمبر",
    mobilePlaceholder: "۱۰-انگ موبائل نمبر",
    identityLabel: "آڀا آءِ ڊي / آڌار نمبر",
    fillEither: "(ڪو هڪ ڀريو)",
    abhaLabel: "آڀا آءِ ڊي (۱۴ انگ)",
    abhaPlaceholder: "مثال طور ۱۴-۸۸۹۰-۴۴۳۲-۱۱۰۲",
    aadhaarLabel: "آڌار نمبر (۱۲ انگ)",
    aadhaarPlaceholder: "۱۲-انگ آڌار",
    generateToken: "ٽوڪن ٺاهيو",
    generating: "ٽوڪن ٺهي رهيو آهي...",
    confirmTitle: "اسٽريچر گهرائڻو آهي؟",
    confirmDesc: (c) => `اسٽريچر فوري طور موڪليو ويندو. ${c} سيڪنڊن ۾ تصديق.`,
    cancel: "رد ڪريو",
    confirm: "تصديق ڪريو",
  },
  ta: {
    back: "பின்செல்க",
    helpDispatched: "உதவி வருகிறது!",
    helpDispatchedDesc: "ஸ்ட்ரெச்சர் / சக்கர நாற்காலி அனுப்பப்பட்டுள்ளது. உங்கள் விவரங்களை கீழே நிரப்பவும்.",
    callStretcher: "ஸ்ட்ரெச்சர் / சக்கர நாற்காலி அழைக்கவும்",
    callStretcherDesc: "உடனடி உதவிக்கு இங்கே தொடவும்",
    fastTrackTitle: "அவசர சிகிச்சை பாஸ்ட்-ட்ராக்",
    fastTrackSubtitle: "உதவி வரும் வரை விவரங்களை உள்ளிடவும்",
    fullName: "முழுப் பெயர்",
    namePlaceholder: "எ.கா. ரமேஷ் குமார்",
    mobileNumber: "மொபைல் எண்",
    mobilePlaceholder: "10-இலக்க மொபைல் எண்",
    identityLabel: "ஆபா ஐடி / ஆதார் எண்",
    fillEither: "(ஏதேனும் ஒன்றை நிரப்பவும்)",
    abhaLabel: "ஆபா ஐடி (14 இலக்கங்கள்)",
    abhaPlaceholder: "எ.கா. 14-8890-4432-1102",
    aadhaarLabel: "ஆதார் எண் (12 இலக்கங்கள்)",
    aadhaarPlaceholder: "12-இலக்க ஆதார்",
    generateToken: "டோக்கன் உருவாக்குக",
    generating: "டோக்கன் உருவாகிறது...",
    confirmTitle: "ஸ்ட்ரெச்சர் அழைக்கவா?",
    confirmDesc: (c) => `ஸ்ட்ரெச்சர் உடனடியாக அனுப்பப்படும். ${c} வினாடிகளில் உறுதிப்படுத்தப்படும்.`,
    cancel: "ரத்து செய்",
    confirm: "உறுதி செய்",
  },
  te: {
    back: "వెనుకకు",
    helpDispatched: "సహాయం వస్తోంది!",
    helpDispatchedDesc: "స్ట్రెచర్ / వీల్‌చైర్ పంపబడింది. దయచేసి క్రింద మీ వివరాలను నమోదు చేయండి.",
    callStretcher: "స్ట్రెచర్ / వీల్‌చైర్ పిలవండి",
    callStretcherDesc: "తక్షణ సహాయం కోసం ఇక్కడ తాకండి",
    fastTrackTitle: "అత్యవసర ఫాస్ట్ ట్రాక్",
    fastTrackSubtitle: "సహాయం వచ్చే వరకు వివరాలు నమోదు చేయండి",
    fullName: "పూర్తి పేరు",
    namePlaceholder: "ఉదా. రమేష్ కుమార్",
    mobileNumber: "మొబైల్ నంబర్",
    mobilePlaceholder: "10-అంకెల మొబైల్ నంబర్",
    identityLabel: "ఆభా ఐడీ / ఆధార్ సంఖ్య",
    fillEither: "(ఏదైనా ఒకటి నింపండి)",
    abhaLabel: "ఆభా ఐడీ (14 అంకెలు)",
    abhaPlaceholder: "ఉదా. 14-8890-4432-1102",
    aadhaarLabel: "ఆధార్ సంఖ్య (12 అంకెలు)",
    aadhaarPlaceholder: "12-అంకెల ఆధార్",
    generateToken: "టోకెన్ సృష్టించండి",
    generating: "టోకెన్ సృష్టిస్తోంది...",
    confirmTitle: "స్ట్రెచర్ పిలవాలా?",
    confirmDesc: (c) => `స్ట్రెచర్ వెంటనే పంపబడుతుంది. ${c} సెకన్లలో ఆటో-కన్ఫర్మ్ అవుతుంది.`,
    cancel: "రద్దు",
    confirm: "ధృవీకరించండి",
  },
  ur: {
    back: "واپس جائیں",
    helpDispatched: "مدد آ رہی ہے!",
    helpDispatchedDesc: "اسٹریچر / وہیل چیئر روانہ کر دی گئی ہے۔ براہ کرم ذیل میں اپنی تفصیلات درج کریں۔",
    callStretcher: "اسٹریچر / وہیل چیئر بلائیں",
    callStretcherDesc: "فوری مدد حاصل کرنے کے لیے یہاں چھوئیں",
    fastTrackTitle: "ایمرجنسی فاسٹ ٹریک",
    fastTrackSubtitle: "مدد پہنچنے تک تفصیلات درج کریں",
    fullName: "پورا نام",
    namePlaceholder: "مثلاً رمیش کمار",
    mobileNumber: "موبائل نمبر",
    mobilePlaceholder: "۱۰-ہندسی موبائل نمبر",
    identityLabel: "آبھا آئی ڈی / آدھار نمبر",
    fillEither: "(کوئی ایک درج کریں)",
    abhaLabel: "آبھا آئی ڈی (۱۴ ہندسے)",
    abhaPlaceholder: "مثلاً ۱۴-۸۸۹०-۴۴۳۲-۱۱۰۲",
    aadhaarLabel: "آدھار نمبر (۱۲ ہندسے)",
    aadhaarPlaceholder: "۱۲-ہندسی آدھار",
    generateToken: "ٹوکن حاصل کریں",
    generating: "ٹوکن بن رہا ہے...",
    confirmTitle: "اسٹریچر بلانا ہے؟",
    confirmDesc: (c) => `اسٹریچر فوری طور پر روانہ کیا جائے گا۔ ${c} سیکنڈ میں تصدیق۔`,
    cancel: "منسوخ کریں",
    confirm: "تصدیق کریں",
  },
};

interface AssistanceOptionTexts {
  title: string;
  desc: (c: number) => string;
  wheelchair: string;
  stretcher: string;
  cancel: string;
  wheelchairDispatched: string;
  stretcherDispatched: string;
  helpDispatchedDesc: string;
  change: string;
}

const ASSISTANCE_TEXTS: Record<Language, AssistanceOptionTexts> = {
  en: {
    title: "Need Assistance?",
    desc: (c) => `Choose wheelchair or stretcher below. Auto-cancelling in ${c}s.`,
    wheelchair: "Wheelchair",
    stretcher: "Stretcher",
    cancel: "Cancel",
    wheelchairDispatched: "Wheelchair Dispatched!",
    stretcherDispatched: "Stretcher Dispatched!",
    helpDispatchedDesc: "Assistance has been dispatched. Please fill in details below.",
    change: "Change",
  },
  hi: {
    title: "सहायता की आवश्यकता है?",
    desc: (c) => `नीचे व्हीलचेयर या स्ट्रेचर चुनें। ${c} सेकंड में स्वतः रद्द।`,
    wheelchair: "व्हीलचेयर",
    stretcher: "स्ट्रेचर",
    cancel: "रद्द करें",
    wheelchairDispatched: "व्हीलचेयर रवाना कर दी गई है!",
    stretcherDispatched: "स्ट्रेचर रवाना कर दिया गया है!",
    helpDispatchedDesc: "सहायता आ रही है। कृपया नीचे अपना विवरण भरें।",
    change: "बदलें",
  },
  as: {
    title: "সহায়তাৰ প্ৰয়োজন নেকি?",
    desc: (c) => `হুইলচেয়াৰ বা ষ্ট্ৰেচাৰ বাছক। ${c} ছেকেণ্ডত স্বয়ংক্ৰিয়ভাৱে বাতিল হ'ব।`,
    wheelchair: "হুইলচেয়াৰ",
    stretcher: "ষ্ট্ৰেচাৰ",
    cancel: "বাতিল কৰক",
    wheelchairDispatched: "হুইলচেয়াৰ প্ৰেৰণ কৰা হৈছে!",
    stretcherDispatched: "ষ্ট্ৰেচাৰ প্ৰেৰণ কৰা হৈছে!",
    helpDispatchedDesc: "সহায়তা আহি আছে। তলত তথ্য পূৰণ কৰক।",
    change: "সলনি কৰক",
  },
  bn: {
    title: "সহায়তার প্রয়োজন?",
    desc: (c) => `হুইলচেয়ার বা স্ট্রেচার বেছে নিন। ${c} সেকেন্ডে স্বয়ংক্রিয়ভাবে বাতিল হবে।`,
    wheelchair: "হুইলচেয়ার",
    stretcher: "স্ট্রেচার",
    cancel: "বাতিল",
    wheelchairDispatched: "হুইলচেয়ার পাঠানো হয়েছে!",
    stretcherDispatched: "স্ট্রেচার পাঠানো হয়েছে!",
    helpDispatchedDesc: "সহায়তা আসছে। নিচে আপনার তথ্য দিন।",
    change: "পরিবর্তন",
  },
  brx: {
    title: "हेफाजाब नांगौ नामा?",
    desc: (c) => `हुइलसियारा एबा स्ट्रेसार सायख'। ${c} सेकेन्डाव दानगारगोन।`,
    wheelchair: "हुइलसियारा",
    stretcher: "स्ट्रेसार",
    cancel: "दानगार",
    wheelchairDispatched: "हुइलसियारा थिसनबाय!",
    stretcherDispatched: "स्ट्रेसार थिसनबाय!",
    helpDispatchedDesc: "हेफाजाब फैगासिनो दं। गाहायाव मुं थिसन।",
    change: "सोलाय",
  },
  doi: {
    title: "मदद चाहिदी ऐ?",
    desc: (c) => `व्हीलचेयर या स्ट्रेचर चुनो। ${c} सेकंडें च अपने आप रद्द।`,
    wheelchair: "व्हीलचेयर",
    stretcher: "स्ट्रेचर",
    cancel: "रद्द करो",
    wheelchairDispatched: "व्हीलचेयर भेजी दित्ती गेई ऐ!",
    stretcherDispatched: "स्ट्रेचर भेजी दित्ता गेआ ऐ!",
    helpDispatchedDesc: "मदद पुज्जने आली ऐ। अपणी तफसील भरो।",
    change: "बदलो",
  },
  gu: {
    title: "સહાયની જરૂર છે?",
    desc: (c) => `વ્હીલચેર અથવા સ્ટ્રેચર પસંદ કરો. ${c} સેકન્ડમાં આપમેળે રદ થશે.`,
    wheelchair: "વ્હીલચેર",
    stretcher: "સ્ટ્રેચર",
    cancel: "રદ કરો",
    wheelchairDispatched: "વ્હીલચેર મોકલી દેવામાં આવી છે!",
    stretcherDispatched: "સ્ટ્રેચર મોકલી દેવામાં આવ્યું છે!",
    helpDispatchedDesc: "સહાય આવી રહી છે. કૃપા કરીને નીચે વિગત ભરો.",
    change: "બદલો",
  },
  kn: {
    title: "ಸಹಾಯ ಬೇಕೇ?",
    desc: (c) => `ಗಾಲಿಕುರ್ಚಿ ಅಥವಾ ಸ್ಟ್ರೆಚರ್ ಆಯ್ಕೆಮಾಡಿ. ${c} ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ರದ್ದಾಗುತ್ತದೆ.`,
    wheelchair: "ಗಾಲಿಕುರ್ಚಿ",
    stretcher: "ಸ್ಟ್ರೆಚರ್",
    cancel: "ರದ್ದುಮಾಡಿ",
    wheelchairDispatched: "ಗಾಲಿಕುರ್ಚಿ ಕಳುಹಿಸಲಾಗಿದೆ!",
    stretcherDispatched: "ಸ್ಟ್ರೆಚರ್ ಕಳುಹಿಸಲಾಗಿದೆ!",
    helpDispatchedDesc: "ಸಹಾಯ ಬರುತ್ತಿದೆ. ದಯವಿಟ್ಟು ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.",
    change: "ಬದಲಾಯಿಸಿ",
  },
  ks: {
    title: "مددٕچ ضرورت چھا؟",
    desc: (c) => `وہیل چیئر یا سٹریچر ژارِو۔ ${c} سؠکنٛڈن منٛز پانہٕ منسوٗخ۔`,
    wheelchair: "وہیل چیئر",
    stretcher: "سٹریچر",
    cancel: "منسوٗخ",
    wheelchairDispatched: "وہیل چیئر آو سوزنہٕ!",
    stretcherDispatched: "سٹریچر آو سوزنہٕ!",
    helpDispatchedDesc: "مدد چھُ یوان۔ بۄنہِ تفصیٖل لؠکھِو۔",
    change: "تبدیٖل",
  },
  kok: {
    title: "मदत जाय?",
    desc: (c) => `व्हीलचेअर वा स्ट्रेचर वेंचून काढा. ${c} सेकंदांनी आपशींच रद्द जातलें.`,
    wheelchair: "व्हीलचेअर",
    stretcher: "स्ट्रेचर",
    cancel: "रद्द करा",
    wheelchairDispatched: "व्हीलचेअर धाडलां!",
    stretcherDispatched: "स्ट्रेचर धाडलां!",
    helpDispatchedDesc: "मदत पावता. सकयल म्हायती भरा.",
    change: "बदला",
  },
  mai: {
    title: "सहायताक आवश्यकता अछि?",
    desc: (c) => `व्हीलचेयर अथवा स्ट्रेचर चुनू। ${c} सेकंडमे स्वतः रद्द।`,
    wheelchair: "व्हीलचेयर",
    stretcher: "स्ट्रेचर",
    cancel: "रद्द करू",
    wheelchairDispatched: "व्हीलचेयर पठाओल गेल!",
    stretcherDispatched: "स्ट्रेचर पठाओल गेल!",
    helpDispatchedDesc: "सहायता आबि रहल अछि। विवरण भरू।",
    change: "बदलू",
  },
  ml: {
    title: "സഹായം ആവശ്യമുണ്ടോ?",
    desc: (c) => `വീൽചെയർ അല്ലെങ്കിൽ സ്ട്രെച്ചർ തിരഞ്ഞെടുക്കുക. ${c} സെക്കൻഡിൽ റദ്ദാകും.`,
    wheelchair: "വീൽചെയർ",
    stretcher: "സ്ട്രെച്ചർ",
    cancel: "റദ്ദാക്കുക",
    wheelchairDispatched: "വീൽചെയർ അയച്ചിട്ടുണ്ട്!",
    stretcherDispatched: "സ്ട്രെച്ചർ അയച്ചിട്ടുണ്ട്!",
    helpDispatchedDesc: "സഹായം എത്തുന്നു. താഴെ വിവരങ്ങൾ പൂരിപ്പിക്കുക.",
    change: "മാറ്റുക",
  },
  mni: {
    title: "তেংবাং মথৌ তাবা?",
    desc: (c) => `হুইলচেয়ার নত্রগা ষ্ট্রেচর খনবীয়ু। ${c} সেকেন্দদা মশানা লেপকনি।`,
    wheelchair: "হুইলচেয়ার",
    stretcher: "ষ্ট্রেচর",
    cancel: "লেপহনবীয়ু",
    wheelchairDispatched: "হুইলচেয়ার থারক্লে!",
    stretcherDispatched: "ষ্ট্রেচর থারক্লে!",
    helpDispatchedDesc: "তেংবাং লাক্লি। মখাদা ৱারোল চনবীয়ু।",
    change: "হোংদোকউ",
  },
  mr: {
    title: "मदतीची आवश्यकता आहे का?",
    desc: (c) => `व्हीलचेअर किंवा स्ट्रेचर निवडा. ${c} सेकंदात आपोआप रद्द होईल.`,
    wheelchair: "व्हीलचेअर",
    stretcher: "स्ट्रेचर",
    cancel: "रद्द करा",
    wheelchairDispatched: "व्हीलचेअर रवाना केली आहे!",
    stretcherDispatched: "स्ट्रेचर रवाना केले आहे!",
    helpDispatchedDesc: "मदत येत आहे. कृपया खाली माहिती भरा.",
    change: "बदला",
  },
  ne: {
    title: "सहयोग चाहिन्छ?",
    desc: (c) => `ह्विलचेयर वा स्ट्रेचर छान्नुहोस्। ${c} सेकेन्डमा स्वतः रद्द हुनेछ।`,
    wheelchair: "ह्विलचेयर",
    stretcher: "स्ट्रेचर",
    cancel: "रद्द गर्नुहोस्",
    wheelchairDispatched: "ह्विलचेयर पठाइयो!",
    stretcherDispatched: "स्ट्रेचर पठाइयो!",
    helpDispatchedDesc: "सहयोग आइपुग्दै छ। विवरण भर्नुहोस्।",
    change: "परिवर्तन",
  },
  or: {
    title: "ସହାୟତା ଆବଶ୍ୟକ କି?",
    desc: (c) => `ହୁଇଲ୍‌ଚେୟାର୍ କିମ୍ବା ଷ୍ଟ୍ରେଚର୍ ଚୟନ କରନ୍ତୁ। ${c} ସେକେଣ୍ଡରେ ଆପେ ବାତିଲ୍ ହେବ।`,
    wheelchair: "ହୁଇଲ୍‌ଚେୟାର୍",
    stretcher: "ଷ୍ଟ୍ରେଚର୍",
    cancel: "ବାତିଲ୍ କରନ୍ତୁ",
    wheelchairDispatched: "ହୁଇଲ୍‌ଚେୟାର୍ ପଠାଗଲା!",
    stretcherDispatched: "ଷ୍ଟ୍ରେଚର୍ ପଠାଗଲା!",
    helpDispatchedDesc: "ସହାୟତା ଆସୁଛି। ତଳେ ବିବରଣୀ ଦିଅନ୍ତୁ।",
    change: "ବଦଳାନ୍ତୁ",
  },
  pa: {
    title: "ਸਹਾਇਤਾ ਦੀ ਲੋੜ ਹੈ?",
    desc: (c) => `ਵ੍ਹੀਲਚੇਅਰ ਜਾਂ ਸਟ੍ਰੈਚਰ ਚੁਣੋ। ${c} ਸਕਿੰਟਾਂ ਵਿੱਚ ਆਪਣੇ ਆਪ ਰੱਦ।`,
    wheelchair: "ਵ੍ਹੀਲਚੇਅਰ",
    stretcher: "ਸਟ੍ਰੈਚਰ",
    cancel: "ਰੱਦ ਕਰੋ",
    wheelchairDispatched: "ਵ੍ਹੀਲਚੇਅਰ ਭੇਜੀ ਗਈ ਹੈ!",
    stretcherDispatched: "ਸਟ੍ਰੈਚਰ ਭੇਜਿਆ ਗਿਆ ਹੈ!",
    helpDispatchedDesc: "ਸਹਾਇਤਾ ਆ ਰਹੀ ਹੈ। ਹੇਠਾਂ ਵੇਰਵੇ ਭਰੋ।",
    change: "ਬਦਲੋ",
  },
  sa: {
    title: "साहाय्यम् आवश्यकम् वा?",
    desc: (c) => `चक्रासनं वा स्ट्रेचर-यानं वृणु। ${c} क्षणाभ्यन्तरे स्वतः निरस्तम्।`,
    wheelchair: "चक्रासनम्",
    stretcher: "स्ट्रेचर-यानम्",
    cancel: "निरस्यताम्",
    wheelchairDispatched: "चक्रासनं प्रेषितम्!",
    stretcherDispatched: "स्ट्रेचर-यानं प्रेषितम्!",
    helpDispatchedDesc: "साहाय्यम् आगच्छति। अधः विवरणं पूरयतु।",
    change: "परिवर्तयतु",
  },
  sat: {
    title: "ᱜᱚᱲᱚ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ?",
    desc: (c) => `ᱦᱩᱭᱤᱞᱪᱮᱭᱟᱨ ᱥᱮ ᱥᱴᱨᱮᱪᱟᱨ ᱵᱟᱪᱷᱟᱣ ᱢᱮ᱾ ${c} ᱴᱤᱲᱤᱡ ᱨᱮ ᱟᱯᱱᱟᱨ ᱛᱮ ᱵᱟᱹᱛᱤᱞᱚᱜᱼᱟ᱾`,
    wheelchair: "ᱦᱩᱭᱤᱞᱪᱮᱭᱟᱨ",
    stretcher: "ᱥᱴᱨᱮᱪᱟᱨ",
    cancel: "ᱵᱟᱹᱛᱤᱞ",
    wheelchairDispatched: "ᱦᱩᱭᱤᱞᱪᱮᱭᱟᱨ ᱠᱩᱞ ᱮᱱᱟ!",
    stretcherDispatched: "ᱥᱴᱨᱮᱪᱟᱨ ᱠᱩᱞ ᱮᱱᱟ!",
    helpDispatchedDesc: "ᱜᱚᱲᱚ ᱦᱤᱡᱩᱜ ᱠᱟᱱᱟ᱾ ᱞᱟᱛᱟᱨ ᱨᱮ ᱵᱟᱵᱚᱛ ᱚᱞ ᱢᱮ᱾",
    change: "ᱵᱚᱫᱚᱞ",
  },
  sd: {
    title: "مدد گهرجي؟",
    desc: (c) => `وهيل چيئر يا اسٽريچر چونڊيو. ${c} سيڪنڊن ۾ خود بخود رد.`,
    wheelchair: "وهيل چيئر",
    stretcher: "اسٽريچر",
    cancel: "رد ڪريو",
    wheelchairDispatched: "وهيل چيئر موڪلي وئي آهي!",
    stretcherDispatched: "اسٽريچر موڪليو ويو آهي!",
    helpDispatchedDesc: "مدد اچي رهي آهي. مهرباني ڪري تفصيل لکو.",
    change: "تبديل",
  },
  ta: {
    title: "உதவி தேவையா?",
    desc: (c) => `சக்கர நாற்காலி அல்லது ஸ்ட்ரெச்சரைத் தேர்ந்தெடுக்கவும். ${c} வினாடிகளில் தானாக ரத்தாகும்.`,
    wheelchair: "சக்கர நாற்காலி",
    stretcher: "ஸ்ட்ரெச்சர்",
    cancel: "ரத்துசெய்",
    wheelchairDispatched: "சக்கர நாற்காலி அனுப்பப்பட்டது!",
    stretcherDispatched: "ஸ்ட்ரெச்சர் அனுப்பப்பட்டது!",
    helpDispatchedDesc: "உதவி வருகிறது. தயவுசெய்து உங்கள் விவரங்களை கீழே நிரப்பவும்.",
    change: "மாற்று",
  },
  te: {
    title: "సహాయం కావాలా?",
    desc: (c) => `వీల్‌చైర్ లేదా స్ట్రెచర్ ఎంచుకోండి. ${c} సెకన్లలో స్వయంచాలకంగా రద్దు అవుతుంది.`,
    wheelchair: "వీల్‌చైర్",
    stretcher: "స్ట్రెచర్",
    cancel: "రద్దు చేయండి",
    wheelchairDispatched: "వీల్‌చైర్ పంపబడింది!",
    stretcherDispatched: "స్ట్రెచర్ పంపబడింది!",
    helpDispatchedDesc: "సహాయం వస్తోంది. దయచేసి క్రింద వివరాలు నమోదు చేయండి.",
    change: "మార్చండి",
  },
  ur: {
    title: "مدد کی ضرورت ہے؟",
    desc: (c) => `وہیل چیئر یا اسٹریچر منتخب کریں۔ ${c} سیکنڈ میں خود بخود منسوخ۔`,
    wheelchair: "وہیل چیئر",
    stretcher: "اسٹریچر",
    cancel: "منسوخ کریں",
    wheelchairDispatched: "وہیل چیئر بھیج دی گئی ہے!",
    stretcherDispatched: "اسٹریچر بھیج دیا گیا ہے!",
    helpDispatchedDesc: "مدد پہنچ رہی ہے۔ براہ کرم نیچے تفصیل درج کریں۔",
    change: "تبدیل",
  },
};

// Recreated locally from visual reference screenshots
function WheelchairIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="10.5" cy="4.2" r="2" fill="currentColor" stroke="none" />
      <path d="M10.2 7.5c-.2 1.2-.5 2.5-.8 3.8 1.4 0 2.8 0 4.2 0" strokeWidth="2.2" />
      <path d="M10 9.2h4.2" strokeWidth="2" />
      <path d="M5.5 8h2l1.4 5.5h4.5l2 4.5h2.6" />
      <circle cx="8.5" cy="15.5" r="4.8" strokeWidth="1.8" />
      <circle cx="8.5" cy="15.5" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="15.2" cy="19" r="1.2" fill="currentColor" stroke="none" />
      <path d="M13.2 16.5l2 2.5" />
    </svg>
  );
}

function StretcherIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="6" cy="6.5" r="1.8" fill="currentColor" stroke="none" />
      <path d="M3.5 8.5l2-2" />
      <path d="M7.2 8.5c1.5-1 3.5-.8 5 .2l6.5.3" strokeWidth="2.2" />
      <path d="M11 6.5h4.5v2" strokeWidth="1.5" />
      <rect x="2.5" y="10" width="19" height="2.2" rx="1.1" fill="currentColor" stroke="none" />
      <path d="M6.5 12.2l11 5" />
      <path d="M17.5 12.2l-11 5" />
      <path d="M4.5 17.2h15" />
      <circle cx="5.5" cy="19.5" r="1.6" strokeWidth="1.6" />
      <circle cx="18.5" cy="19.5" r="1.6" strokeWidth="1.6" />
    </svg>
  );
}

export default function EmergencyPage() {
  const router = useRouter();
  const { lang, setLang } = useLanguage();
  const t = EMERGENCY_TEXTS[lang] || EMERGENCY_TEXTS.en;
  const assistText = ASSISTANCE_TEXTS[lang] || ASSISTANCE_TEXTS.en;
  const idLabels = getIdentityLabels(lang);

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

  const [stretcherCalled, setStretcherCalled] = useState(false);
  const [assistanceType, setAssistanceType] = useState<"wheelchair" | "stretcher" | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [idType, setIdType] = useState<"abha" | "aadhaar">("abha");
  const [aadhaarId, setAadhaarId] = useState("");
  const [abhaId, setAbhaId] = useState("");
  const [isListeningName, setIsListeningName] = useState(false);
  const [isListeningPhone, setIsListeningPhone] = useState(false);
  const [isListeningAbha, setIsListeningAbha] = useState(false);
  const [isListeningAadhaar, setIsListeningAadhaar] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Verification States
  const [isVerified, setIsVerified] = useState(false);
  const [verificationState, setVerificationState] = useState<"idle" | "method_select" | "awaiting_otp" | "awaiting_pass">("idle");
  const [authMethod, setAuthMethod] = useState<"otp" | "pass">("otp");
  const [otpInput, setOtpInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  // Start countdown when confirm popup opens - auto-cancels if timer finishes with no option chosen
  useEffect(() => {
    if (!showConfirm) return;
    setCountdown(10);
    countdownRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          setShowConfirm(false);
          // 10s timer finished with no option selected -> cancel chosen
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [showConfirm]);

  const handleCancelStretcher = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setShowConfirm(false);
    setCountdown(10);
  };

  const handleConfirmAssistance = (type: "wheelchair" | "stretcher") => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setShowConfirm(false);
    setAssistanceType(type);
    setStretcherCalled(true);
  };

  const handleMicName = () => {
    if (isListeningName) {
      globalSpeechRecognizer.stopListening();
      setIsListeningName(false);
      return;
    }
    setIsListeningName(true);
    globalSpeechRecognizer.startListening({
      lang,
      onResult: (transcript) => {
        const sanitized = transcript.replace(/[0-9\u0966-\u096F]/g, "").trim();
        setPatientName(sanitized);
        if (errors.name) {
          const next = { ...errors };
          delete next.name;
          setErrors(next);
        }
        setIsListeningName(false);
      },
      onError: () => setIsListeningName(false),
      onEnd: () => setIsListeningName(false),
    });
  };

  const handleMicPhone = () => {
    if (isListeningPhone) {
      globalSpeechRecognizer.stopListening();
      setIsListeningPhone(false);
      return;
    }
    setIsListeningPhone(true);
    globalSpeechRecognizer.startListening({
      lang,
      onResult: (transcript) => {
        const digits = transcript.replace(/\D/g, "");
        setPhone(digits.length > 0 ? digits.slice(0, 10) : transcript);
        if (errors.phone) {
          const next = { ...errors };
          delete next.phone;
          setErrors(next);
        }
        setIsListeningPhone(false);
      },
      onError: () => setIsListeningPhone(false),
      onEnd: () => setIsListeningPhone(false),
    });
  };

  const handleMicAbha = () => {
    if (isListeningAbha) {
      globalSpeechRecognizer.stopListening();
      setIsListeningAbha(false);
      return;
    }
    setIsListeningAbha(true);
    globalSpeechRecognizer.startListening({
      lang,
      onResult: (transcript) => {
        const formatted = formatAbha(transcript);
        setAbhaId(formatted);
        if (errors.abha) {
          const next = { ...errors };
          delete next.abha;
          setErrors(next);
        }
        setIsListeningAbha(false);
      },
      onError: () => setIsListeningAbha(false),
      onEnd: () => setIsListeningAbha(false),
    });
  };

  const handleMicAadhaar = () => {
    if (isListeningAadhaar) {
      globalSpeechRecognizer.stopListening();
      setIsListeningAadhaar(false);
      return;
    }
    setIsListeningAadhaar(true);
    globalSpeechRecognizer.startListening({
      lang,
      onResult: (transcript) => {
        const digits = transcript.replace(/\D/g, "").slice(0, 12);
        setAadhaarId(digits);
        if (errors.aadhaar) {
          const next = { ...errors };
          delete next.aadhaar;
          setErrors(next);
        }
        setIsListeningAadhaar(false);
      },
      onError: () => setIsListeningAadhaar(false),
      onEnd: () => setIsListeningAadhaar(false),
    });
  };

  const formatAbha = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 14);
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    if (digits.length <= 10) return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}-${digits.slice(10, 14)}`;
  };

  const [generatedToken, setGeneratedToken] = useState<StoredToken | null>(null);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState<boolean>(false);

  const handleStartVerification = () => {
    const cleanId = idType === "abha" ? abhaId.replace(/\D/g, "") : aadhaarId.replace(/\D/g, "");
    const requiredLength = idType === "abha" ? 14 : 12;
    if (cleanId.length !== requiredLength) {
      if (idType === "abha") {
        setErrors((prev) => ({ ...prev, abha: `Please enter full 14 digits first` }));
      } else {
        setErrors((prev) => ({ ...prev, aadhaar: `Please enter full 12 digits first` }));
      }
      return;
    }
    setOtpInput("");
    setPassInput("");
    setVerifyError("");
    setVerificationState("method_select");
  };

  const handleSelectMethod = (method: "otp" | "pass") => {
    setAuthMethod(method);
    setVerifyError("");
    if (method === "otp") {
      setVerificationState("awaiting_otp");
    } else {
      setVerificationState("awaiting_pass");
    }
  };

  const handleVerifyAuth = () => {
    if (authMethod === "otp" && !otpInput.trim()) {
      setVerifyError("Please enter 4-digit OTP");
      return;
    }
    if (authMethod === "pass" && !passInput.trim()) {
        setVerifyError("Please enter your password");
        return;
      }

      if (idType === "abha" && authMethod === "pass") {
        const strippedAbha = abhaId.replace(/\D/g, "");
        const profile = MOCK_ABHA_DATABASE[strippedAbha];
        if (profile && passInput !== profile.password) {
          setVerifyError("Incorrect password");
          return;
        }
      }

      setIsVerifying(true);
    setVerifyError("");
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      setVerificationState("idle");
        if (idType === "abha") {
          const strippedAbha = abhaId.replace(/\D/g, "");
          const profile = MOCK_ABHA_DATABASE[strippedAbha];
          if (profile) {
            setPatientName(profile.name);
            setPhone(profile.phone);
          }
        }
        setErrors((prev) => {
        const next = { ...prev };
        delete next.identity;
        delete next.abha;
        delete next.aadhaar;
        return next;
      });
    }, 600);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!patientName.trim()) {
      e.name = lang === "hi" ? "पूरा नाम आवश्यक है" : (lang === "en" ? "Full name is required." : t.fullName);
    } else if (/[0-9\u0966-\u096F]/.test(patientName)) {
      e.name = lang === "hi" ? "नाम में संख्याएँ नहीं हो सकतीं" : "Patient name cannot contain numbers.";
    }
    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length !== 10) {
      e.phone = lang === "hi" ? "कृपया मान्य 10 अंकों का मोबाइल नंबर दर्ज करें" : (lang === "en" ? "Enter a valid 10-digit mobile number." : t.mobilePlaceholder);
    }
    const cleanAbha = abhaId.replace(/\D/g, "");
    const cleanAadhaar = aadhaarId.replace(/\D/g, "");

    if (idType === "abha") {
      if (!cleanAbha) {
        e.abha = lang === "hi" ? "कृपया 14 अंकों की आभा आईडी दर्ज करें" : (lang === "en" ? "ABHA ID is required." : idLabels.abhaInputLabel);
      } else if (cleanAbha.length !== 14) {
        e.abha = lang === "hi" ? "आभा आईडी 14 अंकों की होनी चाहिए" : (lang === "en" ? "ABHA ID must be exactly 14 digits." : idLabels.abhaInputLabel);
      }
    } else {
      if (!cleanAadhaar) {
        e.aadhaar = lang === "hi" ? "कृपया 12 अंकों का आधार नंबर दर्ज करें" : (lang === "en" ? "Aadhaar Number is required." : idLabels.aadhaarInputLabel);
      } else if (cleanAadhaar.length !== 12) {
        e.aadhaar = lang === "hi" ? "आधार नंबर 12 अंकों का होना चाहिए" : (lang === "en" ? "Aadhaar must be exactly 12 digits." : idLabels.aadhaarInputLabel);
      }
    }
    if (!isVerified) {
      e.identity = lang === "hi" ? "कृपया आगे बढ़ने से पहले पहचान सत्यापित करें" : (lang === "en" ? "Please verify your ID to proceed." : idLabels.verifyModalTitle);
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setIsGenerating(true);

    const effectiveName = patientName.trim();
    const cleanPhone = phone.replace(/\D/g, "");
    const effectivePhone = cleanPhone;
    const cleanAadhaar = aadhaarId.replace(/\D/g, "");
    const effectiveId = idType === "abha"
      ? (abhaId.trim() || undefined)
      : (cleanAadhaar ? `AADHAAR-${cleanAadhaar}` : undefined);

    const triageResult = computeTriage({
      patientName: effectiveName,
      age: 45,
      gender: "Male",
      phone: effectivePhone,
      abhaId: effectiveId,
      selectedRegions: ["chest"],
      selectedOrgans: ["heart"],
      selectedSymptoms: ["chest_pressure_severe"],
      isDontKnow: false,
      painSeverity: 10,
      duration: "today",
      isEmergencyOverride: true,
      emergencyConditionType: "cardiac",
    });

    const newToken: StoredToken = {
      id: triageResult.tokenId,
      result: triageResult,
      input: {
        patientName: effectiveName,
        age: 45,
        gender: "Male",
        phone: effectivePhone,
        abhaId: effectiveId,
        selectedRegions: ["chest"],
        selectedOrgans: ["heart"],
        selectedSymptoms: ["chest_pressure_severe"],
        isDontKnow: false,
        painSeverity: 10,
        duration: "today",
        isEmergencyOverride: true,
        emergencyConditionType: "cardiac",
      },
      status: "WAITING",
      createdAt: new Date().toISOString(),
    };

    addToken(newToken);
    sessionStorage.setItem("emergency_token", JSON.stringify(newToken));
    setGeneratedToken(newToken);
    setIsGenerating(false);
  };

  const inputBase =
    "w-full h-9 sm:h-9.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors text-xs sm:text-sm";

  return (
    <div className="h-screen max-h-screen flex flex-col overflow-hidden">
      <Navbar
        lang={lang}
        onLanguageChange={setLang}
        voiceGuide={voiceGuide}
        onVoiceGuideToggle={setVoiceGuide}
      />

      <main className="flex-1 min-h-0 flex items-center justify-center p-2 sm:p-3 overflow-hidden">
        {generatedToken ? (
          <div className="w-full max-w-4xl my-auto animate-in fade-in zoom-in-95 duration-300">
            <TokenReceiptModal
              token={generatedToken}
              lang={lang}
              voiceGuide={voiceGuide}
              onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
              onReset={() => {
                sessionStorage.removeItem("emergency_token");
                sessionStorage.removeItem("kiosk_session_state");
                setGeneratedToken(null);
                router.push("/");
              }}
            />

            {isWhatsAppOpen && (
              <WhatsAppDispatchModal
                isOpen={isWhatsAppOpen}
                onClose={() => setIsWhatsAppOpen(false)}
                token={generatedToken}
                lang={lang}
              />
            )}
          </div>
        ) : (
          <div className="w-full max-w-xl my-auto animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-1.5 sm:space-y-2">

            {/* ══════════════════════════════════════
                TOP BOX — Call a Stretcher / Assistance
            ══════════════════════════════════════ */}
            <div className="rounded-2xl bg-red-600 border border-red-500 shadow-md shadow-red-600/20 p-2.5 sm:p-3 relative overflow-hidden transition-all duration-300">
              {stretcherCalled ? (
                /* ── DISPATCHED STATE ── */
                <div className="flex items-center justify-between gap-3 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                      {assistanceType === "wheelchair" ? (
                        <WheelchairIcon className="w-6 h-6 text-white animate-bounce" />
                      ) : (
                        <StretcherIcon className="w-6 h-6 text-white animate-bounce" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        {assistanceType === "wheelchair" ? assistText.wheelchairDispatched : assistText.stretcherDispatched}
                      </h2>
                      <p className="text-red-100 font-medium text-xs mt-0.5">
                        {assistText.helpDispatchedDesc}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStretcherCalled(false);
                      setShowConfirm(true);
                    }}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold transition-colors flex-shrink-0 cursor-pointer"
                  >
                    {assistText.change}
                  </button>
                </div>
              ) : (
                /* ── CALL BUTTON STATE ── */
                <button
                  type="button"
                  onClick={() => setShowConfirm(true)}
                  className="w-full flex items-center gap-3 text-left group active:scale-[0.99] transition-transform"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <HeartPulse className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-tight">
                      {t.callStretcher}
                    </h2>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center flex-shrink-0 transition-colors">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </button>
              )}
            </div>

            {/* ══════════════════════════════════════
                BOTTOM BOX — Patient Details Form
            ══════════════════════════════════════ */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-3 sm:p-3.5 space-y-2">

              {/* ── Box Heading: PATIENT DETAILS ── */}
              <div className="text-center pt-0.5 pb-0.5">
                <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-wider uppercase">
                  {idLabels.patientDetailsTitle}
                </h2>
              </div>

              {/* ── Full Name ── */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-red-500" />
                  <span>{t.fullName}</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={patientName}
                    onKeyDown={(e) => {
                      if (/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const sanitized = e.target.value.replace(/[0-9\u0966-\u096F]/g, "");
                      setPatientName(sanitized);
                      if (errors.name) {
                        const next = { ...errors };
                        delete next.name;
                        setErrors(next);
                      }
                    }}
                    placeholder={t.namePlaceholder}
                    className={`${inputBase} pr-10 border ${errors.name ? "border-red-500" : "border-slate-200 dark:border-slate-700 focus:border-red-500"}`}
                  />
                  <button
                    type="button"
                    onClick={handleMicName}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
                      isListeningName ? "bg-red-600 text-white animate-pulse" : "text-slate-400 hover:text-red-600"
                    }`}
                    title="Voice input for Name"
                  >
                    {isListeningName ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>

              {/* ── Mobile Number ── */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-red-500" />
                  <span>{t.mobileNumber}</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setPhone(digits);
                      if (errors.phone) {
                        const next = { ...errors };
                        delete next.phone;
                        setErrors(next);
                      }
                    }}
                    placeholder={t.mobilePlaceholder}
                    className={`${inputBase} pr-10 border ${errors.phone ? "border-red-500" : "border-slate-200 dark:border-slate-700 focus:border-red-500"}`}
                  />
                  <button
                    type="button"
                    onClick={handleMicPhone}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
                      isListeningPhone ? "bg-red-600 text-white animate-pulse" : "text-slate-400 hover:text-red-600"
                    }`}
                    title="Voice input for Mobile Number"
                  >
                    {isListeningPhone ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
              </div>

              {/* ── Selectable ABHA ID or Aadhaar Option ── */}
              <div className="space-y-2">
                {/* Toggle buttons: Select ABHA ID or Aadhaar */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIdType("abha");
                      setAadhaarId("");
                      setIsVerified(false);
                      if (errors.identity || errors.aadhaar) {
                        const next = { ...errors };
                        delete next.identity;
                        delete next.aadhaar;
                        setErrors(next);
                      }
                    }}
                    className={`h-9 sm:h-9.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
                      idType === "abha"
                        ? "bg-red-600 text-white shadow-red-600/30 ring-2 ring-red-400"
                        : "bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-red-500 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{idLabels.abhaTab}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIdType("aadhaar");
                      setAbhaId("");
                      setIsVerified(false);
                      if (errors.identity || errors.abha) {
                        const next = { ...errors };
                        delete next.identity;
                        delete next.abha;
                        setErrors(next);
                      }
                    }}
                    className={`h-9 sm:h-9.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
                      idType === "aadhaar"
                        ? "bg-red-600 text-white shadow-red-600/30 ring-2 ring-red-400"
                        : "bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-red-500 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    <Fingerprint className="w-4 h-4" />
                    <span>{idLabels.aadhaarTab}</span>
                  </button>
                </div>

                {/* Conditional Input Box based on selected ID */}
                {idType === "abha" && (
                  <div className="space-y-1 pt-1 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <CreditCard className="w-3 h-3 text-red-500" />
                        <span>{t.abhaLabel}</span>
                      </label>
                      {isListeningAbha && (
                        <span className="text-[10px] text-red-600 font-bold animate-pulse">🎙️ Listening...</span>
                      )}
                    </div>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={abhaId}
                        onChange={(e) => {
                          setAbhaId(formatAbha(e.target.value));
                          setIsVerified(false);
                          if (errors.abha || errors.identity) {
                            const next = { ...errors };
                            delete next.abha;
                            delete next.identity;
                            setErrors(next);
                          }
                        }}
                        maxLength={17}
                        placeholder={t.abhaPlaceholder}
                        className={`${inputBase} pr-28 border ${errors.abha || errors.identity ? "border-red-500" : "border-slate-200 dark:border-slate-700 focus:border-red-500"} tracking-widest`}
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                        {isVerified ? (
                          <span className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-lg text-xs font-bold border border-emerald-300 dark:border-emerald-800 animate-in fade-in">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>{idLabels.verifiedBadge}</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleStartVerification}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-sm active:scale-95 ${
                              abhaId.replace(/\D/g, "").length === 14
                                ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
                                : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600"
                            }`}
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>{idLabels.verifyBtn}</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleMicAbha}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isListeningAbha ? "bg-red-600 text-white animate-pulse" : "text-slate-400 hover:text-red-600"
                          }`}
                          title="Voice input for ABHA ID"
                        >
                          {isListeningAbha ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    {errors.abha && <p className="text-xs text-red-500">{errors.abha}</p>}
                  </div>
                )}

                {idType === "aadhaar" && (
                  <div className="space-y-1 pt-1 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <Fingerprint className="w-3 h-3 text-red-500" />
                        <span>{t.aadhaarLabel}</span>
                      </label>
                      {isListeningAadhaar && (
                        <span className="text-[10px] text-red-600 font-bold animate-pulse">🎙️ Listening...</span>
                      )}
                    </div>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={aadhaarId}
                        onChange={(e) => {
                          setAadhaarId(e.target.value.replace(/\D/g, "").slice(0, 12));
                          setIsVerified(false);
                          if (errors.aadhaar || errors.identity) {
                            const next = { ...errors };
                            delete next.aadhaar;
                            delete next.identity;
                            setErrors(next);
                          }
                        }}
                        maxLength={12}
                        placeholder={t.aadhaarPlaceholder}
                        className={`${inputBase} pr-28 border ${errors.aadhaar || errors.identity ? "border-red-500" : "border-slate-200 dark:border-slate-700 focus:border-red-500"} tracking-widest`}
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                        {isVerified ? (
                          <span className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-lg text-xs font-bold border border-emerald-300 dark:border-emerald-800 animate-in fade-in">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>{idLabels.verifiedBadge}</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleStartVerification}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-sm active:scale-95 ${
                              aadhaarId.replace(/\D/g, "").length === 12
                                ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
                                : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600"
                            }`}
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>{idLabels.verifyBtn}</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleMicAadhaar}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isListeningAadhaar ? "bg-red-600 text-white animate-pulse" : "text-slate-400 hover:text-red-600"
                          }`}
                          title="Voice input for Aadhaar Number"
                        >
                          {isListeningAadhaar ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    {errors.aadhaar && <p className="text-xs text-red-500">{errors.aadhaar}</p>}
                  </div>
                )}

                {errors.identity && <p className="text-xs text-red-500 mt-1">{errors.identity}</p>}
              </div>

            </div>

            {/* Bottom Actions outside the box: Back + Generate Token (when verified) */}
            <div className="flex items-center gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => router.back()}
                className="h-9 sm:h-9.5 px-4 sm:px-5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs sm:text-sm font-bold border border-slate-200 dark:border-slate-800 shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98] flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.back}</span>
              </button>

              {isVerified && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isGenerating}
                  className="flex-1 h-9 sm:h-9.5 px-6 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-60 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300"
                >
                  <span>{isGenerating ? t.generating : t.generateToken}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        )}
      </main>

      {/* ── Assistance (Wheelchair / Stretcher) Confirmation Popup ── */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white dark:bg-slate-900 border-2 border-red-500 rounded-3xl shadow-2xl p-6 sm:p-7 max-w-sm w-full text-center space-y-5 animate-in zoom-in-95 duration-200">

            {/* Icon + Countdown ring */}
            <div className="relative w-24 h-24 mx-auto">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="44" fill="none" stroke="#fee2e2" strokeWidth="6" />
                <circle
                  cx="48" cy="48" r="44"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 44}`}
                  strokeDashoffset={`${2 * Math.PI * 44 * (1 - countdown / 10)}`}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-red-600">{countdown}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">secs</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {assistText.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                {assistText.desc(countdown)}
              </p>
            </div>

            {/* Three Options: Wheelchair, Stretcher, and Cancel */}
            <div className="space-y-2.5 pt-1">
              <div className="grid grid-cols-2 gap-2.5">
                {/* Option 1: Wheelchair */}
                <button
                  type="button"
                  onClick={() => handleConfirmAssistance("wheelchair")}
                  className="flex flex-col items-center justify-center gap-2 p-3.5 sm:p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-red-50 hover:border-red-500 dark:bg-slate-800 dark:hover:bg-red-950/40 dark:hover:border-red-500 text-slate-800 dark:text-white transition-all shadow-sm hover:shadow-md group active:scale-95 cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <WheelchairIcon className="w-6 h-6 stroke-[2.3]" />
                  </div>
                  <span className="font-extrabold text-sm tracking-tight">{assistText.wheelchair}</span>
                </button>

                {/* Option 2: Stretcher */}
                <button
                  type="button"
                  onClick={() => handleConfirmAssistance("stretcher")}
                  className="flex flex-col items-center justify-center gap-2 p-3.5 sm:p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-red-50 hover:border-red-500 dark:bg-slate-800 dark:hover:bg-red-950/40 dark:hover:border-red-500 text-slate-800 dark:text-white transition-all shadow-sm hover:shadow-md group active:scale-95 cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <StretcherIcon className="w-6 h-6 stroke-[2.3]" />
                  </div>
                  <span className="font-extrabold text-sm tracking-tight">{assistText.stretcher}</span>
                </button>
              </div>

              {/* Option 3: Cancel */}
              <button
                type="button"
                onClick={handleCancelStretcher}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs sm:text-sm active:scale-98 cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>{assistText.cancel}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── ABHA / Aadhaar Verification Modal ── */}
      {verificationState !== "idle" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl max-w-sm w-full space-y-4 animate-in zoom-in-95 duration-200">
            {verificationState === "method_select" && (
              <>
                <div className="w-12 h-12 mx-auto rounded-2xl bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {idLabels.verifyModalTitle}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {idType === "abha"
                      ? idLabels.chooseMethodAbha
                      : idLabels.chooseMethodAadhaar}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleSelectMethod("otp")}
                    className="p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-200 transition-all flex flex-col items-center gap-2 group"
                  >
                    <Phone className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                    <span>{idLabels.verifyByOtp}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectMethod("pass")}
                    className="p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-200 transition-all flex flex-col items-center gap-2 group"
                  >
                    <Lock className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                    <span>{idLabels.usePassword}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setVerificationState("idle")}
                  className="w-full text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 pt-1 text-center"
                >
                  {idLabels.cancel}
                </button>
              </>
            )}

            {(verificationState === "awaiting_otp" || verificationState === "awaiting_pass") && (
              <>
                <div className="w-12 h-12 mx-auto rounded-2xl bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center">
                  {verificationState === "awaiting_otp" ? <Phone className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {verificationState === "awaiting_otp" ? idLabels.enterOtpTitle : idLabels.enterPassTitle}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {verificationState === "awaiting_otp"
                      ? idLabels.enterOtpDesc
                      : idLabels.enterPassDesc}
                  </p>
                </div>

                <div className="space-y-2">
                  <input
                    type={verificationState === "awaiting_otp" ? "text" : "password"}
                    value={verificationState === "awaiting_otp" ? otpInput : passInput}
                    onChange={(e) => {
                      if (verificationState === "awaiting_otp") {
                        setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 4));
                      } else {
                        setPassInput(e.target.value);
                      }
                      setVerifyError("");
                    }}
                    maxLength={verificationState === "awaiting_otp" ? 4 : 30}
                    placeholder={verificationState === "awaiting_otp" ? "1234" : "Password"}
                    className="w-full text-center tracking-widest font-mono text-lg sm:text-xl p-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-red-500 focus:outline-none"
                    autoFocus
                  />
                  {verifyError && <p className="text-xs text-red-500 text-center">{verifyError}</p>}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setVerificationState("method_select");
                      setVerifyError("");
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    {idLabels.back}
                  </button>
                  <button
                    type="button"
                    onClick={handleVerifyAuth}
                    disabled={isVerifying}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : idLabels.verifyBtn}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
