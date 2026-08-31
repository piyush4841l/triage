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
} from "lucide-react";
import { computeTriage } from "@/lib/triage";
import { addToken, StoredToken } from "@/lib/store";
import { globalSpeechRecognizer } from "@/lib/speech";
import { TokenReceiptModal } from "@/components/token/TokenReceiptModal";
import { WhatsAppDispatchModal } from "@/components/token/WhatsAppDispatchModal";
import { Language } from "@/lib/i18n";
import { speakText } from "@/lib/speech";
import { useLanguage } from "@/lib/language-context";

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
    fastTrackTitle: "Emergency Fast-Track",
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
    fastTrackTitle: "आपातकालीन फास्ट-ट्रैक",
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
    fastTrackTitle: "ইমার্জেন্সী ফাষ্ট-ট্রেক",
    fastTrackSubtitle: "মতেং য়ৌরক্ত্রিঙৈদা মরোল থাগৎলু",
    fullName: "অপূম্বা মিং",
    namePlaceholder: "খুদম: রমেশ কুমার",
    mobileNumber: "মোবাইল নম্বর",
    mobilePlaceholder: "১০-মপোক মোবাইল নম্বর",
    identityLabel: "ABHA ID / আধার নম্বর",
    fillEither: "(অমখক থাগৎলু)",
    abhaLabel: "ABHA ID (১৪ মপোক)",
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
    fastTrackTitle: "ᱞᱚᱜᱚᱱ ᱜᱚᱲᱚ ᱯᱷᱟᱥᱴ-ᱴᱨᱮᱠ",
    fastTrackSubtitle: "ᱜᱚᱲᱚ ᱦᱤᱡᱩᱜ ᱫᱷᱟᱹᱵᱤᱡ ᱚᱞ ᱢᱮ",
    fullName: "ᱯᱩᱨᱟᱹ ᱧᱩᱛᱩᱢ",
    namePlaceholder: "ᱡᱮᱞᱮᱠᱟ: ᱨᱚᱢᱮᱥ ᱠᱩᱢᱟᱨ",
    mobileNumber: "ᱢᱳᱵᱟᱭᱤᱞ ᱱᱚᱢᱵᱚᱨ",
    mobilePlaceholder: "᱑᱐-ᱮᱞᱟᱝ ᱢᱳᱵᱟᱭᱤᱞ",
    identityLabel: "ABHA ID / ᱟᱫᱷᱟᱨ ᱮᱞ",
    fillEither: "(ᱡᱟᱦᱟᱸ ᱢᱤᱫᱴᱟᱝ)",
    abhaLabel: "ABHA ID (᱑᱔ ᱮᱞ)",
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

export default function EmergencyPage() {
  const router = useRouter();
  const { lang, setLang } = useLanguage();
  const t = EMERGENCY_TEXTS[lang] || EMERGENCY_TEXTS.en;

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
  const [showConfirm, setShowConfirm] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [aadhaarId, setAadhaarId] = useState("");
  const [abhaId, setAbhaId] = useState("");
  const [isListeningName, setIsListeningName] = useState(false);
  const [isListeningPhone, setIsListeningPhone] = useState(false);
  const [isListeningAbha, setIsListeningAbha] = useState(false);
  const [isListeningAadhaar, setIsListeningAadhaar] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Start countdown when confirm popup opens
  useEffect(() => {
    if (!showConfirm) return;
    setCountdown(10);
    countdownRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(countdownRef.current!);
          setShowConfirm(false);
          setStretcherCalled(true);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(countdownRef.current!);
  }, [showConfirm]);

  const handleCancelStretcher = () => {
    clearInterval(countdownRef.current!);
    setShowConfirm(false);
    setCountdown(10);
  };

  const handleConfirmStretcher = () => {
    clearInterval(countdownRef.current!);
    setShowConfirm(false);
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
        setPatientName(transcript.trim());
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

  const validate = () => {
    const e: Record<string, string> = {};
    if (!patientName.trim()) {
      e.name = "Full name is required.";
    }
    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length !== 10) {
      e.phone = "Enter a valid 10-digit mobile number.";
    }
    const cleanAbha = abhaId.replace(/\D/g, "");
    if (!cleanAbha && !aadhaarId.trim()) {
      e.abha = "ABHA ID or Aadhaar number is required.";
    } else if (cleanAbha && cleanAbha.length !== 14) {
      e.abha = "ABHA ID must be exactly 14 digits.";
    }
    if (aadhaarId.trim() && aadhaarId.replace(/\D/g, "").length !== 12) {
      e.aadhaar = "Aadhaar must be exactly 12 digits.";
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
    const effectiveId = abhaId.trim() || (aadhaarId.trim() ? `AADHAAR-${aadhaarId.trim()}` : undefined);

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
    "w-full h-10 sm:h-10.5 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors text-xs sm:text-sm";

  return (
    <div className="h-screen flex flex-col overflow-hidden">
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
          <div className="w-full max-w-xl my-auto animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-2 sm:space-y-2.5">

            {/* Back */}
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.back}</span>
            </button>

            {/* ══════════════════════════════════════
                TOP BOX — Call a Stretcher / Assistance
            ══════════════════════════════════════ */}
            <div className="rounded-2xl bg-red-600 border border-red-500 shadow-md shadow-red-600/20 p-3 sm:p-3.5 relative overflow-hidden transition-all duration-300">
              {stretcherCalled ? (
                /* ── DISPATCHED STATE ── */
                <div className="flex items-center gap-3 animate-in fade-in duration-300">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-white animate-bounce" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      {t.helpDispatched}
                    </h2>
                    <p className="text-red-100 font-medium text-xs mt-0.5">
                      {t.helpDispatchedDesc}
                    </p>
                  </div>
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
                    <p className="text-red-100 font-medium mt-0.5 text-xs">
                      {t.callStretcherDesc}
                    </p>
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
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-3.5 sm:p-4 space-y-2">

              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-100 dark:bg-red-600/20 border border-red-500 flex items-center justify-center animate-pulse flex-shrink-0">
                  <AlertOctagon className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-black text-red-600 dark:text-red-400 tracking-tight">
                    {t.fastTrackTitle}
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t.fastTrackSubtitle}
                  </p>
                </div>
              </div>

              {/* ── Full Name ── */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-red-500" />
                  <span>{t.fullName}</span> <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => {
                      setPatientName(e.target.value);
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
                  <span>{t.mobileNumber}</span> <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
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

              {/* ── Identity Fields — side by side ── */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-red-500" />
                    <span>{t.identityLabel}</span>
                    <span className="text-red-500">*</span>
                    <span className="text-[10px] font-normal text-slate-400 ml-1">
                      {t.fillEither}
                    </span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {/* ABHA ID */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-red-500" />
                      <span>{t.abhaLabel}</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={abhaId}
                        onChange={(e) => {
                          setAbhaId(formatAbha(e.target.value));
                          if (errors.abha || errors.identity) {
                            const next = { ...errors };
                            delete next.abha;
                            delete next.identity;
                            setErrors(next);
                          }
                        }}
                        maxLength={17}
                        placeholder={t.abhaPlaceholder}
                        className={`${inputBase} pr-10 border ${errors.abha || errors.identity ? "border-red-500" : "border-slate-200 dark:border-slate-700 focus:border-red-500"} tracking-widest`}
                      />
                      <button
                        type="button"
                        onClick={handleMicAbha}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
                          isListeningAbha ? "bg-red-600 text-white animate-pulse" : "text-slate-400 hover:text-red-600"
                        }`}
                        title="Voice input for ABHA ID"
                      >
                        {isListeningAbha ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {errors.abha && <p className="text-xs text-red-500">{errors.abha}</p>}
                  </div>

                  {/* Aadhaar */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <Fingerprint className="w-3 h-3 text-red-500" />
                      <span>{t.aadhaarLabel}</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={aadhaarId}
                        onChange={(e) => {
                          setAadhaarId(e.target.value.replace(/\D/g, "").slice(0, 12));
                          if (errors.aadhaar || errors.identity) {
                            const next = { ...errors };
                            delete next.aadhaar;
                            delete next.identity;
                            setErrors(next);
                          }
                        }}
                        maxLength={12}
                        placeholder={t.aadhaarPlaceholder}
                        className={`${inputBase} pr-10 border ${errors.aadhaar || errors.identity ? "border-red-500" : "border-slate-200 dark:border-slate-700 focus:border-red-500"} tracking-widest`}
                      />
                      <button
                        type="button"
                        onClick={handleMicAadhaar}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
                          isListeningAadhaar ? "bg-red-600 text-white animate-pulse" : "text-slate-400 hover:text-red-600"
                        }`}
                        title="Voice input for Aadhaar Number"
                      >
                        {isListeningAadhaar ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {errors.aadhaar && <p className="text-xs text-red-500">{errors.aadhaar}</p>}
                  </div>
                </div>

                {errors.identity && <p className="text-xs text-red-500 mt-1">{errors.identity}</p>}
              </div>

              {/* Submit */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isGenerating}
                className="w-full h-10 sm:h-11 px-6 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-60 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <span>{isGenerating ? t.generating : t.generateToken}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          </div>
        )}
      </main>

      {/* ── Stretcher Confirmation Popup ── */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white dark:bg-slate-900 border-2 border-red-500 rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center space-y-6 animate-in zoom-in-95 duration-200">

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
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t.confirmTitle}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {t.confirmDesc(countdown)}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancelStretcher}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleConfirmStretcher}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors shadow-lg shadow-red-500/30 active:scale-95"
              >
                <Check className="w-4 h-4" />
                {t.confirm}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
