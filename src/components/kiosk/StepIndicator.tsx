"use client";

import React from "react";
import { User, Activity, FileText, CheckCircle2 } from "lucide-react";
import { Language } from "@/lib/i18n";

interface StepIndicatorProps {
  currentStep: number; // 1 to 4
  lang: Language;
  onStepClick?: (step: number) => void;
}

const STEP_LABELS: Record<Language, { title: string; desc: string }[]> = {
  en: [
    { title: "1. Registration", desc: "Name & Contact" },
    { title: "2. Body Pain Map", desc: "Interactive Skeleton" },
    { title: "3. Past Records", desc: "OCR Report (Optional)" },
    { title: "4. OPD Token", desc: "Print & WhatsApp" },
  ],
  hi: [
    { title: "1. पंजीकरण", desc: "नाम व मोबाइल" },
    { title: "2. दर्द का अंग", desc: "चित्र पर स्पर्श करें" },
    { title: "3. पुराना पर्चा", desc: "दवाइयां व रिपोर्ट" },
    { title: "4. ओपीडी टोकन", desc: "रसीद व कतार" },
  ],
  mr: [
    { title: "1. रुग्ण नोंदणी", desc: "नाव व मोबाईल" },
    { title: "2. वेदना नकाशा", desc: "अवयव निवडा" },
    { title: "3. मागील अहवाल", desc: "प्रिस्क्रिप्शन अपलोड" },
    { title: "4. ओपीडी टोकन", desc: "पावती व रांग" },
  ],
  kn: [
    { title: "1. ರೋಗಿ ನೋಂದಣಿ", desc: "ಹೆಸರು ಮತ್ತು ಮೊಬೈಲ್" },
    { title: "2. ನೋವಿನ ನಕ್ಷೆ", desc: "ಅಂಗಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ" },
    { title: "3. ವೈದ್ಯಕೀಯ ವರದಿ", desc: "ವರದಿ ಅಪ್‌ಲೋಡ್" },
    { title: "4. ಒಪಿಡಿ ಟೋಕನ್", desc: "ರಸೀದಿ ಮತ್ತು ಸಾಲು" },
  ],
  ta: [
    { title: "1. நோயாளி பதிவு", desc: "பெயர் & எண்" },
    { title: "2. வலி வரைபடம்", desc: "பகுதியைத் தொடவும்" },
    { title: "3. மருத்துவ ஆவணம்", desc: "ஆவண பதிவேற்றம்" },
    { title: "4. ஓபிடி டோக்கன்", desc: "ரசீது & வரிசை" },
  ],
  te: [
    { title: "1. రోగి నమోదు", desc: "పేరు & మొబైల్" },
    { title: "2. నొప్పి పటం", desc: "అవయవాలను ఎంచుకోండి" },
    { title: "3. మునుపటి నివేదిక", desc: "నివేదిక అప్‌లోడ్" },
    { title: "4. ఓపీడీ టోకెన్", desc: "రసీదు & క్యూ" },
  ],
  bn: [
    { title: "1. রোগী নিবন্ধন", desc: "নাম ও মোবাইল" },
    { title: "2. ব্যথা মানচিত্র", desc: "অঙ্গ নির্বাচন করুন" },
    { title: "3. পূর্ববর্তী রিপোর্ট", desc: "প্রেসক্রিপশন আপলোড" },
    { title: "4. ওপিডি টোকেন", desc: "রসিদ ও লাইন" },
  ],
  gu: [
    { title: "1. દર્દી નોંધણી", desc: "નામ અને મોબાઈલ" },
    { title: "2. દર્દ નો નકશો", desc: "અંગ પસંદ કરો" },
    { title: "3. જૂનો રિપોર્ટ", desc: "પ્રિસ્ક્રિપ્શન અપલોડ" },
    { title: "4. ઓપીડી ટોકન", desc: "રસીદ અને કતાર" },
  ],
  pa: [
    { title: "1. ਮਰੀਜ਼ ਰਜਿਸਟ੍ਰੇਸ਼ਨ", desc: "ਨਾਮ ਅਤੇ ਮੋਬਾਈਲ" },
    { title: "2. ਦਰਦ ਦਾ ਨਕਸ਼ਾ", desc: "ਅੰਗ ਚੁਣੋ" },
    { title: "3. ਪੁਰਾਣੀ ਰਿਪੋਰਟ", desc: "ਪਰਚਾ ਅੱਪਲੋਡ" },
    { title: "4. ਓਪੀਡੀ ਟੋਕਨ", desc: "ਰਸੀਦ ਅਤੇ ਲਾਈਨ" },
  ],
  ml: [
    { title: "1. രോഗി രജിസ്ട്രേഷൻ", desc: "പേരും മൊബൈലും" },
    { title: "2. വേദന മാപ്പ്", desc: "ഭാഗം തിരഞ്ഞെടുക്കുക" },
    { title: "3. മുൻ റിപ്പോർട്ടുകൾ", desc: "റിപ്പോർട്ട് അപ്‌ലോഡ്" },
    { title: "4. ഒപിഡി ടോക്കൺ", desc: "രസീതും ക്യൂവും" },
  ],
  or: [
    { title: "1. ରୋଗୀ ପଞ୍ଜୀକରଣ", desc: "ନାମ ଓ ମୋବାଇଲ୍" },
    { title: "2. ଯନ୍ତ୍ରଣା ମାନଚିତ୍ର", desc: "ଅଙ୍ଗ ଚୟନ କରନ୍ତୁ" },
    { title: "3. ପୂର୍ବ ରିପୋର୍ଟ", desc: "ପ୍ରେସକ୍ରିପସନ୍ ଅପଲୋଡ୍" },
    { title: "4. ଓପିଡି ଟୋକନ୍", desc: "ରସିଦ୍ ଓ ଧାଡ଼ି" },
  ],
  as: [
    { title: "1. ৰোগী পঞ্জীয়ন", desc: "নাম আৰু মোবাইল" },
    { title: "2. বিষৰ মানচিত্ৰ", desc: "অংশ বাছক" },
    { title: "3. পুৰণি ৰিপোৰ্ট", desc: "প্ৰেছক্ৰিপশ্বন আপলোড" },
    { title: "4. অ'পিডি টোকেন", desc: "ৰচিদ আৰু শাৰী" },
  ],
  ur: [
    { title: "1. مریض کا اندراج", desc: "نام اور موبائل" },
    { title: "2. درد کا نقشہ", desc: "عضو منتخب کریں" },
    { title: "3. پرانی رپورٹ", desc: "نسخہ اپ لوڈ" },
    { title: "4. او پی ڈی ٹوکن", desc: "رسید اور قطار" },
  ],
};

const STEP_ICONS = [User, Activity, FileText, CheckCircle2];

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  lang,
  onStepClick,
}) => {
  const currentLangSteps = STEP_LABELS[lang] || STEP_LABELS.en;

  const steps = [1, 2, 3, 4].map((num, i) => ({
    num,
    title: currentLangSteps[i]?.title || STEP_LABELS.en[i].title,
    desc: currentLangSteps[i]?.desc || STEP_LABELS.en[i].desc,
    icon: STEP_ICONS[i],
  }));

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 sm:mb-10 px-2">
      <div className="relative flex items-center justify-between">
        
        {/* Connecting progress bar line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-2 bg-slate-200 dark:bg-slate-800/90 rounded-full -z-0">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 rounded-full transition-all duration-500 ease-out shadow-sm shadow-emerald-500/20"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((s) => {
          const Icon = s.icon;
          const isCompleted = currentStep > s.num;
          const isCurrent = currentStep === s.num;

          return (
            <button
              key={s.num}
              onClick={() => isCompleted && onStepClick && onStepClick(s.num)}
              disabled={!isCompleted}
              className={`relative z-10 flex flex-col items-center group transition-transform ${
                isCompleted ? "cursor-pointer hover:scale-105" : "cursor-default"
              }`}
            >
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 shadow-md ${
                  isCurrent
                    ? "bg-gradient-to-br from-emerald-600 to-teal-500 border-emerald-300 text-white ring-4 ring-emerald-500/25 dark:ring-emerald-500/30 scale-110 shadow-lg shadow-emerald-600/30"
                    : isCompleted
                    ? "bg-emerald-600 border-emerald-500 text-white shadow-emerald-600/20"
                    : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500"
                }`}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              <div className="mt-2.5 text-center">
                <span
                  className={`text-xs sm:text-sm font-black block tracking-tight ${
                    isCurrent
                      ? "text-emerald-700 dark:text-emerald-400"
                      : isCompleted
                      ? "text-teal-700 dark:text-teal-400"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {s.title}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 block font-medium hidden sm:block">
                  {s.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
