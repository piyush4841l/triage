"use client";

import React from "react";
import { 
  LayoutGrid, 
  Users, 
  UploadCloud, 
  Ticket, 
  RotateCcw, 
  CreditCard, 
  Check, 
  ListChecks 
} from "lucide-react";
import { Language, translations } from "@/lib/i18n";
import { PatientRegistrationData } from "@/components/registration/PatientRegistration";

interface StepIndicatorProps {
  currentStep: number; // 1 to 4
  lang: Language;
  registrationData?: PatientRegistrationData;
  onStepClick?: (step: number) => void;
  onResetKiosk?: () => void;
}

const STEP_LABELS: Record<Language, { title: string; desc: string }[]> = {
  en: [
    { title: "Registration", desc: "Patient Details" },
    { title: "Body Pain Map", desc: "Select Pain Area" },
    { title: "Upload Prescription", desc: "Past OCR Records" },
    { title: "OPD Token", desc: "Receipt & Queue" },
  ],
  hi: [
    { title: "पंजीकरण", desc: "रोगी विवरण" },
    { title: "दर्द का अंग", desc: "चित्र पर स्पर्श" },
    { title: "पर्चा अपलोड", desc: "मेडिकल रिकॉर्ड" },
    { title: "ओपीडी टोकन", desc: "रसीद व कतार" },
  ],
  mr: [
    { title: "नोंदणी", desc: "रुग्ण तपशील" },
    { title: "वेदना नकाशा", desc: "अवयव निवडा" },
    { title: "प्रिस्क्रिप्शन अपलोड", desc: "वैद्यकीय अहवाल" },
    { title: "ओपीडी टोकन", desc: "पावती व रांग" },
  ],
  kn: [
    { title: "ನೋಂದಣಿ", desc: "ರೋಗಿಯ ವಿವರಗಳು" },
    { title: "ನೋವಿನ ನಕ್ಷೆ", desc: "ಅಂಗಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ" },
    { title: "ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಅಪ್‌ಲೋಡ್", desc: "ವೈದ್ಯಕೀಯ ವರದಿ" },
    { title: "ಒಪಿಡಿ ಟೋಕನ್", desc: "ರಸೀದಿ ಮತ್ತು ಸಾಲು" },
  ],
  ta: [
    { title: "பதிவு", desc: "நோயாளி விவரங்கள்" },
    { title: "வலி வரைபடம்", desc: "பகுதியைத் தொடவும்" },
    { title: "மருந்து சீட்டு", desc: "ஆவண பதிவேற்றம்" },
    { title: "ஓபிடி டோக்கன்", desc: "ரசீது & வரிசை" },
  ],
  te: [
    { title: "నమోదు", desc: "రోగి వివరాలు" },
    { title: "నొప్పి పటం", desc: "అవయవాల ఎంపిక" },
    { title: "ప్రిస్క్రిప్షన్ అప్‌లోడ్", desc: "వైద్య పత్రాలు" },
    { title: "ఓపీడీ టోకెన్", desc: "రసీదు & క్యూ" },
  ],
  bn: [
    { title: "নিবন্ধন", desc: "রোগীর বিবরণ" },
    { title: "ব্যথা মানচিত্র", desc: "অঙ্গ নির্বাচন" },
    { title: "প্রেসক্রিপশন আপলোড", desc: "মেডিকেল রিপোর্ট" },
    { title: "ওপিডি টোকেন", desc: "রসিদ ও লাইন" },
  ],
  gu: [
    { title: "નોંધણી", desc: "દર્દી વિગતો" },
    { title: "દર્દ નો નકશો", desc: "અંગ પસંદગી" },
    { title: "પ્રિસ્ક્રિપ્શન અપલોડ", desc: "તબીબી અહેવાલ" },
    { title: "ઓપીડી ટોકન", desc: "રસીદ અને કતાર" },
  ],
  pa: [
    { title: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ", desc: "ਮਰੀਜ਼ ਵੇਰਵੇ" },
    { title: "ਦਰਦ ਦਾ ਨਕਸ਼ਾ", desc: "ਅੰਗ ਚੋਣ" },
    { title: "ਪਰਚਾ ਅੱਪਲੋਡ", desc: "ਮੈਡੀਕਲ ਰਿਪੋਰਟ" },
    { title: "ਓਪੀਡੀ ਟੋਕਨ", desc: "ਰਸੀਦ ਅਤੇ ਲਾਈਨ" },
  ],
  ml: [
    { title: "രജിസ്ട്രേഷൻ", desc: "രോഗിയുടെ വിവരങ്ങൾ" },
    { title: "വേദന മാപ്പ്", desc: "ഭാഗം തിരഞ്ഞെടുക്കുക" },
    { title: "കുറിപ്പടി അപ്‌ലോഡ്", desc: "മെഡിക്കൽ രേഖകൾ" },
    { title: "ഒപിഡി ടോക്കൺ", desc: "രസീതും ക്യൂവും" },
  ],
  or: [
    { title: "ପଞ୍ଜୀକରଣ", desc: "ରୋଗୀ ବିବରଣୀ" },
    { title: "ଯନ୍ତ୍ରଣା ମାନଚିତ୍ର", desc: "ଅଙ୍ଗ ଚୟନ" },
    { title: "ପ୍ରେସକ୍ରିପସନ୍ ଅପଲୋଡ୍", desc: "ଡାକ୍ତରୀ ରିପୋର୍ଟ" },
    { title: "ଓପିଡି ଟୋକନ୍", desc: "ରସିଦ୍ ଓ ଧାଡ଼ି" },
  ],
  as: [
    { title: "পঞ্জীয়ন", desc: "ৰোগীৰ তথ্য" },
    { title: "বিষৰ মানচিত্ৰ", desc: "অংশ বাছক" },
    { title: "প্ৰেছক্ৰিপশ্বন আপলোড", desc: "চিকিৎসা ৰিপোৰ্ট" },
    { title: "অ'পিডি টোকেন", desc: "ৰচিদ আৰু শাৰী" },
  ],
  ur: [
    { title: "اندراج", desc: "مریض کی تفصیلات" },
    { title: "درد کا نقشہ", desc: "عضو کا انتخاب" },
    { title: "نسخہ اپ لوڈ", desc: "طبی ریکارڈ" },
    { title: "او پی ڈی ٹوکن", desc: "رسید اور قطار" },
  ],
  brx: [
    { title: "मुं थिसननाय", desc: "मरीज खौरां" },
    { title: "सानाय मेप", desc: "बाहागो सायख" },
    { title: "फारिलाइ आपलोड", desc: "राफोर्त" },
    { title: "ओपिडि टोकन", desc: "रसीद आरो लारि" },
  ],
  doi: [
    { title: "पंजीकरण", desc: "मरीज विवरण" },
    { title: "दर्द दा नक्शा", desc: "अंग चुनो" },
    { title: "पर्चा अपलोड", desc: "मेडिकल रिपोर्ट" },
    { title: "ओपीडी टोकन", desc: "पर्ची ते कतार" },
  ],
  ks: [
    { title: "اندراج", desc: "مریض سند تفصیل" },
    { title: "دگک نقشہٕ", desc: "حصہٕ ژاریو" },
    { title: "نسخہٕ اپ لوڈ", desc: "طبی ریکارڈ" },
    { title: "او پی ڈی ٹوکن", desc: "پرچی تہٕ قطار" },
  ],
  kok: [
    { title: "नोंदणी", desc: "दुयेंती तपशील" },
    { title: "दूख नकासो", desc: "भाग वेचात" },
    { title: "प्रिस्क्रिप्शन अपलोड", desc: "वैद्यकीय अहवाल" },
    { title: "ओपीडी टोकन", desc: "पावती आनी रांक" },
  ],
  mai: [
    { title: "पंजीकरण", desc: "रोगी विवरण" },
    { title: "दर्दक नक्शा", desc: "अंग चुनू" },
    { title: "पुर्जा अपलोड", desc: "मेडिकल रिपोर्ट" },
    { title: "ओपीडी टोकन", desc: "रसीद आ पाँती" },
  ],
  mni: [
    { title: "রেজিষ্ট্রেশন", desc: "অনাবা মীওইগী মরোল" },
    { title: "নানথিবা মেপ", desc: "মফম খল্লু" },
    { title: "প্রেসক্রিপশন অপলোড", desc: "মেডিকেল রিপোর্ট" },
    { title: "ওপিডি টোকেন", desc: "রসিদ অমসুং লাইরিং" },
  ],
  ne: [
    { title: "दर्ता", desc: "बिरामी विवरण" },
    { title: "दुखाइ नक्सा", desc: "भाग रोज्नुहोस्" },
    { title: "पुर्जा अपलोड", desc: "मेडिकल रिपोर्ट" },
    { title: "ओपीडी टोकन", desc: "रसिद र पालो" },
  ],
  sa: [
    { title: "पञ्जीकरणम्", desc: "रोगी विवरणम्" },
    { title: "वेदना मानचित्रम्", desc: "भागं चिनुत" },
    { title: "पत्रम् आरोपयतु", desc: "चिकित्सा प्रतिवेदनम्" },
    { title: "ओपीडी टोकन", desc: "पत्रं तथा क्रमः" },
  ],
  sat: [
    { title: "ᱧᱩᱛᱩᱢ ᱚᱞ", desc: "ᱨᱩᱣᱟᱹ ᱦᱚᱲ ᱠᱟᱛᱷᱟ" },
    { title: "ᱦᱟᱹᱥᱩ ᱢᱮᱯ", desc: "ᱦᱟᱹᱴᱤᱧ ᱵᱟᱪᱷᱟᱣ" },
    { title: "ᱥᱞᱤᱯ ᱟᱯᱞᱳᱰ", desc: "ᱨᱟᱱ ᱠᱟᱜᱚᱡᱽ" },
    { title: "ᱚᱯᱤᱰᱤ ᱴᱳᱠᱮᱱ", desc: "ᱥᱞᱤᱯ ᱟᱨ ᱞᱟᱭᱤᱱ" },
  ],
  sd: [
    { title: "رجسٽريشن", desc: "مريض تفصيل" },
    { title: "سور جو نقشو", desc: "عضو چونڊيو" },
    { title: "نسخو اپ لوڊ", desc: "طبي رپورٽ" },
    { title: "او پي ڊي ٽوڪن", desc: "رسيد ۽ قطار" },
  ],
};

const STEP_ICONS = [
  LayoutGrid,
  Users,
  UploadCloud,
  Ticket,
];

function maskAbhaId(raw?: string): string {
  if (!raw || !raw.trim()) return "XXXX-XXXX-XXXX-XXXX";
  const digits = raw.replace(/\D/g, "");
  if (digits.length >= 4) {
    const last4 = digits.slice(-4);
    return `XXXX-XXXX-XX-${last4}`;
  }
  const trimmed = raw.trim();
  if (trimmed.length > 4) {
    return `XXXX-XXXX-XXXX-${trimmed.slice(-4)}`;
  }
  return `XXXX-XXXX-XXXX-${trimmed}`;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  lang,
  registrationData,
  onStepClick,
  onResetKiosk,
}) => {
  const currentLangSteps = STEP_LABELS[lang] || STEP_LABELS.en;

  const isDetailsFilled = currentStep > 1 && Boolean(registrationData?.patientName?.trim());
  const displayName = (isDetailsFilled && registrationData?.patientName) ? registrationData.patientName : "Empty";
  const displayAbha = isDetailsFilled 
    ? maskAbhaId(registrationData?.abhaId)
    : "Empty";

  const steps = [1, 2, 3, 4].map((num, i) => ({
    num,
    title: currentLangSteps[i]?.title || STEP_LABELS.en[i].title,
    desc: currentLangSteps[i]?.desc || STEP_LABELS.en[i].desc,
    Icon: STEP_ICONS[i],
  }));

  return (
    <div className="h-full flex flex-col justify-between gap-5 py-1">
      
      <div className="space-y-4">
        {/* ── 1. Patient Details Card ── */}
        <div className="bg-slate-50/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 transition-all duration-300 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Patient Profile
            </span>
            {isDetailsFilled && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Verified
              </span>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Name:</span>
              <span className={`text-sm font-bold truncate max-w-[150px] ${
                isDetailsFilled ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500 italic font-medium"
              }`}>
                {displayName}
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                ABHA:
              </span>
              <span className={`text-xs font-mono font-bold tracking-wider ${
                isDetailsFilled ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500 italic font-normal"
              }`}>
                {displayAbha}
              </span>
            </div>
          </div>
        </div>

        {/* ── 2. Activity Status Card (No large empty void) ── */}
        <div className="bg-slate-50/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 shadow-sm space-y-3">
          {/* Box Header */}
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200/80 dark:border-slate-700/80">
            <ListChecks className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Activity Status
            </span>
          </div>

          {/* Steps Navigation Menu */}
          <nav aria-label="Kiosk Steps" className="space-y-2">
            {steps.map((s) => {
              const isCompleted = currentStep > s.num;
              const isCurrent = currentStep === s.num;
              const Icon = s.Icon;

              return (
                <button
                  key={s.num}
                  onClick={() => isCompleted && onStepClick && onStepClick(s.num)}
                  disabled={!isCompleted}
                  className={`w-full text-left px-3.5 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 ${
                    isCurrent
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400/40 scale-[1.01]"
                      : isCompleted
                      ? "bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/50 hover:bg-emerald-100/80 dark:hover:bg-emerald-950/60 cursor-pointer"
                      : "bg-white/60 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800/60 cursor-default opacity-75"
                  }`}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <Icon className={`w-4 h-4 ${
                      isCurrent 
                        ? "text-white" 
                        : isCompleted 
                        ? "text-emerald-600 dark:text-emerald-400" 
                        : "text-slate-400 dark:text-slate-500"
                    }`} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <span className={`text-xs font-bold block truncate ${
                      isCurrent ? "text-white" : isCompleted ? "text-emerald-900 dark:text-emerald-200" : "text-slate-700 dark:text-slate-300"
                    }`}>
                      {s.title}
                    </span>
                    <span className={`text-[9px] block truncate ${
                      isCurrent ? "text-emerald-100" : "text-slate-400 dark:text-slate-500"
                    }`}>
                      {s.desc}
                    </span>
                  </div>

                  {/* Completed Check Badge */}
                  {isCompleted && (
                    <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ── 3. Bottom Subtle Action Button ── */}
      {onResetKiosk && (
        <div className="pt-2">
          {currentStep === 4 ? (
            <button
              type="button"
              onClick={onResetKiosk}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200/80 dark:border-red-900/50 shadow-sm hover:shadow-md transition-all text-xs font-bold active:scale-95 group"
            >
              <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-90 transition-transform duration-300 text-red-500" />
              <span>{translations[lang]?.createNewToken || (lang === "hi" ? "नया मरीज पंजीकृत करें" : "Register New Patient")}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onResetKiosk}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200/80 dark:border-red-900/50 shadow-sm hover:shadow-md transition-all text-xs font-bold active:scale-95 group"
            >
              <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-90 transition-transform duration-300 text-red-500" />
              <span>Cancel / Reset to Home</span>
            </button>
          )}
        </div>
      )}

    </div>
  );
};
