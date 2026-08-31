"use client";

import React from "react";
import { Language } from "@/lib/i18n";
import { useRouter } from "next/navigation";
import { AlertOctagon, Stethoscope, Tv, ArrowRight, UserCheck } from "lucide-react";

interface LandingScreenProps {
  onStartReal: () => void;
  onStartDemo: () => void;
  lang: Language;
}

const LANDING_TEXTS: Record<Language, {
  emergencyTitle: string;
  emergencyDesc: string;
  opdTitle: string;
  opdDesc: string;
  displayTitle: string;
  displayDesc: string;
  doctorTitle: string;
  doctorDesc: string;
}> = {
  en: {
    emergencyTitle: "Emergency",
    emergencyDesc: "Immediate critical care",
    opdTitle: "OPD",
    opdDesc: "Out-patient check-in",
    displayTitle: "OPD Token Display",
    displayDesc: "View live queue status",
    doctorTitle: "Doctor / Staff Portal",
    doctorDesc: "Clinical login",
  },
  hi: {
    emergencyTitle: "आपातकाल",
    emergencyDesc: "तत्काल आपातकालीन चिकित्सा",
    opdTitle: "ओपीडी",
    opdDesc: "मरीज़ पंजीकरण और चेक-इन",
    displayTitle: "ओपीडी टोकन डिस्प्ले",
    displayDesc: "लाइव प्रतीक्षा सूची देखें",
    doctorTitle: "डॉक्टर / स्टाफ पोर्टल",
    doctorDesc: "क्लिनिकल लॉगिन",
  },
  as: {
    emergencyTitle: "জৰুৰীকালীন",
    emergencyDesc: "ক্ষিপ্ৰ জৰুৰীকালীন চিকিৎসা",
    opdTitle: "অ'পিডি",
    opdDesc: "ৰোগী পঞ্জীয়ন আৰু চেক-ইন",
    displayTitle: "অ'পিডি টোকেন প্ৰদৰ্শন",
    displayDesc: "অপেক্ষাৰ তালিকা চাওক",
    doctorTitle: "চিকিৎসক / কৰ্মচাৰী পৰ্টেল",
    doctorDesc: "ক্লিনিকেল লগইন",
  },
  bn: {
    emergencyTitle: "জরুরী বিভাগ",
    emergencyDesc: "জরুরী চিকিৎসা সেবা",
    opdTitle: "ওপিডি",
    opdDesc: "বহির্বিভাগ রোগী নিবন্ধন",
    displayTitle: "ওপিডি টোকেন প্রদর্শন",
    displayDesc: "অপেক্ষার তালিকা দেখুন",
    doctorTitle: "ডাক্তার / স্টাফ পোর্টাল",
    doctorDesc: "ক্লিনিকাল লগইন",
  },
  brx: {
    emergencyTitle: "गोख्रों रैखा",
    emergencyDesc: "गोख्रों फाहामथाय",
    opdTitle: "ओपिडि",
    opdDesc: "मरीज मुं थिसननाय",
    displayTitle: "ओपिडि टोकन नुथाय",
    displayDesc: "नेनाय फारिलाइ नाय",
    doctorTitle: "डक्टर / स्टाफ पोर्टल",
    doctorDesc: "क्लिनिकल लगइन",
  },
  doi: {
    emergencyTitle: "आपातकालीन",
    emergencyDesc: "तत्काल आपातकालीन चिकित्सा",
    opdTitle: "ओपीडी",
    opdDesc: "मरीज पंजीकरण ते चेक-इन",
    displayTitle: "ओपीडी टोकन डिस्प्ले",
    displayDesc: "लाइव कतार सूची दिक्खो",
    doctorTitle: "डाक्टर / स्टाफ पोर्टल",
    doctorDesc: "क्लिनिकल लागइन",
  },
  gu: {
    emergencyTitle: "ઇમરજન્સી",
    emergencyDesc: "ત્વરિત કટોકટી સારવાર",
    opdTitle: "ઓપીડી",
    opdDesc: "ઓપીડી દર્દી નોંધણી",
    displayTitle: "ઓપીડી ટોકન ડિસ્પ્લે",
    displayDesc: "વેઇટિંગ લિસ્ટ જુઓ",
    doctorTitle: "ડોક્ટર / સ્ટાફ પોર્ટલ",
    doctorDesc: "ક્લિનિકલ લૉગિન",
  },
  kn: {
    emergencyTitle: "ತುರ್ತು ಚಿಕಿತ್ಸೆ",
    emergencyDesc: "ತಕ್ಷಣದ ತುರ್ತು ಆರೈಕೆ",
    opdTitle: "ಒಪಿಡಿ",
    opdDesc: "ಹೊರರೋಗಿ ನೋಂದಣಿ",
    displayTitle: "ಒಪಿಡಿ ಟೋಕನ್ ಪ್ರದರ್ಶನ",
    displayDesc: "ಸರದಿಯ ಸ್ಥಿತಿಯನ್ನು ವೀಕ್ಷಿಸಿ",
    doctorTitle: "ವೈದ್ಯ / ಸಿಬ್ಬಂದಿ ಪೋರ್ಟಲ್",
    doctorDesc: "ಕ್ಲಿನಿಕಲ್ ಲಾಗಿನ್",
  },
  ks: {
    emergencyTitle: "ایمرجنسی",
    emergencyDesc: "فوری ہنگامی علاج",
    opdTitle: "او پی ڈی",
    opdDesc: "مریض اندراج تہٕ چیک ان",
    displayTitle: "او پی ڈی ٹوکن ڈسپلے",
    displayDesc: "ویٹنگ لسٹ وچھِو",
    doctorTitle: "ڈاکٹر / عملہ پورٹل",
    doctorDesc: "کلینیکل لاگ ان",
  },
  kok: {
    emergencyTitle: "तातडीची मदत",
    emergencyDesc: "तातडीची भलायकी मदत",
    opdTitle: "ओपीडी",
    opdDesc: "दुयेंती नोंदणी आनी तपासणी",
    displayTitle: "ओपीडी टोकन डिस्प्ले",
    displayDesc: "प्रतीक्षा यादी पळयात",
    doctorTitle: "दोतोर / स्टाफ पोर्टल",
    doctorDesc: "क्लिनिकल लॉगइन",
  },
  mai: {
    emergencyTitle: "आपातकाल",
    emergencyDesc: "तत्काल आपातकालीन चिकित्सा",
    opdTitle: "ओपीडी",
    opdDesc: "रोगी पंजीकरण आ चेक-इन",
    displayTitle: "ओपीडी टोकन डिस्प्ले",
    displayDesc: "लाइव पाँती सूची देखू",
    doctorTitle: "डाक्टर / स्टाफ पोर्टल",
    doctorDesc: "क्लिनिकल लागइन",
  },
  ml: {
    emergencyTitle: "അടിയന്തിര വിഭാഗം",
    emergencyDesc: "അടിയന്തിര പരിചരണം",
    opdTitle: "ഒപിഡി",
    opdDesc: "ഒപി രജിസ്ട്രേഷൻ",
    displayTitle: "ഒപിഡി ടോക്കൺ ഡിസ്പ്ലേ",
    displayDesc: "വെയ്റ്റിംഗ് ലിസ്റ്റ് കാണുക",
    doctorTitle: "ഡോക്ടർ / സ്റ്റാഫ് പോർട്ടൽ",
    doctorDesc: "ക്ലിനിക്കൽ ലോഗിൻ",
  },
  mni: {
    emergencyTitle: "ইমার্জেন্সী",
    emergencyDesc: "খুদক্তা লায়েংবা",
    opdTitle: "ওপিডি",
    opdDesc: "অনাবা মীওই রেজিষ্ট্রেশন",
    displayTitle: "ওপিডি টোকেন ডিসপ্লে",
    displayDesc: "ঙাইরিবা লিষ্ট য়েংবা",
    doctorTitle: "ডাক্তার / স্টাফ পোর্টাল",
    doctorDesc: "ক্লিনিক্যাল লগইন",
  },
  mr: {
    emergencyTitle: "तातडीची मदत",
    emergencyDesc: "तातडीची वैद्यकीय मदत",
    opdTitle: "ओपीडी",
    opdDesc: "रुग्ण नोंदणी व तपासणी",
    displayTitle: "ओपीडी टोकन डिस्प्ले",
    displayDesc: "प्रतीक्षा यादी पहा",
    doctorTitle: "डॉक्टर / स्टाफ पोर्टल",
    doctorDesc: "क्लिनिकल लॉगिन",
  },
  ne: {
    emergencyTitle: "आकस्मिक सेवा",
    emergencyDesc: "तत्काल आकस्मिक चिकित्सा",
    opdTitle: "ओपीडी",
    opdDesc: "बिरामी दर्ता र चेक-इन",
    displayTitle: "ओपीडी टोकन डिस्प्ले",
    displayDesc: "प्रत्यक्ष पालो सूची हेर्नुहोस्",
    doctorTitle: "डाक्टर / कर्मचारी पोर्टल",
    doctorDesc: "क्लिनिकल लगइन",
  },
  or: {
    emergencyTitle: "ଜରୁରୀକାଳୀନ",
    emergencyDesc: "ତୁରନ୍ତ ଡାକ୍ତରୀ ସେବା",
    opdTitle: "ଓପିଡି",
    opdDesc: "ରୋଗୀ ପଞ୍ଜୀକରଣ",
    displayTitle: "ଓପିଡି ଟୋକନ୍ ପ୍ରଦର୍ଶନ",
    displayDesc: "ଅପେକ୍ଷା ତାଲିକା ଦେଖନ୍ତୁ",
    doctorTitle: "ଡାକ୍ତର / କର୍ମଚାରୀ ପୋର୍ଟାଲ୍",
    doctorDesc: "କ୍ଲିନିକାଲ୍ ଲଗଇନ୍",
  },
  pa: {
    emergencyTitle: "ਐਮਰਜੈਂਸੀ",
    emergencyDesc: "ਤੁਰੰਤ ਐਮਰਜੈਂਸੀ ਦੇਖਭਾਲ",
    opdTitle: "ਓਪੀਡੀ",
    opdDesc: "ਮਰੀਜ਼ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਅਤੇ ਚੈੱਕ-ਇਨ",
    displayTitle: "ਓਪੀਡੀ ਟੋਕਨ ਡਿਸਪਲੇ",
    displayDesc: "ਉਡੀਕ ਸੂਚੀ ਦੇਖੋ",
    doctorTitle: "ਡਾਕਟਰ / ਸਟਾਫ਼ ਪੋਰਟਲ",
    doctorDesc: "ਕਲੀਨਿਕਲ ਲੌਗਇਨ",
  },
  sa: {
    emergencyTitle: "आपत्कालीन सेवा",
    emergencyDesc: "सद्यः आपत्कालीन चिकित्सा",
    opdTitle: "ओपीडी",
    opdDesc: "रोगी पञ्जीकरणम् तथा प्रविष्टिः",
    displayTitle: "ओपीडी टोकन प्रदर्शनम्",
    displayDesc: "प्रत्यक्ष क्रमसूचीं पश्यतु",
    doctorTitle: "चिकित्सक / कर्मचारी पोर्टल",
    doctorDesc: "क्लिनिकल प्रवेशः",
  },
  sat: {
    emergencyTitle: "ᱞᱚᱜᱚᱱ ᱜᱚᱲᱚ",
    emergencyDesc: "ᱞᱚᱜᱚᱱ ᱨᱟᱱ ᱢᱩᱨᱜᱟᱹᱱ",
    opdTitle: "ᱚᱯᱤᱰᱤ",
    opdDesc: "ᱨᱩᱣᱟᱹ ᱦᱚᱲ ᱚᱞ ᱟᱨ ᱪᱮᱠ-ᱤᱱ",
    displayTitle: "ᱚᱯᱤᱰᱤ ᱴᱳᱠᱮᱱ ᱰᱤᱥᱯᱞᱮ",
    displayDesc: "ᱛᱟᱺᱜᱤ ᱞᱤᱥᱴ ᱧᱮᱞ ᱢᱮ",
    doctorTitle: "ᱰᱟᱠᱛᱚᱨ / ᱥᱴᱟᱯ ᱯᱳᱨᱴᱟᱞ",
    doctorDesc: "ᱠᱞᱤᱱᱤᱠᱟᱞ ᱞᱚᱜᱽ-ᱤᱱ",
  },
  sd: {
    emergencyTitle: "هنگامي صورتحال",
    emergencyDesc: "فوري هنگامي علاج",
    opdTitle: "او پي ڊي",
    opdDesc: "مريض رجسٽريشن ۽ چيڪ ان",
    displayTitle: "او پي ڊي ٽوڪن ڊسپلي",
    displayDesc: "ويٽنگ لسٽ ڏسو",
    doctorTitle: "ڊاڪٽر / عملو پورٽل",
    doctorDesc: "ڪلينيڪل لاگ ان",
  },
  ta: {
    emergencyTitle: "அவசர சிகிச்சை",
    emergencyDesc: "உடனடி அவசர சிகிச்சை",
    opdTitle: "ஓபிடி",
    opdDesc: "வெளிநோயாளி பதிவு",
    displayTitle: "ஓபிடி டோக்கன் காட்சி",
    displayDesc: "வரிசை நிலையைப் பார்க்கவும்",
    doctorTitle: "மருத்துவர் / பணியாளர் போர்டல்",
    doctorDesc: "மருத்துவ உள்நுழைவு",
  },
  te: {
    emergencyTitle: "అత్యవసర విభాగం",
    emergencyDesc: "తక్షణ అత్యవసర సంరక్షణ",
    opdTitle: "ఓపీడీ",
    opdDesc: "రోగుల నమోదు & చెక్-ఇన్",
    displayTitle: "ఓపీడీ టోకెన్ ప్రదర్శన",
    displayDesc: "వేచి ఉండే జాబితా చూడండి",
    doctorTitle: "డాక్టర్ / స్టాఫ్ పోర్టల్",
    doctorDesc: "క్లినికల్ లాగిన్",
  },
  ur: {
    emergencyTitle: "ایمرجنسی",
    emergencyDesc: "فوری طبی امداد",
    opdTitle: "او پی ڈی",
    opdDesc: "مریض کا اندراج اور چیک ان",
    displayTitle: "او پی ڈی ٹوکن ڈسپلے",
    displayDesc: "ویٹنگ لسٹ دیکھیں",
    doctorTitle: "ڈاکٹر / عملہ پورٹل",
    doctorDesc: "کلینیکل لاگ ان",
  },
};

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onStartReal,
  lang,
}) => {
  const router = useRouter();
  const t = LANDING_TEXTS[lang] || LANDING_TEXTS.en;

  return (
    <div className="flex flex-col items-center justify-center my-auto animate-in fade-in zoom-in-95 duration-300 w-full overflow-hidden">
      {/* Four option boxes in a column */}
      <div className="flex flex-col gap-2.5 sm:gap-3 w-full max-w-md mx-auto px-2">

        {/* 1. Emergency Box */}
        <button
          type="button"
          onClick={() => router.push("/emergency")}
          className="group relative overflow-hidden rounded-2xl bg-red-600 hover:bg-red-700 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-red-600/25 p-3.5 sm:p-4 text-left border border-red-500"
        >
          {/* Subtle pulse ring */}
          <span className="absolute inset-0 rounded-2xl ring-2 ring-red-400/40 animate-pulse pointer-events-none" />
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <AlertOctagon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight">{t.emergencyTitle}</h2>
              <p className="text-red-100 font-medium text-xs mt-0.5">{t.emergencyDesc}</p>
            </div>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </div>
        </button>

        {/* 2. OPD Box */}
        <button
          type="button"
          onClick={onStartReal}
          className="group relative overflow-hidden rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-emerald-600/25 p-3.5 sm:p-4 text-left border border-emerald-500"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight">{t.opdTitle}</h2>
              <p className="text-emerald-100 font-medium text-xs mt-0.5">{t.opdDesc}</p>
            </div>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </div>
        </button>

        {/* 3. Live Waiting Display Box */}
        <button
          type="button"
          onClick={() => router.push("/display")}
          className="group relative overflow-hidden rounded-2xl bg-sky-600 hover:bg-sky-700 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-sky-600/25 p-3.5 sm:p-4 text-left border border-sky-500"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Tv className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight">{t.displayTitle}</h2>
              <p className="text-sky-100 font-medium text-xs mt-0.5">{t.displayDesc}</p>
            </div>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </div>
        </button>

        {/* 4. Doctor / Staff Portal Box */}
        <button
          type="button"
          onClick={() => router.push("/doctor")}
          className="group relative overflow-hidden rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-indigo-600/25 p-3.5 sm:p-4 text-left border border-indigo-500"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight">{t.doctorTitle}</h2>
              <p className="text-indigo-100 font-medium text-xs mt-0.5">{t.doctorDesc}</p>
            </div>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </div>
        </button>

      </div>
    </div>
  );
};
