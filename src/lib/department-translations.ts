// Complete Department, Doctor, Room and Counter localizations across all 23 official Indian languages
import { Language } from "./i18n";
import { getLocalizedSymptomName } from "./anatomy-translations";

export interface DepartmentLocalization {
  deptName: string;
  doctorName: string;
  roomName: string;
  counterName: string;
}

export const SPECIALTY_LOCALIZATIONS: Record<string, Record<Language, DepartmentLocalization>> = {
  pulmonology: {
    en: {
      deptName: "Pulmonology",
      doctorName: "Dr. Arvind Mehta (Pulmonologist)",
      roomName: "Room 104 (Chest & Respiratory)",
      counterName: "Counter 04"
    },
    hi: {
      deptName: "श्वसन व फेफड़ा रोग विभाग (पल्मोनोलॉजी)",
      doctorName: "डॉ. अरविंद मेहता (श्वसन रोग विशेषज्ञ)",
      roomName: "कमरा 104 (वक्ष एवं श्वसन)",
      counterName: "काउंटर 04"
    },
    bn: {
      deptName: "পালমোনোলজি (বক্ষ ও ফুসফুস রোগ বিভাগ)",
      doctorName: "ডা. অরবিন্দ মেহতা (বক্ষ ও ফুসফুস বিশেষজ্ঞ)",
      roomName: "রুম ১০৪ (বক্ষ ও শ্বাসতন্ত্র)",
      counterName: "কাউন্টার ০৪"
    },
    as: {
      deptName: "পালমোন'লজি (বক্ষ আৰু হাওঁফাঁও ৰোগ বিভাগ)",
      doctorName: "ডাঃ অৰবিন্দ মেহতা (বক্ষ ৰোগ বিশেষজ্ঞ)",
      roomName: "ৰূম ১০৪ (বক্ষ আৰু শ্বাসতন্ত্ৰ)",
      counterName: "কাউণ্টাৰ ০৪"
    },
    gu: {
      deptName: "પલ્મોનોલોજી (ફેફસાં અને શ્વસન રોગ વિભાગ)",
      doctorName: "ડૉ. અરવિંદ મહેતા (શ્વસન રોગ નિષ્ણાત)",
      roomName: "રૂમ 104 (છાતી અને શ્વસન)",
      counterName: "કાઉન્ટર 04"
    },
    kn: {
      deptName: "ಪಲ್ಮನಾಲಜಿ (ಶ್ವಾಸಕೋಶ ಮತ್ತು ಉಸಿರಾಟದ ವಿಭಾಗ)",
      doctorName: "ಡಾ. ಅರವಿಂದ್ ಮೆಹ್ತಾ (ಶ್ವಾಸಕೋಶ ತಜ್ಞರು)",
      roomName: "ರೂಮ್ 104 (ಎದೆ ಮತ್ತು ಉಸಿರಾಟ)",
      counterName: "ಕೌಂಟರ್ 04"
    },
    ml: {
      deptName: "പൾമണോളജി (ശ്വാസകോശ വിഭാഗം)",
      doctorName: "ഡോ. അരവിന്ദ് മേത്ത (ശ്വാസകോശ വിദഗ്ദ്ധൻ)",
      roomName: "റൂം 104 (നെഞ്ചും ശ്വാസകോശവും)",
      counterName: "കൗണ്ടർ 04"
    },
    mni: {
      deptName: "পালমোনোলজি (থৌ ওরো অমসুং ফৌগৎলোন বিভাগ)",
      doctorName: "ডাঃ অরবিন্দ মেহতা (থৌ ওরো বিশেষজ্ঞ)",
      roomName: "কা 104 (থৌ ওরো)",
      counterName: "কাউন্টার 04"
    },
    mr: {
      deptName: "श्वसन व फुफ्फुस रोग विभाग (पल्मोनॉलॉजी)",
      doctorName: "डॉ. अरविंद मेहता (फुफ्फुस व श्वसनरोग तज्ज्ञ)",
      roomName: "रूम १०४ (छाती व श्वसन)",
      counterName: "काउंटर ०४"
    },
    ne: {
      deptName: "छाती तथा फोक्सो रोग विभाग (पल्मोनोलोजी)",
      doctorName: "डा. अरविन्द मेहता (छाती तथा फोक्सो विशेषज्ञ)",
      roomName: "कोठा १०४ (छाती र श्वासप्रश्वास)",
      counterName: "काउन्टर ०४"
    },
    or: {
      deptName: "ଫୁସଫୁସ ଏବଂ ଶ୍ୱାସରୋଗ ବିଭାଗ (Pulmonology)",
      doctorName: "ଡା. ଅରବିନ୍ଦ ମେହେତା (ଶ୍ୱାସରୋଗ ବିଶେଷଜ୍ଞ)",
      roomName: "ରୁମ୍ ୧୦୪ (ଛାତି ଓ ଶ୍ୱାସତନ୍ତ୍ର)",
      counterName: "କାଉଣ୍ଟର ୦୪"
    },
    pa: {
      deptName: "ਪਲਮੋਨੋਲੋਜੀ (ਛਾਤੀ ਅਤੇ ਫੇਫੜਿਆਂ ਦਾ ਵਿਭਾਗ)",
      doctorName: "ਡਾ. ਅਰਵਿੰਦ ਮਹਿਤਾ (ਫੇਫੜਿਆਂ ਦੇ ਮਾਹਿਰ)",
      roomName: "ਕਮਰਾ 104 (ਛਾਤੀ ਅਤੇ ਸਾਹ)",
      counterName: "ਕਾਊਂਟਰ 04"
    },
    sa: {
      deptName: "फुप्फुस तथा श्वसनरोग विभागः",
      doctorName: "डा. अरविन्द मेहता (श्वसनरोग विशेषज्ञः)",
      roomName: "प्रकोष्ठम् १०४ (उरः तथा श्वसनम्)",
      counterName: "काउण्टर ०४"
    },
    sat: {
      deptName: "ᱯᱟᱞᱢᱳᱱᱳᱞᱳᱡᱤ (ᱠᱚᱲᱟᱢ ᱟᱨ ᱯᱷᱮᱯᱷᱲᱟ ᱵᱤᱵᱷᱟᱜᱽ)",
      doctorName: "ᱰᱟ. ᱟᱨᱵᱤᱱᱫᱽ ᱢᱮᱦᱛᱟ (ᱯᱷᱮᱯᱷᱲᱟ ᱵᱤᱥᱮᱥᱚᱜᱽᱭᱚ)",
      roomName: "ᱠᱩᱴᱷᱨᱤ 104 (ᱠᱚᱲᱟᱢ ᱟᱨ ᱥᱟᱦᱮᱫ)",
      counterName: "ᱠᱟᱣᱩᱱᱴᱟᱨ 04"
    },
    sd: {
      deptName: "پلمونولوجي (ڦڦڙن ۽ ساهه جي بيمارين جو شعبو)",
      doctorName: "ڊاڪٽر اروند مهتا (ساهه جي بيمارين جو ماهر)",
      roomName: "ڪمرو 104 (ڇاتي ۽ ساهه)",
      counterName: "ڪائونٽر 04"
    },
    ta: {
      deptName: "நுரையீரல் மற்றும் சுவாச நோய் பிரிவு (Pulmonology)",
      doctorName: "டாக்டர் அரவிந்த் மேத்தா (நுரையீரல் நிபுணர்)",
      roomName: "அறை 104 (மார்பு & சுவாசம்)",
      counterName: "கவுண்டர் 04"
    },
    te: {
      deptName: "పల్మోనాలజీ (ఊపిరితిత్తులు & శ్వాసకోశ విభాగం)",
      doctorName: "డా. అరవింద్ మెహతా (పల్మోనాలజిస్ట్)",
      roomName: "గది 104 (ఛాతీ & శ్వాసకోశ)",
      counterName: "కౌంటర్ 04"
    },
    ur: {
      deptName: "شعبہ امراضِ تنفس و پھیپھڑے (Pulmonology)",
      doctorName: "ڈاکٹر اروند مہتا (ماہر امراضِ تنفس)",
      roomName: "کمرہ 104 (سینہ اور سانس)",
      counterName: "کاؤنٹر 04"
    },
    brx: {
      deptName: "पुलमोनोलजि (बिफांग आरो बिखानि विभाग)",
      doctorName: "डा. अरविन्द मेहेता (बिफांग विशेषज्ञ)",
      roomName: "खथा 104 (बिखा आरो हासथाय)",
      counterName: "काउन्टार 04"
    },
    doi: {
      deptName: "फेफड़े ते श्वसन रोग विभाग",
      doctorName: "डॉ. अरविंद मेहता (फेफड़े रोग विशेषज्ञ)",
      roomName: "कमरा १०४ (छाती ते श्वसन)",
      counterName: "काउंटर ०४"
    },
    ks: {
      deptName: "پلمونولوجی (پھیپھڑن تہٕ شواسن ہند شعبہ)",
      doctorName: "ڈاکٹر اروند مہتا (پھیپھڑن ہند ماہر)",
      roomName: "کمرہ 104 (سینہ تہٕ شواس)",
      counterName: "کاؤنٹر 04"
    },
    kok: {
      deptName: "पल्मोनॉलॉजी (फुफ्फुस आनी श्वसन विकार विभाग)",
      doctorName: "डॉ. अरविंद मेहता (फुफ्फुस विकार तज्ज्ञ)",
      roomName: "कूड १०४ (हर्दें आनी श्वसन)",
      counterName: "काउंटर ०४"
    },
    mai: {
      deptName: "श्वसन एवं फेफड़ा रोग विभाग (पल्मोनोलॉजी)",
      doctorName: "डॉ. अरविंद मेहता (फेफड़ा रोग विशेषज्ञ)",
      roomName: "कोठरी 104 (छाती आ श्वास)",
      counterName: "काउंटर 04"
    }
  },
  cardiology: {
    en: {
      deptName: "Cardiology",
      doctorName: "Dr. Ananya Sharma (Cardiologist)",
      roomName: "Room 102 (Cardio OPD)",
      counterName: "Counter 02"
    },
    hi: {
      deptName: "हृदय रोग विभाग (कार्डियोलॉजी)",
      doctorName: "डॉ. अनन्या शर्मा (हृदय रोग विशेषज्ञ)",
      roomName: "कमरा 102 (कार्डियो ओपीडी)",
      counterName: "काउंटर 02"
    },
    bn: {
      deptName: "কার্ডিওলজি (হৃদরোগ বিভাগ)",
      doctorName: "ডা. অনন্যা শর্মা (হৃদরোগ বিশেষজ্ঞ)",
      roomName: "রুম ১০২ (কার্ডিও ওপিডি)",
      counterName: "কাউন্টার ০২"
    },
    as: {
      deptName: "কার্ডিঅ'লজি (হৃদৰোগ বিভাগ)",
      doctorName: "ডাঃ অনন্যা শৰ্মা (হৃদৰোগ বিশেষজ্ঞ)",
      roomName: "ৰূম ১০২ (কাৰ্ডিঅ' অ'পিডি)",
      counterName: "কাউণ্টাৰ ০২"
    },
    gu: {
      deptName: "કાર્ડિયોલોજી (હૃદય રોગ વિભાગ)",
      doctorName: "ડૉ. અનન્યા શર્મા (હૃદય રોગ નિષ્ણાત)",
      roomName: "રૂમ 102 (કાર્ડિયો ઓપીડી)",
      counterName: "કાઉન્ટર 02"
    },
    kn: {
      deptName: "ಕಾರ್ಡಿಯಾಲಜಿ (ಹೃದ್ರೋಗ ವಿಭಾಗ)",
      doctorName: "ಡಾ. ಅನನ್ಯಾ ಶರ್ಮಾ (ಹೃದ್ರೋಗ ತಜ್ಞರು)",
      roomName: "ರೂಮ್ 102 (ಕಾರ್ಡಿಯೋ ಒಪಿಡಿ)",
      counterName: "ಕೌಂಟರ್ 02"
    },
    ml: {
      deptName: "കാർഡിയോളജി (ഹൃദ്രോഗ വിഭാഗം)",
      doctorName: "ഡോ. അനന്യ ശർമ്മ (ഹൃദ്രോഗ വിദഗ്ദ്ധ)",
      roomName: "റൂം 102 (കാർഡിയോ ഒപിഡി)",
      counterName: "കൗണ്ടർ 02"
    },
    mni: {
      deptName: "কার্ডিওলজি (থৱাই থবকলোন বিভাগ)",
      doctorName: "ডাঃ অনন্যা শর্মা (থৱাই থবকলোন বিশেষজ্ঞ)",
      roomName: "কা 102 (কার্ডিও ওপীদী)",
      counterName: "কাউন্টার 02"
    },
    mr: {
      deptName: "हृदयरोग विभाग (कार्डिओलॉजी)",
      doctorName: "डॉ. अनन्या शर्मा (हृदयरोग तज्ज्ञ)",
      roomName: "रूम १०२ (कार्डिओ ओपीडी)",
      counterName: "काउंटर ०२"
    },
    ne: {
      deptName: "मुटुरोग विभाग (कार्डियोलोजी)",
      doctorName: "डा. अनन्या शर्मा (मुटुरोग विशेषज्ञ)",
      roomName: "कोठा १०२ (कार्डियो ओपिडी)",
      counterName: "काउन्टर ०२"
    },
    or: {
      deptName: "ହୃଦରୋଗ ବିଭାଗ (Cardiology)",
      doctorName: "ଡା. ଅନନ୍ୟା ଶର୍ମା (ହୃଦରୋଗ ବିଶେଷଜ୍ଞ)",
      roomName: "ରୁମ୍ ୧୦୨ (କାର୍ଡିଓ ଓପିଡି)",
      counterName: "କାଉଣ୍ଟର ୦୨"
    },
    pa: {
      deptName: "ਕਾਰਡੀਓਲੋਜੀ (ਦਿਲ ਦੀ ਬਿਮਾਰੀ ਵਿਭਾਗ)",
      doctorName: "ਡਾ. ਅਨੰਨਿਆ ਸ਼ਰਮਾ (ਦਿਲ ਦੇ ਰੋਗਾਂ ਦੇ ਮਾਹਿਰ)",
      roomName: "ਕਮਰਾ 102 (ਕਾਰਡੀਓ ਓਪੀਡੀ)",
      counterName: "ਕਾਊਂਟਰ 02"
    },
    sa: {
      deptName: "हृदयरोग विभागः",
      doctorName: "डा. अनन्या शर्मा (हृदयरोग विशेषज्ञः)",
      roomName: "प्रकोष्ठम् १०२ (हृदयरोग ओपीडी)",
      counterName: "काउण्टर ०२"
    },
    sat: {
      deptName: "ᱠᱟᱨᱰᱤᱭᱳᱞᱳᱡᱤ (ᱫᱤᱞ ᱵᱮᱢᱟᱨ ᱵᱤᱵᱷᱟᱜᱽ)",
      doctorName: "ᱰᱟ. ᱚᱱᱚᱱᱭᱟ ᱥᱚᱨᱢᱟ (ᱫᱤᱞ ᱵᱤᱥᱮᱥᱚᱜᱽᱭᱚ)",
      roomName: "ᱠᱩᱴᱷᱨᱤ 102 (ᱠᱟᱨᱰᱤᱭᱳ ᱳᱯᱤᱰᱤ)",
      counterName: "ᱠᱟᱣᱩᱱᱴᱟᱨ 02"
    },
    sd: {
      deptName: "ڪارڊيالاجي (دل جي بيمارين جو شعبو)",
      doctorName: "ڊاڪٽر اننيا شرما (دل جي بيمارين جي ماهر)",
      roomName: "ڪمرو 102 (ڪارڊيو او پي ڊي)",
      counterName: "ڪائونٽر 02"
    },
    ta: {
      deptName: "இதயவியல் பிரிவு (Cardiology)",
      doctorName: "டாக்டர் அனன்யா சர்மா (இதயவியல் நிபுணர்)",
      roomName: "அறை 102 (கார்டியோ ஓபிடி)",
      counterName: "கவுண்டர் 02"
    },
    te: {
      deptName: "కార్డియాలజీ (గుండె జబ్బుల విభాగం)",
      doctorName: "డా. అనన్య శర్మ (కార్డియాలజిస్ట్)",
      roomName: "గది 102 (కార్డియో ఓపీడీ)",
      counterName: "కౌంటర్ 02"
    },
    ur: {
      deptName: "امراضِ قلب شعبہ (Cardiology)",
      doctorName: "ڈاکٹر اننیا شرما (ماہر امراضِ قلب)",
      roomName: "کمرہ 102 (کارڈیو او پی ڈی)",
      counterName: "کاؤنٹر 02"
    },
    brx: {
      deptName: "कार्डिओलजि (बिखानि विभाग)",
      doctorName: "डा. अनन्या शर्मा (बिखा विशेषज्ञ)",
      roomName: "खथा 102 (कार्डिओ ओपिडि)",
      counterName: "काउन्टार 02"
    },
    doi: {
      deptName: "हृदय रोग विभाग",
      doctorName: "डॉ. अनन्या शर्मा (हृदय रोग विशेषज्ञ)",
      roomName: "कमरा १०२ (कार्डियो ओपीडी)",
      counterName: "काउंटर ०२"
    },
    ks: {
      deptName: "کارڈیالوجی (دلہِ ہند شعبہ)",
      doctorName: "ڈاکٹر اننیا شرما (دلہِ ہند ماہر)",
      roomName: "کمرہ 102 (کارڈیو او پی ڈی)",
      counterName: "کاؤنٹر 02"
    },
    kok: {
      deptName: "कार्डिओलॉजी (काळजाचे विकार विभाग)",
      doctorName: "डॉ. अनन्या शर्मा (काळजाचे विकार तज्ज्ञ)",
      roomName: "कूड १०२ (कार्डिओ ओपीडी)",
      counterName: "काउंटर ०२"
    },
    mai: {
      deptName: "हृदय रोग विभाग (कार्डियोलॉजी)",
      doctorName: "डॉ. अनन्या शर्मा (हृदय रोग विशेषज्ञ)",
      roomName: "कोठरी 102 (कार्डियो ओपीडी)",
      counterName: "काउंटर 02"
    }
  },
  emergency_trauma: {
    en: {
      deptName: "Emergency & Trauma",
      doctorName: "Dr. Vikram Singh (Chief Trauma Officer)",
      roomName: "Room 01 (Trauma Bay)",
      counterName: "Counter ER-01"
    },
    hi: {
      deptName: "आपातकालीन एवं ट्रॉमा विभाग",
      doctorName: "डॉ. विक्रम सिंह (मुख्य आपातकालीन अधिकारी)",
      roomName: "कमरा 01 (ट्रॉमा बे)",
      counterName: "काउंटर ER-01"
    },
    bn: {
      deptName: "জরুরি ও ট্রমা বিভাগ",
      doctorName: "ডাঃ বিক্রম সিং (প্রধান ট্রমা অফিসার)",
      roomName: "রুম ০১ (ট্রমা বে)",
      counterName: "কাউন্টার ইআর-০১"
    },
    as: {
      deptName: "জৰুৰীকালীন আৰু ট্ৰমা বিভাগ",
      doctorName: "ডাঃ বিক্ৰম সিং (মুখ্য ট্ৰমা বিষয়া)",
      roomName: "ৰূম ০১ (ট্ৰমা বে)",
      counterName: "কাউণ্টাৰ ইআৰ-০১"
    },
    gu: {
      deptName: "ઇમરજન્સી અને ટ્રોમા વિભાગ",
      doctorName: "ડૉ. વિક્રમ સિંહ (ચીફ ટ્રોમા ઓફિસર)",
      roomName: "રૂમ 01 (ટ્રોમા બે)",
      counterName: "કાઉન્ટર ER-01"
    },
    kn: {
      deptName: "ತುರ್ತು ಮತ್ತು ಟ್ರಾಮಾ ವಿಭಾಗ",
      doctorName: "ಡಾ. ವಿಕ್ರಮ್ ಸಿಂಗ್ (ಮುಖ್ಯ ಟ್ರಾಮಾ ಅಧಿಕಾರಿ)",
      roomName: "ರೂಮ್ 01 (ಟ್ರಾಮಾ ಬೇ)",
      counterName: "ಕೌಂಟರ್ ER-01"
    },
    ml: {
      deptName: "അടിയന്തര വിഭാഗം (ട്രോമ)",
      doctorName: "ഡോ. വിക്രം സിംഗ് (ചീഫ് ട്രോമ ഓഫീസർ)",
      roomName: "റൂം 01 (ട്രോമ ബേ)",
      counterName: "കൗണ്ടർ ER-01"
    },
    mni: {
      deptName: "জরুরি অমসুং ট্রোমা বিভাগ",
      doctorName: "ডাঃ বিক্রম সিংহ (চীফ ট্রোমা ওফিসার)",
      roomName: "কা 01 (ট্রোমা বে)",
      counterName: "কাউন্টার ER-01"
    },
    mr: {
      deptName: "आणीबाणी आणि ट्रॉमा विभाग",
      doctorName: "डॉ. विक्रम सिंग (मुख्य आपत्कालीन अधिकारी)",
      roomName: "रूम ०१ (ट्रॉमा बे)",
      counterName: "काउंटर ER-01"
    },
    ne: {
      deptName: "आकस्मिक तथा ट्रमा विभाग",
      doctorName: "डा. विक्रम सिंह (मुख्य ट्रमा अधिकृत)",
      roomName: "कोठा 01 (ट्रमा बे)",
      counterName: "काउन्टर ER-01"
    },
    or: {
      deptName: "ଅତ୍ୟାବଶ୍ୟକୀୟ ଓ ଟ୍ରମା ବିଭାଗ",
      doctorName: "ଡା. ବିକ୍ରମ ସିଂହ (ମୁଖ୍ୟ ଟ୍ରମା ଅଧିକାରୀ)",
      roomName: "ରୁମ୍ ୦୧ (ଟ୍ରମା ବେ)",
      counterName: "କାଉଣ୍ଟର ER-01"
    },
    pa: {
      deptName: "ਐਮਰਜੈਂਸੀ ਅਤੇ ਟਰਾਮਾ ਵਿਭਾਗ",
      doctorName: "ਡਾ. ਵਿਕਰਮ ਸਿੰਘ (ਮੁੱਖ ਟਰਾਮਾ ਅਫ਼ਸਰ)",
      roomName: "ਕਮਰਾ 01 (ਟਰਾਮਾ ਬੇ)",
      counterName: "ਕਾਊਂਟਰ ER-01"
    },
    sa: {
      deptName: "आत्ययिक तथा आघात विभागः",
      doctorName: "डा. विक्रम सिंहः (मुख्य आत्ययिक अधिकारी)",
      roomName: "प्रकोष्ठम् 01 (आघात विभागः)",
      counterName: "काउण्टर ER-01"
    },
    sat: {
      deptName: "ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱟᱨ ᱴᱨᱚᱢᱟ ᱵᱤᱵᱷᱟᱜᱽ",
      doctorName: "ᱰᱟ. ᱵᱤᱠᱨᱚᱢ ᱥᱤᱝ (ᱢᱩᱬᱩᱛ ᱴᱨᱚᱢᱟ ᱚᱯᱷᱤᱥᱟᱨ)",
      roomName: "ᱠᱩᱴᱷᱨᱤ 01 (ᱴᱨᱚᱢᱟ ᱵᱮ)",
      counterName: "ᱠᱟᱣᱩᱱᱴᱟᱨ ER-01"
    },
    sd: {
      deptName: "ايمرجنسي ۽ ٽراما شعبو",
      doctorName: "ڊاڪٽر وڪرم سنگهه (چيف ٽراما آفيسر)",
      roomName: "ڪمرو 01 (ٽراما بي)",
      counterName: "ڪائونٽر ER-01"
    },
    ta: {
      deptName: "அவசர மற்றும் அதிர்ச்சி சிகிச்சை பிரிவு",
      doctorName: "டாக்டர் விக்ரம் சிங் (தலைமை அதிர்ச்சி அதிகாரி)",
      roomName: "அறை 01 (டிராமா பே)",
      counterName: "கவுண்டர் ER-01"
    },
    te: {
      deptName: "అత్యవసర మరియు ట్రామా విభాగం",
      doctorName: "డా. విక్రమ్ సింగ్ (ముఖ్య ట్రామా అధికారి)",
      roomName: "గది 01 (ట్రామా బే)",
      counterName: "కౌంటర్ ER-01"
    },
    ur: {
      deptName: "ایمرجنسی اور ٹراما شعبہ",
      doctorName: "ڈاکٹر وکرم سنگھ (چیف ٹراما آفیسر)",
      roomName: "کمرہ 01 (ٹراما بے)",
      counterName: "کاؤنٹر ER-01"
    },
    brx: {
      deptName: "इमरजेंसी आरो ट्रमा विभाग",
      doctorName: "डा. बिक्रम सिं (गाहाय ट्रमा अफिसार)",
      roomName: "खथा 01 (ट्रमा बे)",
      counterName: "काउन्टार ER-01"
    },
    doi: {
      deptName: "इमरजेंसी ते ट्रॉमा विभाग",
      doctorName: "डॉ. विक्रम सिंह (मुख्य ट्रॉमा अधिकारी)",
      roomName: "कमरा 01 (ट्रॉमा बे)",
      counterName: "काउंटर ER-01"
    },
    ks: {
      deptName: "ایمرجنسی تہٕ ٹراما ڈیپارٹمنٹ",
      doctorName: "ڈاکٹر وکرم سنگھ (چیف ٹراما آفیسر)",
      roomName: "کمرہ 01 (ٹراما بے)",
      counterName: "کاؤنٹر ER-01"
    },
    kok: {
      deptName: "इमर्जन्सी आनी ट्रॉमा विभाग",
      doctorName: "डॉ. विक्रम सिंग (मुखेल ट्रॉमा अधिकारी)",
      roomName: "कूड 01 (ट्रॉमा बे)",
      counterName: "काउंटर ER-01"
    },
    mai: {
      deptName: "आपातकालीन एवं ट्रॉमा विभाग",
      doctorName: "डॉ. विक्रम सिंह (मुख्य आपातकालीन अधिकारी)",
      roomName: "कोठरी 01 (ट्रॉमा बे)",
      counterName: "काउंटर ER-01"
    }
  },
  gastroenterology: {
    en: {
      deptName: "Gastroenterology",
      doctorName: "Dr. Priya Deshmukh (Gastroenterologist)",
      roomName: "Room 106 (Gastro & Liver)",
      counterName: "Counter 06"
    },
    hi: {
      deptName: "पेट व पाचन रोग विभाग (गैस्ट्रोएंटरोलॉजी)",
      doctorName: "डॉ. प्रिया देशमुख (पेट व यकृत रोग विशेषज्ञ)",
      roomName: "कमरा 106 (गैस्ट्रो एवं लिवर)",
      counterName: "काउंटर 06"
    },
    bn: {
      deptName: "গ্যাস্ট্রোএন্টারোলজি (পরিপাকতন্ত্র ও যকৃৎ বিভাগ)",
      doctorName: "ডা. প্রিয়া দেশমুখ (পরিপাকতন্ত্র বিশেষজ্ঞ)",
      roomName: "রুম ১০৬ (গ্যাস্ট্রো ও লিভার)",
      counterName: "কাউন্টার ০৬"
    },
    as: {
      deptName: "গেষ্ট্ৰ'এণ্টেৰ'লজি (পাকস্থলী আৰু যকৃত বিভাগ)",
      doctorName: "ডাঃ প্ৰিয়া দেশমুখ (গেষ্ট্ৰ' বিশেষজ্ঞ)",
      roomName: "ৰূম ১০৬ (গেষ্ট্ৰ' আৰু লিভাৰ)",
      counterName: "কাউণ্টাৰ ০৬"
    },
    gu: {
      deptName: "ગેસ્ટ્રોએન્ટેરોલોજી (પાચનતંત્ર અને લીવર રોગ વિભાગ)",
      doctorName: "ડૉ. પ્રિયા દેશમુખ (ગેસ્ટ્રોએન્ટેરોલોજિસ્ટ)",
      roomName: "રૂમ 106 (ગેસ્ટ્રો અને લીવર)",
      counterName: "કાઉન્ટર 06"
    },
    kn: {
      deptName: "ಗ್ಯಾಸ್ಟ್ರೋಎಂಟರಾಲಜಿ (ಜೀರ್ಣಾಂಗ ಮತ್ತು ಯಕೃತ್ ವಿಭಾಗ)",
      doctorName: "ಡಾ. ಪ್ರಿಯಾ ದೇಶಮುಖ್ (ಗ್ಯಾಸ್ಟ್ರೋಎಂಟರಾಲಜಿಸ್ಟ್)",
      roomName: "ರೂಮ್ 106 (ಗ್ಯಾಸ್ಟ್ರೋ & ಲಿವರ್)",
      counterName: "ಕೌಂಟರ್ 06"
    },
    ml: {
      deptName: "ഗ്യാസ്ട്രോഎൻട്രോളജി (ദഹന-കരൾ രോഗ വിഭാഗം)",
      doctorName: "ഡോ. പ്രിയ ദേശ്മുഖ് (ഗ്യാസ്ട്രോഎൻട്രോളജിസ്റ്റ്)",
      roomName: "റൂം 106 (ഗ്യാസ്ട്രോ & ലിവർ)",
      counterName: "കൗണ്ടർ 06"
    },
    mni: {
      deptName: "গেস্ট্রোএন্টেরোলজি (হকচাং পৈশিন বিভাগ)",
      doctorName: "ডাঃ প্রিয়া দেশমুখ (গেস্ট্রোএন্টেরোলজিস্ট)",
      roomName: "কা 106 (গেস্ট্রো অমসুং লিভর)",
      counterName: "কাউন্টার 06"
    },
    mr: {
      deptName: "पोट व पचनसंस्था विकार विभाग (गॅस्ट्रोएन्टेरॉलॉजी)",
      doctorName: "डॉ. प्रिया देशमुख (पचनसंस्था तज्ज्ञ)",
      roomName: "रूम १०६ (गॅस्ट्रो व लिव्हर)",
      counterName: "काउंटर ०६"
    },
    ne: {
      deptName: "पेट तथा कलेजो रोग विभाग (ग्यास्ट्रोएन्टेरोलोजी)",
      doctorName: "डा. प्रिया देशमुख (पेट तथा कलेजो विशेषज्ञ)",
      roomName: "कोठा १०६ (ग्यास्ट्रो र लिभर)",
      counterName: "काउन्टर ०६"
    },
    or: {
      deptName: "ପାକସ୍ଥଳୀ ଓ ଯକୃତ ରୋଗ ବିଭାଗ (Gastroenterology)",
      doctorName: "ଡା. ପ୍ରିୟା ଦେଶମୁଖ (ପାକସ୍ଥଳୀ ରୋଗ ବିଶେଷଜ୍ଞ)",
      roomName: "ରୁମ୍ ୧୦୬ (ଗ୍ୟାଷ୍ଟ୍ରୋ ଓ ଲିଭର)",
      counterName: "କାଉଣ୍ଟର ୦୬"
    },
    pa: {
      deptName: "ਗੈਸਟ੍ਰੋਐਂਟਰੋਲੋਜੀ (ਪੇਟ ਅਤੇ ਪਾਚਨ ਪ੍ਰਣਾਲੀ ਵਿਭਾਗ)",
      doctorName: "ਡਾ. ਪ੍ਰਿਆ ਦੇਸ਼ਮੁਖ (ਪੇਟ ਦੇ ਰੋਗਾਂ ਦੇ ਮਾਹਿਰ)",
      roomName: "ਕਮਰਾ 106 (ਗੈਸਟ੍ਰੋ ਅਤੇ ਲਿਵਰ)",
      counterName: "ਕਾਊਂਟਰ 06"
    },
    sa: {
      deptName: "उदर तथा पाचनतन्त्ररोग विभागः",
      doctorName: "डा. प्रिया देशमुख (उदररोग विशेषज्ञः)",
      roomName: "प्रकोष्ठम् १०६ (गैस्ट्रो तथा यकृत्)",
      counterName: "काउण्टर ०६"
    },
    sat: {
      deptName: "ᱜᱮᱥᱴᱨᱳᱮᱱᱴᱮᱨᱳᱞᱳᱡᱤ (ᱞᱟᱡ ᱟᱨ ᱦᱟᱡᱚᱢ ᱵᱤᱵᱷᱟᱜᱽ)",
      doctorName: "ᱰᱟ. ᱯᱨᱤᱭᱟ ᱫᱮᱥᱢᱩᱠᱷ (ᱜᱮᱥᱴᱨᱳ ᱵᱤᱥᱮᱥᱚᱜᱽᱭᱚ)",
      roomName: "ᱠᱩᱴᱷᱨᱤ 106 (ᱜᱮᱥᱴᱨᱳ ᱟᱨ ᱞᱤᱵᱷᱟᱨ)",
      counterName: "ᱠᱟᱣᱩᱱᱴᱟᱨ 06"
    },
    sd: {
      deptName: "گيسٽرو اينٽرولاجي (پيٽ ۽ جگر جي بيمارين جو شعبو)",
      doctorName: "ڊاڪٽر پريا ديشمک (پيٽ جي بيمارين جي ماهر)",
      roomName: "ڪمرو 106 (گيسٽرو ۽ جگر)",
      counterName: "ڪائونٽر 06"
    },
    ta: {
      deptName: "செரிமான மற்றும் கல்லீரல் பிரிவு (Gastroenterology)",
      doctorName: "டாக்டர் பிரியா தேஷ்முக் (இரைப்பை குடல் நிபுணர்)",
      roomName: "அறை 106 (காஸ்ட்ரோ & கல்லீரல்)",
      counterName: "கவுண்டர் 06"
    },
    te: {
      deptName: "గ్యాస్ట్రోఎంటరాలజీ (జీర్ణకోశ & కాలేయ విభాగం)",
      doctorName: "డా. ప్రియా దేశ్‌ముఖ్ (గ్యాస్ట్రోఎంటరాలజిస్ట్)",
      roomName: "గది 106 (గ్యాస్ట్రో & లివర్)",
      counterName: "కౌంటర్ 06"
    },
    ur: {
      deptName: "شعبہ امراضِ معدہ و جگر (Gastroenterology)",
      doctorName: "ڈاکٹر پریا دیشمکھ (ماہر امراضِ معدہ)",
      roomName: "کمرہ 106 (گیسٹرو اور جگر)",
      counterName: "کاؤنٹر 06"
    },
    brx: {
      deptName: "गैस्ट्रोएन्तेरोलजि (उदै आरो जिबौ विभाग)",
      doctorName: "डा. प्रिया देशमूख (उदै विशेषज्ञ)",
      roomName: "खथा 106 (गैस्ट्रो आरो लिभार)",
      counterName: "काउन्टार 06"
    },
    doi: {
      deptName: "पेट ते लिवर रोग विभाग",
      doctorName: "डॉ. प्रिया देशमुख (पेट रोग विशेषज्ञ)",
      roomName: "कमरा १०६ (गैस्ट्रो ते लिवर)",
      counterName: "काउंटर ०६"
    },
    ks: {
      deptName: "گیسٹرو اینٹرولوجی (معدہ تہٕ جگرک شعبہ)",
      doctorName: "ڈاکٹر پریا دیشمکھ (معدہ ہند ماہر)",
      roomName: "کمرہ 106 (گیسٹرو تہٕ لیور)",
      counterName: "کاؤنٹر 06"
    },
    kok: {
      deptName: "गॅस्ट्रोएन्टेरोलॉजी (पोट आनी काळीज विकार विभाग)",
      doctorName: "डॉ. प्रिया देशमुख (गॅस्ट्रो तज्ज्ञ)",
      roomName: "कूड १०६ (गॅस्ट्रो आनी लिव्हर)",
      counterName: "काउंटर ०६"
    },
    mai: {
      deptName: "पेट एवं पाचन रोग विभाग (गैस्ट्रोएंटरोलॉजी)",
      doctorName: "डॉ. प्रिया देशमुख (पेट रोग विशेषज्ञ)",
      roomName: "कोठरी 106 (गैस्ट्रो आ लिवर)",
      counterName: "काउंटर 06"
    }
  },
  neurology: {
    en: {
      deptName: "Neurology",
      doctorName: "Dr. Rajesh Iyer (Neurologist)",
      roomName: "Room 108 (Neuro OPD)",
      counterName: "Counter 08"
    },
    hi: {
      deptName: "मस्तिष्क व तंत्रिका रोग विभाग (न्यूरोलॉजी)",
      doctorName: "डॉ. राजेश अय्यर (मस्तिष्क रोग विशेषज्ञ)",
      roomName: "कमरा 108 (न्यूरो ओपीडी)",
      counterName: "काउंटर 08"
    },
    bn: {
      deptName: "নিউরোলজি (স্নায়ু ও মস্তিষ্ক রোগ বিভাগ)",
      doctorName: "ডা. রাজেশ আইয়ার (স্নায়ুরোগ বিশেষজ্ঞ)",
      roomName: "রুম ১০৮ (নিউরো ওপিডি)",
      counterName: "কাউন্টার ০৮"
    },
    as: {
      deptName: "নিউৰ'লজি (স্নায়ু আৰু মগজু ৰোগ বিভাগ)",
      doctorName: "ডাঃ ৰাজেশ আয়াৰ (স্নায়ুৰোগ বিশেষজ্ঞ)",
      roomName: "ৰূম ১০৮ (নিউৰ' অ'পিডি)",
      counterName: "কাউণ্টাৰ ০৮"
    },
    gu: {
      deptName: "ન્યુરોલોજી (મગજ અને ચેતાતંત્ર રોગ વિભાગ)",
      doctorName: "ડૉ. રાજેશ ઐયર (ન્યુરોલોજિસ્ટ)",
      roomName: "રૂમ 108 (ન્યુરો ઓપીડી)",
      counterName: "કાઉન્ટર 08"
    },
    kn: {
      deptName: "ನ್ಯೂರಾಲಜಿ (ಮೆದುಳು ಮತ್ತು ನರರೋಗ ವಿಭಾಗ)",
      doctorName: "ಡಾ. ರಾಜೇಶ್ ಅಯ್ಯರ್ (ನ್ಯೂರಾಲಜಿಸ್ಟ್)",
      roomName: "ರೂಮ್ 108 (ನ್ಯೂರೋ ಒಪಿಡಿ)",
      counterName: "ಕೌಂಟರ್ 08"
    },
    ml: {
      deptName: "ന്യൂറോളജി (നാഡീ-തലച്ചോറ് രോഗ വിഭാഗം)",
      doctorName: "ഡോ. രാജേഷ് അയ്യർ (ന്യൂറോളജിസ്റ്റ്)",
      roomName: "റൂം 108 (ന്യൂറോ ഒപിഡി)",
      counterName: "കൗണ്ടർ 08"
    },
    mni: {
      deptName: "নিউরোলোজি (লৌরুক অমসুং মশেক বিভাগ)",
      doctorName: "ডাঃ রাজেশ আয়ার (নিউরোলোজিস্ট)",
      roomName: "কা 108 (নিউরো ওপীদী)",
      counterName: "কাউন্টার 08"
    },
    mr: {
      deptName: "मेंदू व मज्जासंस्था विकार विभाग (न्यूरॉलॉजी)",
      doctorName: "डॉ. राजेश अय्यर (मेंदू व मज्जारोग तज्ज्ञ)",
      roomName: "रूम १०८ (न्यूरो ओपीडी)",
      counterName: "काउंटर ०८"
    },
    ne: {
      deptName: "स्नायु तथा नसा रोग विभाग (न्युरोलोजी)",
      doctorName: "डा. राजेश अय्यर (न्युरोलोजिस्ट)",
      roomName: "कोठा १०८ (न्युरो ओपिडी)",
      counterName: "काउन्टर ०८"
    },
    or: {
      deptName: "ସ୍ନାୟୁ ଓ ମସ୍ତିଷ୍କ ରୋଗ ବିଭାଗ (Neurology)",
      doctorName: "ଡା. ରାଜେଶ ଆୟର (ସ୍ନାୟୁରୋଗ ବିଶେଷଜ୍ଞ)",
      roomName: "ରୁମ୍ ୧୦୮ (ନ୍ୟୁରୋ ଓପିଡି)",
      counterName: "କାଉଣ୍ଟର ୦୮"
    },
    pa: {
      deptName: "ਨਿਊਰੋਲੋਜੀ (ਦਿਮਾਗ ਅਤੇ ਨਸਾਂ ਦਾ ਵਿਭਾਗ)",
      doctorName: "ਡਾ. ਰਾਜੇਸ਼ ਅਈਅਰ (ਦਿਮਾਗ ਦੇ ਰੋਗਾਂ ਦੇ ਮਾਹਿਰ)",
      roomName: "ਕਮਰਾ 108 (ਨਿਊਰੋ ਓਪੀਡੀ)",
      counterName: "ਕਾਊਂਟਰ 08"
    },
    sa: {
      deptName: "मस्तिष्क तथा नाड़ीरोग विभागः",
      doctorName: "डा. राजेश अय्यर (नाड़ीरोग विशेषज्ञः)",
      roomName: "प्रकोष्ठम् १०८ (न्यूरो ओपीडी)",
      counterName: "काउण्टर ०८"
    },
    sat: {
      deptName: "ᱱᱤᱣᱨᱳᱞᱳᱡᱤ (ᱦᱟᱛᱟᱝ ᱟᱨ ᱥᱤᱨ ᱵᱤᱵᱷᱟᱜᱽ)",
      doctorName: "ᱰᱟ. ᱨᱟᱡᱮᱥ ᱟᱭᱟᱨ (ᱱᱤᱣᱨᱳ ᱵᱤᱥᱮᱥᱚᱜᱽᱭᱚ)",
      roomName: "ᱠᱩᱴᱷᱨᱤ 108 (ᱱᱤᱣᱨᱳ ᱳᱯᱤᱰᱤ)",
      counterName: "ᱠᱟᱣᱩᱱᱴᱟᱨ 08"
    },
    sd: {
      deptName: "نيورولاجي (دماغ ۽ نسن جي بيمارين جو شعبو)",
      doctorName: "ڊاڪٽر راجيش آئر (نيورولاجسٽ)",
      roomName: "ڪمرو 108 (نيورو او پي ڊي)",
      counterName: "ڪائونٽر 08"
    },
    ta: {
      deptName: "நரம்பியல் மற்றும் மூளை பிரிவு (Neurology)",
      doctorName: "டாக்டர் ராஜேஷ் ஐயர் (நரம்பியல் நிபுணர்)",
      roomName: "அறை 108 (நியூரோ ஓபிடி)",
      counterName: "கவுண்டர் 08"
    },
    te: {
      deptName: "న్యూరాలజీ (మెదడు & నరాల విభాగం)",
      doctorName: "డా. రాజేష్ అయ్యర్ (న్యూరాలజిస్ట్)",
      roomName: "గది 108 (న్యూరో ఓపీడీ)",
      counterName: "కౌంటర్ 08"
    },
    ur: {
      deptName: "شعبہ امراضِ دماغ و اعصاب (Neurology)",
      doctorName: "ڈاکٹر راجیش ائیر (ماہر اعصاب)",
      roomName: "کمرہ 108 (نیورو او پی ڈی)",
      counterName: "کاؤنٹر 08"
    },
    brx: {
      deptName: "निउरोलजि (मेगन आरो रोदा विभाग)",
      doctorName: "डा. राजेश आयर (निउरोलजिस्ट)",
      roomName: "खथा 108 (निउरो ओपिडि)",
      counterName: "काउन्टार 08"
    },
    doi: {
      deptName: "दिमाग ते नस रोग विभाग",
      doctorName: "डॉ. राजेश अय्यर (न्यूरोलॉजिस्ट)",
      roomName: "कमरा १०८ (न्यूरो ओपीडी)",
      counterName: "काउंटर ०८"
    },
    ks: {
      deptName: "نیورولوجی (دماغ تہٕ رگن ہند شعبہ)",
      doctorName: "ڈاکٹر راجیش ائیر (نیورولوجسٹ)",
      roomName: "کمرہ 108 (نیورو او پی ڈی)",
      counterName: "کاؤنٹر 08"
    },
    kok: {
      deptName: "न्यूरॉलॉजी (मेंदू आनी शिरां विकार विभाग)",
      doctorName: "डॉ. राजेश अय्यर (न्यूरोलॉजिस्ट)",
      roomName: "कूड १०८ (न्यूरो ओपीडी)",
      counterName: "काउंटर ०८"
    },
    mai: {
      deptName: "मस्तिष्क एवं तंत्रिका रोग विभाग (न्यूरोलॉजी)",
      doctorName: "डॉ. राजेश अय्यर (मस्तिष्क रोग विशेषज्ञ)",
      roomName: "कोठरी 108 (न्यूरो ओपीडी)",
      counterName: "काउंटर 08"
    }
  },
  orthopedics: {
    en: {
      deptName: "Orthopedics",
      doctorName: "Dr. Suresh Patel (Orthopedic Surgeon)",
      roomName: "Room 110 (Bone & Joint Clinic)",
      counterName: "Counter 10"
    },
    hi: {
      deptName: "हड्डी व जोड़ रोग विभाग (ऑर्थोपेडिक्स)",
      doctorName: "डॉ. सुरेश पटेल (अस्थि रोग विशेषज्ञ)",
      roomName: "कमरा 110 (हड्डी एवं जोड़ क्लीनिक)",
      counterName: "काउंटर 10"
    },
    bn: {
      deptName: "অর্থোপেডিক্স (অস্থি ও অস্থিসন্ধি রোগ বিভাগ)",
      doctorName: "ডা. সুরেশ প্যাটেল (অস্থিরোগ বিশেষজ্ঞ)",
      roomName: "রুম ১১০ (হাড় ও অস্থিসন্ধি ক্লিনিক)",
      counterName: "কাউন্টার ১০"
    },
    as: {
      deptName: "অৰ্থ'পেডিকছ (হাড় আৰু গাঁঠি ৰোগ বিভাগ)",
      doctorName: "ডাঃ সুৰেশ পেটেল (হাড়ৰ ৰোগ বিশেষজ্ঞ)",
      roomName: "ৰূম ১১০ (হাড় আৰু গাঁঠি ক্লিনিক)",
      counterName: "কাউণ্টাৰ ১০"
    },
    gu: {
      deptName: "ઓર્થોપેડિક્સ (હાડકાં અને સાંધાના રોગ વિભાગ)",
      doctorName: "ડૉ. સુરેશ પટેલ (હાડકાંના રોગ નિષ્ણાત)",
      roomName: "રૂમ 110 (હાડકાં અને સાંધા ક્લિનિક)",
      counterName: "કાઉન્ટર 10"
    },
    kn: {
      deptName: "ಆರ್ಥೋಪೆಡಿಕ್ಸ್ (ಮೂಳೆ ಮತ್ತು ಕೀಲು ರೋಗ ವಿಭಾಗ)",
      doctorName: "ಡಾ. ಸುರೇಶ್ ಪಟೇಲ್ (ಮೂಳೆ ತಜ್ಞರು)",
      roomName: "ರೂಮ್ 110 (ಮೂಳೆ & ಕೀಲು ಕ್ಲಿನಿಕ್)",
      counterName: "ಕೌಂಟರ್ 10"
    },
    ml: {
      deptName: "ഓർത്തോപീഡിക്സ് (അസ്ഥി-സന്ധി രോഗ വിഭാഗം)",
      doctorName: "ഡോ. സുരേഷ് പട്ടേൽ (ഓർത്തോപീഡിക് സർജൻ)",
      roomName: "റൂം 110 (അസ്ഥി & സന്ധി ക്ലിനിക്ക്)",
      counterName: "കൗണ്ടർ 10"
    },
    mni: {
      deptName: "ওর্থোপেডিক্স (শরু অমসুং সন্ধি বিভাগ)",
      doctorName: "ডাঃ সুরেশ প্যাটেল (ওর্থোপেডিক সর্জন)",
      roomName: "কা 110 (শরু ক্লিনিক)",
      counterName: "কাউন্টার 10"
    },
    mr: {
      deptName: "हाडे व सांधे विकार विभाग (ऑर्थोपेडिक्स)",
      doctorName: "डॉ. सुरेश पटेल (अस्थिरोग तज्ज्ञ)",
      roomName: "रूम ११० (हाडे व सांधे क्लिनिक)",
      counterName: "काउंटर १०"
    },
    ne: {
      deptName: "हाडजोर्नी रोग विभाग (अर्थोपेडिक्स)",
      doctorName: "डा. सुरेश पटेल (हाडजोर्नी विशेषज्ञ)",
      roomName: "कोठा ११० (हाडजोर्नी क्लिनिक)",
      counterName: "काउन्टर १०"
    },
    or: {
      deptName: "ଅସ୍ଥି ଓ ଗଣ୍ଠି ରୋଗ ବିଭାଗ (Orthopedics)",
      doctorName: "ଡା. ସୁରେଶ ପଟେଲ (ଅସ୍ଥିରୋଗ ବିଶେଷଜ୍ଞ)",
      roomName: "ରୁମ୍ ୧୧୦ (ଅସ୍ଥି ଓ ଗଣ୍ଠି କ୍ଲିନିକ୍)",
      counterName: "କାଉଣ୍ଟର ୧୦"
    },
    pa: {
      deptName: "ਆਰਥੋਪੈਡਿਕਸ (ਹੱਡੀਆਂ ਅਤੇ ਜੋੜਾਂ ਦਾ ਵਿਭਾਗ)",
      doctorName: "ਡਾ. ਸੁਰੇਸ਼ ਪਟੇਲ (ਹੱਡੀਆਂ ਦੇ ਮਾਹਿਰ)",
      roomName: "ਕਮਰਾ 110 (ਹੱਡੀਆਂ ਅਤੇ ਜੋੜ ਕਲੀਨਿਕ)",
      counterName: "ਕਾਊਂਟਰ 10"
    },
    sa: {
      deptName: "अस्थि तथा सन्धि-रोग विभागः",
      doctorName: "डा. सुरेश पटेल (अस्थिरोग विशेषज्ञः)",
      roomName: "प्रकोष्ठम् ११० (अस्थिसन्धि क्लिनिक)",
      counterName: "काउण्टर १०"
    },
    sat: {
      deptName: "ᱚᱨᱛᱷᱳᱯᱮᱰᱤᱠᱥ (ᱡᱟᱝ ᱟᱨ ᱡᱚᱲ ᱵᱤᱵᱷᱟᱜᱽ)",
      doctorName: "ᱰᱟ. ᱥᱩᱨᱮᱥ ᱯᱟᱴᱮᱞ (ᱡᱟᱝ ᱵᱤᱥᱮᱥᱚᱜᱽᱭᱚ)",
      roomName: "ᱠᱩᱴᱷᱨᱤ 110 (ᱡᱟᱝ ᱟᱨ ᱡᱚᱲ ᱠᱞᱤᱱᱤᱠ)",
      counterName: "ᱠᱟᱣᱩᱱᱴᱟᱨ 10"
    },
    sd: {
      deptName: "آرٿوپيڊڪس (هڏن ۽ سنڌن جي بيمارين جو شعبو)",
      doctorName: "ڊاڪٽر سريش پٽيل (هڏن جو ماهر)",
      roomName: "ڪمرو 110 (هڏن ۽ سنڌن جو ڪلينڪ)",
      counterName: "ڪائونٽر 10"
    },
    ta: {
      deptName: "எலும்பு மற்றும் மூட்டு சிகிச்சை பிரிவு (Orthopedics)",
      doctorName: "டாக்டர் சுரேஷ் படேல் (எலும்பியல் நிபுணர்)",
      roomName: "அறை 110 (எலும்பு & மூட்டு கிளினிக்)",
      counterName: "கவுண்டர் 10"
    },
    te: {
      deptName: "ఆర్థోపెడిక్స్ (ఎముకలు & కీళ్ళ విభాగం)",
      doctorName: "డా. సురేష్ పటేల్ (ఆర్థోపెడిక్ సర్జన్)",
      roomName: "గది 110 (బోన్ & జాయింట్ క్లినిక్)",
      counterName: "కౌంటర్ 10"
    },
    ur: {
      deptName: "شعبہ امراضِ ہڈی و جوڑ (Orthopedics)",
      doctorName: "ڈاکٹر سریش پٹیل (ماہر امراضِ ہڈی)",
      roomName: "کمرہ 110 (ہڈی و جوڑ کلینک)",
      counterName: "کاؤنٹر 10"
    },
    brx: {
      deptName: "अरथोपेडिक्स (बेगें आरो जयेन्द विभाग)",
      doctorName: "डा. सुरेश पतेल (बेगें विशेषज्ञ)",
      roomName: "खथा 110 (बेगें क्लिनिक)",
      counterName: "काउन्टार 10"
    },
    doi: {
      deptName: "हड्डी ते जोड़ रोग विभाग",
      doctorName: "डॉ. सुरेश पटेल (हड्डी रोग विशेषज्ञ)",
      roomName: "कमरा ११० (हड्डी ते जोड़ क्लिनिक)",
      counterName: "काउंटर १०"
    },
    ks: {
      deptName: "آرتھوپیڈکس (ہڈن تہٕ بندن ہند شعبہ)",
      doctorName: "ڈاکٹر سریش پٹیل (ہڈن ہند ماہر)",
      roomName: "کمرہ 110 (ہڈن ہند کلینک)",
      counterName: "کاؤنٹر 10"
    },
    kok: {
      deptName: "ऑर्थोपेडिक्स (हाडां आनी सांधे विकार विभाग)",
      doctorName: "डॉ. सुरेश पटेल (हाडां विकार तज्ज्ञ)",
      roomName: "कूड ११० (हाडां आनी सांधे क्लिनिक)",
      counterName: "काउंटर १०"
    },
    mai: {
      deptName: "हड्डी एवं जोड़ रोग विभाग (ऑर्थोपेडिक्स)",
      doctorName: "डॉ. सुरेश पटेल (हड्डी रोग विशेषज्ञ)",
      roomName: "कोठरी 110 (हड्डी आ जोड़ क्लीनिक)",
      counterName: "काउंटर 10"
    }
  },
  ent: {
    en: {
      deptName: "ENT",
      doctorName: "Dr. Neha Verma (ENT Specialist)",
      roomName: "Room 112 (Ear, Nose & Throat)",
      counterName: "Counter 12"
    },
    hi: {
      deptName: "कान, नाक व गला विभाग (ईएनटी)",
      doctorName: "डॉ. नेहा वर्मा (ईएनटी विशेषज्ञ)",
      roomName: "कमरा 112 (कान, नाक और गला)",
      counterName: "काउंटर 12"
    },
    bn: {
      deptName: "ইএনটি (কান, নাক ও গলা বিভাগ)",
      doctorName: "ডা. নেহা ভার্মা (ইএনটি বিশেষজ্ঞ)",
      roomName: "রুম ১১২ (কান, নাক ও গলা)",
      counterName: "কাউন্টার ১২"
    },
    as: {
      deptName: "ইএনটি (কাণ, নাক আৰু ডিঙি বিভাগ)",
      doctorName: "ডাঃ নেহা বাৰ্মা (ইএনটি বিশেষজ্ঞ)",
      roomName: "ৰূম ১১২ (কাণ, নাক আৰু ডিঙি)",
      counterName: "কাউণ্টাৰ ১২"
    },
    gu: {
      deptName: "ઇએનટી (કાન, નાક અને ગળાનો વિભાગ)",
      doctorName: "ડૉ. નેહા વર્મા (ઇએનટી નિષ્ણાત)",
      roomName: "રૂમ 112 (કાન, નાક અને ગળું)",
      counterName: "કાઉન્ટર 12"
    },
    kn: {
      deptName: "ಇಎನ್‌ಟಿ (ಕಿವಿ, ಮೂಗು ಮತ್ತು ಗಂಟಲು ವಿಭಾಗ)",
      doctorName: "ಡಾ. ನೇಹಾ ವರ್ಮಾ (ಇಎನ್‌ಟಿ ತಜ್ಞರು)",
      roomName: "ರೂಮ್ 112 (ಕಿವಿ, ಮೂಗು & ಗಂಟಲು)",
      counterName: "ಕೌಂಟರ್ 12"
    },
    ml: {
      deptName: "ഇ.എൻ.ടി (ചെവി, മൂക്ക്, തൊണ്ട വിഭാഗം)",
      doctorName: "ഡോ. നേഹ വർമ്മ (ഇ.എൻ.ടി സ്പെഷ്യലിസ്റ്റ്)",
      roomName: "റൂം 112 (ചെവി, മൂക്ക്, തൊണ്ട)",
      counterName: "കൗണ്ടർ 12"
    },
    mni: {
      deptName: "ইএনটি (নাখোং, নাখু অমসুং কংবি বিভাগ)",
      doctorName: "ডাঃ নেহা বর্মা (ইএনটি বিশেষজ্ঞ)",
      roomName: "কা 112 (ইএনটি)",
      counterName: "কাউন্টার 12"
    },
    mr: {
      deptName: "कान, नाक व घसा विकार विभाग (ईएनटी)",
      doctorName: "डॉ. नेहा वर्मा (ईएनटी तज्ज्ञ)",
      roomName: "रूम ११२ (कान, नाक आणि घसा)",
      counterName: "काउंटर १२"
    },
    ne: {
      deptName: "नाक, कान तथा घाँटी विभाग (इएनटी)",
      doctorName: "डा. नेहा वर्मा (इएनटी विशेषज्ञ)",
      roomName: "कोठा ११२ (नाक, कान र घाँटी)",
      counterName: "काउन्टर १२"
    },
    or: {
      deptName: "କାନ, ନାକ ଓ ଗଳା ବିଭାଗ (ENT)",
      doctorName: "ଡା. ନେହା ବର୍ମା (ENT ବିଶେଷଜ୍ଞ)",
      roomName: "ରୁମ୍ ୧୧୨ (କାନ, ନାକ ଓ ଗଳା)",
      counterName: "କାଉଣ୍ଟର ୧୨"
    },
    pa: {
      deptName: "ਈਐਨਟੀ (ਕੰਨ, ਨੱਕ ਅਤੇ ਗਲੇ ਦਾ ਵਿਭਾਗ)",
      doctorName: "ਡਾ. ਨੇਹਾ ਵਰਮਾ (ਈਐਨਟੀ ਮਾਹਿਰ)",
      roomName: "ਕਮਰਾ 112 (ਕੰਨ, ਨੱਕ ਅਤੇ ਗਲਾ)",
      counterName: "ਕਾਊਂਟਰ 12"
    },
    sa: {
      deptName: "कर्ण-नासा-कण्ठरोग विभागः",
      doctorName: "डा. नेहा वर्मा (कर्णनासाकण्ठ विशेषज्ञः)",
      roomName: "प्रकोष्ठम् ११२ (कर्णनासाकण्ठम्)",
      counterName: "काउण्टर १२"
    },
    sat: {
      deptName: "ᱤᱮᱱᱴᱤ (ᱞᱩᱛᱩᱨ, ᱢᱩᱸ ᱟᱨ ᱴᱚᱴᱠᱟ ᱵᱤᱵᱷᱟᱜᱽ)",
      doctorName: "ᱰᱟ. ᱱᱮᱦᱟ ᱵᱷᱟᱨᱢᱟ (ᱤᱮᱱᱴᱤ ᱵᱤᱥᱮᱥᱚᱜᱽᱭᱚ)",
      roomName: "ᱠᱩᱴᱷᱨᱤ 112 (ᱤᱮᱱᱴᱤ)",
      counterName: "ᱠᱟᱣᱩᱱᱴᱟᱨ 12"
    },
    sd: {
      deptName: "اي اين ٽي (ڪن، نڪ ۽ ڳلي جو شعبو)",
      doctorName: "ڊاڪٽر نيها ورما (اي اين ٽي ماهر)",
      roomName: "ڪمرو 112 (ڪن، نڪ ۽ ڳلو)",
      counterName: "ڪائونٽر 12"
    },
    ta: {
      deptName: "காது, மூக்கு, தொண்டை பிரிவு (ENT)",
      doctorName: "டாக்டர் நேகா வர்மா (ENT நிபுணர்)",
      roomName: "அறை 112 (காது, மூக்கு & தொண்டை)",
      counterName: "கவுண்டர் 12"
    },
    te: {
      deptName: "ఈఎన్టీ (చెవి, ముక్కు & గొంతు విభాగం)",
      doctorName: "డా. నేహా వర్మ (ఈఎన్టీ స్పెషలిస్ట్)",
      roomName: "గది 112 (చెవి, ముక్కు & గొంతు)",
      counterName: "కౌంటర్ 12"
    },
    ur: {
      deptName: "شعبہ ناک، کان اور گلا (ENT)",
      doctorName: "ڈاکٹر نیہا ورما (ماہر ای این ٹی)",
      roomName: "کمرہ 112 (ناک، کان اور گلا)",
      counterName: "کاؤنٹر 12"
    },
    brx: {
      deptName: "इयनति (खोमा, गन्थों आरो गलो विभाग)",
      doctorName: "डा. नेहा वर्मा (इयनति विशेषज्ञ)",
      roomName: "खथा 112 (खोमा, गन्थों)",
      counterName: "काउन्टार 12"
    },
    doi: {
      deptName: "कन्न, नक्क ते गला रोग विभाग",
      doctorName: "डॉ. नेहा वर्मा (ईएनटी विशेषज्ञ)",
      roomName: "कमरा ११२ (कन्न, नक्क ते गला)",
      counterName: "काउंटर १२"
    },
    ks: {
      deptName: "ای این ٹی (کن، نس تہٕ ہۆٹک شعبہ)",
      doctorName: "ڈاکٹر نیہا ورما (ای این ٹی ماہر)",
      roomName: "کمرہ 112 (ای این ٹی)",
      counterName: "کاؤنٹر 12"
    },
    kok: {
      deptName: "ईएनटी (कान, नाक आनी गोळो विभाग)",
      doctorName: "डॉ. नेहा वर्मा (ईएनटी तज्ज्ञ)",
      roomName: "कूड ११२ (कान, नाक आनी गोळो)",
      counterName: "काउंटर १२"
    },
    mai: {
      deptName: "कान, नाक एवं गला विभाग (ईएनटी)",
      doctorName: "डॉ. नेहा वर्मा (ईएनटी विशेषज्ञ)",
      roomName: "कोठरी 112 (कान, नाक आ गला)",
      counterName: "काउंटर 12"
    }
  },
  urology: {
    en: {
      deptName: "Urology",
      doctorName: "Dr. Alok Gupta (Urologist)",
      roomName: "Room 114 (Uro & Renal Clinic)",
      counterName: "Counter 14"
    },
    hi: {
      deptName: "मूत्र रोग विभाग (यूरोलॉजी)",
      doctorName: "डॉ. आलोक गुप्ता (मूत्र रोग विशेषज्ञ)",
      roomName: "कमरा 114 (यूरो एवं रीनल क्लीनिक)",
      counterName: "काउंटर 14"
    },
    bn: {
      deptName: "ইউরোলজি (মূত্রতন্ত্র ও মূত্রাশয় রোগ বিভাগ)",
      doctorName: "ডা. অলোক গুপ্ত (ইউরোলজিস্ট)",
      roomName: "রুম ১১৪ (ইউরো ও রেনাল ক্লিনিক)",
      counterName: "কাউন্টার ১৪"
    },
    as: {
      deptName: "ইউৰ'লজি (মূত্ৰতন্ত্ৰ ৰোগ বিভাগ)",
      doctorName: "ডাঃ অলোক গুপ্তা (ইউৰ'লজি বিশেষজ্ঞ)",
      roomName: "ৰূম ১১৪ (ইউৰ' ক্লিনিক)",
      counterName: "কাউণ্টাৰ ১৪"
    },
    gu: {
      deptName: "યુરોલોજી (મૂત્રમાર્ગ અને કિડની રોગ વિભાગ)",
      doctorName: "ડૉ. આલોક ગુપ્તા (યુરોલોજિસ્ટ)",
      roomName: "રૂમ 114 (યુરો ક્લિનિક)",
      counterName: "કાઉન્ટર 14"
    },
    kn: {
      deptName: "ಯುರಾಲಜಿ (ಮೂತ್ರಪಿಂಡ ಮತ್ತು ಮೂತ್ರಾಂಗ ರೋಗ ವಿಭಾಗ)",
      doctorName: "ಡಾ. ಅಲೋಕ್ ಗುಪ್ತಾ (ಯುರಾಲಜಿಸ್ಟ್)",
      roomName: "ರೂಮ್ 114 (ಯುರೋ & ರೀನಲ್ ಕ್ಲಿನಿಕ್)",
      counterName: "ಕೌಂಟರ್ 14"
    },
    ml: {
      deptName: "യൂറോളജി (മൂത്രരോഗ വിഭാഗം)",
      doctorName: "ഡോ. അലോക് ഗുപ്ത (യൂറോളജിസ്റ്റ്)",
      roomName: "റൂം 114 (യൂറോ ക്ലിനിക്ക്)",
      counterName: "കൗണ്ടർ 14"
    },
    mni: {
      deptName: "ইউরোলোজি (য়ুরিনারি বিভাগ)",
      doctorName: "ডাঃ অলোক গুপ্তা (ইউরোলোজিস্ট)",
      roomName: "কা 114 (ইউরো ক্লিনিক)",
      counterName: "কাউন্টার 14"
    },
    mr: {
      deptName: "मूत्रविकार विभाग (युरॉलॉजी)",
      doctorName: "डॉ. आलोक गुप्ता (मूत्ररोग तज्ज्ञ)",
      roomName: "रूम ११४ (युरो व रेनल क्लिनिक)",
      counterName: "काउंटर १४"
    },
    ne: {
      deptName: "मूत्ररोग विभाग (युरोलोजी)",
      doctorName: "डा. आलोक गुप्ता (युरोलोजिस्ट)",
      roomName: "कोठा ११४ (युरो क्लिनिक)",
      counterName: "काउन्टर १४"
    },
    or: {
      deptName: "ମୂତ୍ରରୋଗ ବିଭାଗ (Urology)",
      doctorName: "ଡା. ଆଲୋକ ଗୁପ୍ତା (ମୂତ୍ରରୋଗ ବିଶେଷଜ୍ଞ)",
      roomName: "ରୁମ୍ ୧୧୪ (ୟୁରୋ କ୍ଲିନିକ୍)",
      counterName: "କାଉଣ୍ଟର ୧୪"
    },
    pa: {
      deptName: "ਯੂਰੋਲੋਜੀ (ਪਿਸ਼ਾਬ ਪ੍ਰਣਾਲੀ ਦੇ ਰੋਗਾਂ ਦਾ ਵਿਭਾਗ)",
      doctorName: "ਡਾ. ਆਲੋਕ ਗੁਪਤਾ (ਯੂਰੋਲੋਜਿਸਟ)",
      roomName: "ਕਮਰਾ 114 (ਯੂਰੋ ਕਲੀਨਿਕ)",
      counterName: "ਕਾਊਂਟਰ 14"
    },
    sa: {
      deptName: "मूत्ररोग विभागः",
      doctorName: "डा. आलोक गुप्त (मूत्ररोग विशेषज्ञः)",
      roomName: "प्रकोष्ठम् ११४ (मूत्ररोग क्लिनिक)",
      counterName: "काउण्टर १४"
    },
    sat: {
      deptName: "ᱤᱣᱨᱳᱞᱳᱡᱤ (ᱤᱪ ᱨᱟᱥᱟ ᱵᱮᱢᱟᱨ ᱵᱤᱵᱷᱟᱜᱽ)",
      doctorName: "ᱰᱟ. ᱟᱞᱳᱠ ᱜᱩᱯᱛᱟ (ᱤᱣᱨᱳ ᱵᱤᱥᱮᱥᱚᱜᱽᱭᱚ)",
      roomName: "ᱠᱩᱴᱷᱨᱤ 114 (ᱤᱣᱨᱳ ᱠᱞᱤᱱᱤᱠ)",
      counterName: "ᱠᱟᱣᱩᱱᱴᱟᱨ 14"
    },
    sd: {
      deptName: "يورولاجي (پيشاب جي بيمارين جو شعبو)",
      doctorName: "ڊاڪٽر آلوڪ گپتا (يورولاجسٽ)",
      roomName: "ڪمرو 114 (يورو ڪلينڪ)",
      counterName: "ڪائونٽر 14"
    },
    ta: {
      deptName: "சிறுநீரகவியல் பிரிவு (Urology)",
      doctorName: "டாக்டர் அலோக் குப்தா (சிறுநீரகவியல் நிபுணர்)",
      roomName: "அறை 114 (யூரோ & ரீனல் கிளினிக்)",
      counterName: "கவுண்டர் 14"
    },
    te: {
      deptName: "యూరాలజీ (మూత్రకోశ విభాగం)",
      doctorName: "డా. అలోక్ గుప్తా (యూరాలజిస్ట్)",
      roomName: "గది 114 (యూరో క్లినిక్)",
      counterName: "కౌంటర్ 14"
    },
    ur: {
      deptName: "شعبہ امراضِ بول و گردہ (Urology)",
      doctorName: "ڈاکٹر آلوک گپتا (ماہر امراضِ بول)",
      roomName: "کمرہ 114 (یورو کلینک)",
      counterName: "کاؤنٹر 14"
    },
    brx: {
      deptName: "इउरोलजि (हासुग्रा रोदा विभाग)",
      doctorName: "डा. आलोक गुप्ता (इउरोलजिस्ट)",
      roomName: "खथा 114 (इउरो क्लिनिक)",
      counterName: "काउन्टार 14"
    },
    doi: {
      deptName: "मूत्र रोग विभाग",
      doctorName: "डॉ. आलोक गुप्ता (मूत्र रोग विशेषज्ञ)",
      roomName: "कमरा ११४ (यूरो क्लिनिक)",
      counterName: "काउंटर १४"
    },
    ks: {
      deptName: "یورولوجی (پیشابک شعبہ)",
      doctorName: "ڈاکٹر آلوک گپتا (یورولوجسٹ)",
      roomName: "کمرہ 114 (یورو کلینک)",
      counterName: "کاؤنٹر 14"
    },
    kok: {
      deptName: "युरोलॉजी (मूत विकार विभाग)",
      doctorName: "डॉ. आलोक गुप्ता (युरोलॉजिस्ट)",
      roomName: "कूड ११४ (युरो क्लिनिक)",
      counterName: "काउंटर १४"
    },
    mai: {
      deptName: "मूत्र रोग विभाग (यूरोलॉजी)",
      doctorName: "डॉ. आलोक गुप्ता (मूत्र रोग विशेषज्ञ)",
      roomName: "कोठरी 114 (यूरो क्लीनिक)",
      counterName: "काउंटर 14"
    }
  },
  dermatology: {
    en: {
      deptName: "Dermatology",
      doctorName: "Dr. Kavita Nair (Dermatologist)",
      roomName: "Room 116 (Skin Clinic)",
      counterName: "Counter 16"
    },
    hi: {
      deptName: "त्वचा रोग विभाग (डर्मेटोलॉजी)",
      doctorName: "डॉ. कविता नायर (त्वचा रोग विशेषज्ञ)",
      roomName: "कमरा 116 (त्वचा क्लीनिक)",
      counterName: "काउंटर 16"
    },
    bn: {
      deptName: "ডার্মাটোলজি (চর্ম ও ত্বক রোগ বিভাগ)",
      doctorName: "ডা. কবিতা নায়ার (চর্মরোগ বিশেষজ্ঞ)",
      roomName: "রুম ১১৬ (চর্ম ক্লিনিক)",
      counterName: "কাউন্টার ১৬"
    },
    as: {
      deptName: "ডাৰ্মাট'লজি (ছালৰ ৰোগ বিভাগ)",
      doctorName: "ডাঃ কবিতা নায়াৰ (ছালৰ ৰোগ বিশেষজ্ঞ)",
      roomName: "ৰূম ১১৬ (ছালৰ ক্লিনিক)",
      counterName: "কাউণ্টাৰ ১৬"
    },
    gu: {
      deptName: "ડર્મેટોલોજી (ચામડીના રોગ વિભાગ)",
      doctorName: "ડૉ. કવિતા નાયર (ચામડીના રોગ નિષ્ણાત)",
      roomName: "રૂમ 116 (સ્કિન ક્લિનિક)",
      counterName: "કાઉન્ટર 16"
    },
    kn: {
      deptName: "ಡರ್ಮಟಾಲಜಿ (ಚರ್ಮರೋಗ ವಿಭಾಗ)",
      doctorName: "ಡಾ. ಕವಿತಾ ನಾಯರ್ (ಚರ್ಮರೋಗ ತಜ್ಞರು)",
      roomName: "ರೂಮ್ 116 (ಚರ್ಮ ರೋಗ ಕ್ಲಿನಿಕ್)",
      counterName: "ಕೌಂಟರ್ 16"
    },
    ml: {
      deptName: "ഡെർമറ്റോളജി (ത്വക്ക് രോഗ വിഭാഗം)",
      doctorName: "ഡോ. കവിത നായർ (ഡെർമറ്റോളജിസ്റ്റ്)",
      roomName: "റൂം 116 (സ്കിൻ ക്ലിനിക്ക്)",
      counterName: "കൗണ്ടർ 16"
    },
    mni: {
      deptName: "দর্মাতোলোজি (উশেক বিভাগ)",
      doctorName: "ডাঃ কবিতা নায়ার (দর্মাতোলোজিস্ট)",
      roomName: "কা 116 (স্কিন ক্লিনিক)",
      counterName: "কাউন্টার 16"
    },
    mr: {
      deptName: "त्वचारोग विभाग (डर्मेटॉलॉजी)",
      doctorName: "डॉ. कविता नायर (त्वचारोग तज्ज्ञ)",
      roomName: "रूम ११६ (त्वचारोग क्लिनिक)",
      counterName: "काउंटर १६"
    },
    ne: {
      deptName: "छाला रोग विभाग (डर्माटोलोजी)",
      doctorName: "डा. कविता नायर (छाला रोग विशेषज्ञ)",
      roomName: "कोठा ११६ (छाला क्लिनिक)",
      counterName: "काउन्टर १६"
    },
    or: {
      deptName: "ଚର୍ମରୋଗ ବିଭାଗ (Dermatology)",
      doctorName: "ଡା. କବିତା ନାୟାର (ଚର୍ମରୋଗ ବିଶେଷଜ୍ଞ)",
      roomName: "ରୁମ୍ ୧୧୬ (ଚର୍ମ କ୍ଲିନିକ୍)",
      counterName: "କାଉଣ୍ଟର ୧୬"
    },
    pa: {
      deptName: "ਡਰਮਾਟੋਲੋਜੀ (ਚਮੜੀ ਦੇ ਰੋਗਾਂ ਦਾ ਵਿਭਾਗ)",
      doctorName: "ਡਾ. ਕਵਿਤਾ ਨਾਇਰ (ਚਮੜੀ ਦੇ ਮਾਹਿਰ)",
      roomName: "ਕਮਰਾ 116 (ਚਮੜੀ ਕਲੀਨਿਕ)",
      counterName: "ਕਾਊਂਟਰ 16"
    },
    sa: {
      deptName: "त्वग्रोग विभागः",
      doctorName: "डा. कविता नायर (त्वग्रोग विशेषज्ञः)",
      roomName: "प्रकोष्ठम् ११६ (त्वग्रोग क्लिनिक)",
      counterName: "काउण्टर १६"
    },
    sat: {
      deptName: "ᱰᱟᱨᱢᱟᱴᱳᱞᱳᱡᱤ (ᱦᱟᱨᱛᱟ ᱵᱮᱢᱟᱨ ᱵᱤᱵᱷᱟᱜᱽ)",
      doctorName: "ᱰᱟ. ᱠᱚᱵᱤᱛᱟ ᱱᱟᱭᱟᱨ (ᱦᱟᱨᱛᱟ ᱵᱤᱥᱮᱥᱚᱜᱽᱭᱚ)",
      roomName: "ᱠᱩᱴᱷᱨᱤ 116 (ᱦᱟᱨᱛᱟ ᱠᱞᱤᱱᱤᱠ)",
      counterName: "ᱠᱟᱣᱩᱱᱴᱟᱨ 16"
    },
    sd: {
      deptName: "ڊرماٽولاجي (چمڙي جي بيمارين جو شعبو)",
      doctorName: "ڊاڪٽر ڪويتا نائر (چمڙي جي ماهر)",
      roomName: "ڪمرو 116 (چمڙي جو ڪلينڪ)",
      counterName: "ڪائونٽر 16"
    },
    ta: {
      deptName: "தோல் நோய் பிரிவு (Dermatology)",
      doctorName: "டாக்டர் கவிதா நாயர் (தோல் நோய் நிபுணர்)",
      roomName: "அறை 116 (தோல் கிளினிக்)",
      counterName: "கவுண்டர் 16"
    },
    te: {
      deptName: "డెర్మటాలజీ (చర్మ వ్యాధుల విభాగం)",
      doctorName: "డా. కవితా నాయర్ (డెర్మటాలజిస్ట్)",
      roomName: "గది 116 (స్కిన్ క్లినిక్)",
      counterName: "కౌంటర్ 16"
    },
    ur: {
      deptName: "شعبہ امراضِ جلد (Dermatology)",
      doctorName: "ڈاکٹر کویتا نائر (ماہر امراضِ جلد)",
      roomName: "کمرہ 116 (سکن کلینک)",
      counterName: "کاؤنٹر 16"
    },
    brx: {
      deptName: "दारमातोलजि (बिखुं विभाग)",
      doctorName: "डा. कविता नायर (दारमातोलजिस्ट)",
      roomName: "खथा 116 (बिखुं क्लिनिक)",
      counterName: "काउन्टार 16"
    },
    doi: {
      deptName: "चमड़ी रोग विभाग",
      doctorName: "डॉ. कविता नायर (त्वचा रोग विशेषज्ञ)",
      roomName: "कमरा ११६ (त्वचा क्लिनिक)",
      counterName: "काउंटर १६"
    },
    ks: {
      deptName: "ڈرماٹولوجی (چمڑہ ہند شعبہ)",
      doctorName: "ڈاکٹر کویتا نائر (چمڑہ ہند ماہر)",
      roomName: "کمرہ 116 (سکن کلینک)",
      counterName: "کاؤنٹر 16"
    },
    kok: {
      deptName: "डर्मेटॉलॉजी (कात विकार विभाग)",
      doctorName: "डॉ. कविता नायर (कात विकार तज्ज्ञ)",
      roomName: "कूड ११६ (कात क्लिनिक)",
      counterName: "काउंटर १६"
    },
    mai: {
      deptName: "त्वचा रोग विभाग (डर्मेटोलॉजी)",
      doctorName: "डॉ. कविता नायर (त्वचा रोग विशेषज्ञ)",
      roomName: "कोठरी 116 (त्वचा क्लीनिक)",
      counterName: "काउंटर 16"
    }
  },
  general_medicine: {
    en: {
      deptName: "General Medicine",
      doctorName: "Dr. Sunita Rao (Senior Physician)",
      roomName: "Room 101 (Primary Care OPD)",
      counterName: "Counter 01"
    },
    hi: {
      deptName: "सामान्य चिकित्सा विभाग (जनरल मेडिसिन)",
      doctorName: "डॉ. सुनीता राव (वरिष्ठ चिकित्सक)",
      roomName: "कमरा 101 (प्राथमिक चिकित्सा ओपीडी)",
      counterName: "काउंटर 01"
    },
    bn: {
      deptName: "জেনারেল মেডিসিন (সাধারণ চিকিৎসা বিভাগ)",
      doctorName: "ডা. সুনীতা রাও (জ্যেষ্ঠ চিকিৎসক)",
      roomName: "রুম ১০১ (প্রাথমিক চিকিৎসা ওপিডি)",
      counterName: "কাউন্টার ০১"
    },
    as: {
      deptName: "সাধাৰণ চিকিৎসা বিভাগ (জেনেৰেল মেডিচিন)",
      doctorName: "ডাঃ সুনীতা ৰাও (জ্যেষ্ঠ চিকিৎসক)",
      roomName: "ৰূম ১০১ (প্ৰাথমিক চিকিৎসা অ'পিডি)",
      counterName: "কাউণ্টাৰ ০১"
    },
    gu: {
      deptName: "જનરલ મેડિસિન (સામાન્ય દવા વિભાગ)",
      doctorName: "ડૉ. સુનીતા રાવ (વરિષ્ઠ ચિકિત્સક)",
      roomName: "રૂમ 101 (પ્રાથમિક સંભાળ ઓપીડી)",
      counterName: "કાઉન્ટર 01"
    },
    kn: {
      deptName: "ಜನರಲ್ ಮೆಡಿಸಿನ್ (ಸಾಮಾನ್ಯ ವೈದ್ಯಕೀಯ ವಿಭಾಗ)",
      doctorName: "ಡಾ. ಸುನೀತಾ ರಾವ್ (ಹಿರಿಯ ವೈದ್ಯರು)",
      roomName: "ರೂಮ್ 101 (ಪ್ರಾಥಮಿಕ ಆರೈಕೆ ಒಪಿಡಿ)",
      counterName: "ಕೌಂಟರ್ 01"
    },
    ml: {
      deptName: "ജനറൽ മെഡിസിൻ (പൊതു വിഭാഗം)",
      doctorName: "ഡോ. സുനിത റാവു (സീനിയർ ഫിസിഷ്യൻ)",
      roomName: "റൂം 101 (പ്രൈമറി കെയർ ഒപിഡി)",
      counterName: "കൗണ്ടർ 01"
    },
    mni: {
      deptName: "জেনেরল মেদিসিন (অহানবা লায়েং বিভাগ)",
      doctorName: "ডাঃ সুনীতা রাও (সিনিয়র ফিজিসিয়ন)",
      roomName: "কা 101 (প্রাইমরি ক্যের ওপীদী)",
      counterName: "কাউন্টার 01"
    },
    mr: {
      deptName: "सामान्य वैद्यकशास्त्र विभाग (जनरल मेडिसिन)",
      doctorName: "डॉ. सुनीता राव (वरिष्ठ फिजिशियन)",
      roomName: "रूम १०१ (प्राथमिक काळजी ओपीडी)",
      counterName: "काउंटर ०१"
    },
    ne: {
      deptName: "सामान्य चिकित्सा विभाग (जनरल मेडिसिन)",
      doctorName: "डा. सुनिता राव (वरिष्ठ फिजिसियन)",
      roomName: "कोठा १०१ (प्राथमिक उपचार ओपिडी)",
      counterName: "काउन्टर ०१"
    },
    or: {
      deptName: "ସାଧାରଣ ଚିକିତ୍ସା ବିଭାଗ (General Medicine)",
      doctorName: "ଡା. ସୁନୀତା ରାଓ (ବରିଷ୍ଠ ଚିକିତ୍ସକ)",
      roomName: "ରୁମ୍ ୧୦୧ (ପ୍ରାଥମିକ ଚିକିତ୍ସା ଓପିଡି)",
      counterName: "କାଉଣ୍ଟର ୦୧"
    },
    pa: {
      deptName: "ਜਨਰਲ ਮੈਡੀਸਨ (ਆਮ ਬਿਮਾਰੀਆਂ ਦਾ ਵਿਭਾਗ)",
      doctorName: "ਡਾ. ਸੁਨੀਤਾ ਰਾਓ (ਸੀਨੀਅਰ ਡਾਕਟਰ)",
      roomName: "ਕਮਰਾ 101 (ਪ੍ਰਾਇਮਰੀ ਕੇਅਰ ਓਪੀਡੀ)",
      counterName: "ਕਾਊਂਟਰ 01"
    },
    sa: {
      deptName: "सामान्यचिकित्सा विभागः",
      doctorName: "डा. सुनीता राव (वरिष्ठ चिकित्सकः)",
      roomName: "प्रकोष्ठम् १०१ (प्राथमिक चिकित्सा ओपीडी)",
      counterName: "काउण्टर ०१"
    },
    sat: {
      deptName: "ᱡᱮᱱᱮᱨᱟᱞ ᱢᱮᱰᱤᱥᱤᱱ (ᱥᱟᱫᱷᱟᱨᱚᱱ ᱨᱟᱱ ᱵᱤᱵᱷᱟᱜᱽ)",
      doctorName: "ᱰᱟ. ᱥᱩᱱᱤᱛᱟ ᱨᱟᱣ (ᱥᱤᱱᱤᱭᱟᱨ ᱰᱟᱠᱛᱟᱨ)",
      roomName: "ᱠᱩᱴᱷᱨᱤ 101 (ᱯᱨᱟᱭᱢᱟᱨᱤ ᱠᱮᱭᱟᱨ ᱳᱯᱤᱰᱤ)",
      counterName: "ᱠᱟᱣᱩᱱᱴᱟᱨ 01"
    },
    sd: {
      deptName: "جنرل ميڊيسن (عام علاج جو شعبو)",
      doctorName: "ڊاڪٽر سنيتا رائو (سينئر طبيب)",
      roomName: "ڪمرو 101 (پرائمري ڪيئر او پي ڊي)",
      counterName: "ڪائونٽر 01"
    },
    ta: {
      deptName: "பொது மருத்துவப் பிரிவு (General Medicine)",
      doctorName: "டாக்டர் சுனிதா ராவ் (மூத்த மருத்துவர்)",
      roomName: "அறை 101 (முதன்மை சிகிச்சை ஓபிடி)",
      counterName: "கவுண்டர் 01"
    },
    te: {
      deptName: "జనరల్ మెడిసిన్ (సాధారణ వైద్య విభాగం)",
      doctorName: "డా. సునీతా రావు (సీనియర్ ఫిజీషియన్)",
      roomName: "గది 101 (ప్రైమరీ కేర్ ఓపీడీ)",
      counterName: "కౌంటర్ 01"
    },
    ur: {
      deptName: "شعبہ طب عام (General Medicine)",
      doctorName: "ڈاکٹر سنیتا راؤ (سینئر معالج)",
      roomName: "کمرہ 101 (پرائمری کیئر او پی ڈی)",
      counterName: "کاؤنٹر 01"
    },
    brx: {
      deptName: "जेनेरेल मेदिसिन (गाहाय चिकित्सा विभाग)",
      doctorName: "डा. सुनिता राव (सिनियर फिजिसियान)",
      roomName: "खथा 101 (प्राइमरी केयर ओपिडि)",
      counterName: "काउन्टार 01"
    },
    doi: {
      deptName: "आम इलाज विभाग (जनरल मेडिसिन)",
      doctorName: "डॉ. सुनीता राव (वरिष्ठ चिकित्सक)",
      roomName: "कमरा १०१ (प्राथमिक ओपीडी)",
      counterName: "काउंटर ०१"
    },
    ks: {
      deptName: "جنرل میڈیسن (عام علاجک شعبہ)",
      doctorName: "ڈاکٹر سنیتا راؤ (سینئر فزیشن)",
      roomName: "کمرہ 101 (پرائمری کیئر او پی ڈی)",
      counterName: "کاؤنٹر 01"
    },
    kok: {
      deptName: "जनरल मेडिसीन (सामान्य वैजकी विभाग)",
      doctorName: "डॉ. सुनीता राव (वरिष्ठ दोतोर)",
      roomName: "कूड १०१ (प्राथमिक ओपीडी)",
      counterName: "काउंटर ०१"
    },
    mai: {
      deptName: "सामान्य चिकित्सा विभाग (जनरल मेडिसिन)",
      doctorName: "डॉ. सुनीता राव (वरिष्ठ चिकित्सक)",
      roomName: "कोठरी 101 (प्राथमिक चिकित्सा ओपीडी)",
      counterName: "काउंटर 01"
    }
  },
  general_surgery: {
    en: {
      deptName: "General Surgery",
      doctorName: "Dr. Harish Chandra (General Surgeon)",
      roomName: "Room 118 (Surgical OPD)",
      counterName: "Counter 18"
    },
    hi: {
      deptName: "सामान्य शल्य चिकित्सा विभाग (सर्जरी)",
      doctorName: "डॉ. हरीश चंद्र (शल्य चिकित्सक)",
      roomName: "कमरा 118 (सर्जिकल ओपीडी)",
      counterName: "काउंटर 18"
    },
    bn: {
      deptName: "জেনারেল সার্জারি (অস্ত্রোপচার বিভাগ)",
      doctorName: "ডা. হরিশ চন্দ্র (শল্যচিকিৎসক)",
      roomName: "রুম ১১৮ (সার্জিক্যাল ওপিডি)",
      counterName: "কাউন্টার ১৮"
    },
    as: {
      deptName: "জেনেৰেল চাৰ্জাৰী (শল্য চিকিৎসা বিভাগ)",
      doctorName: "ডাঃ হৰিশ চন্দ্ৰ (শল্য চিকিৎসক)",
      roomName: "ৰূম ১১৮ (চাৰ্জিকেল অ'পিডি)",
      counterName: "কাউণ্টাৰ ১৮"
    },
    gu: {
      deptName: "જનરલ સર્જરી (શસ્ત્રક્રિયા વિભાગ)",
      doctorName: "ડૉ. હરીશ ચંદ્ર (સર્જન)",
      roomName: "રૂમ 118 (સર્જિકલ ઓપીડી)",
      counterName: "કાઉન્ટર 18"
    },
    kn: {
      deptName: "ಜನರಲ್ ಸರ್ಜರಿ (ಶಸ್ತ್ರಚಿಕಿತ್ಸಾ ವಿಭಾಗ)",
      doctorName: "ಡಾ. ಹರೀಶ್ ಚಂದ್ರ (ಸರ್ಜನ್)",
      roomName: "ರೂಮ್ 118 (ಸರ್ಜಿಕಲ್ ಒಪಿಡಿ)",
      counterName: "ಕೌಂಟರ್ 18"
    },
    ml: {
      deptName: "ജനറൽ സർജറി (ശസ്ത്രക്രിയാ വിഭാഗം)",
      doctorName: "ഡോ. ഹരീഷ് ചന്ദ്ര (ജനറൽ സർജൻ)",
      roomName: "റൂം 118 (സർജിക്കൽ ഒപിഡി)",
      counterName: "കൗണ്ടർ 18"
    },
    mni: {
      deptName: "জেনেরল সর্জরী (শল্য লায়েং বিভাগ)",
      doctorName: "ডাঃ হরিশ চন্দ্র (সর্জন)",
      roomName: "কা 118 (সর্জিকেল ওপীদী)",
      counterName: "কাউন্টার 18"
    },
    mr: {
      deptName: "सामान्य शस्त्रक्रिया विभाग (जनरल सर्जरी)",
      doctorName: "डॉ. हरीश चंद्र (शल्यविशारद)",
      roomName: "रूम ११८ (सर्जिकल ओपीडी)",
      counterName: "काउंटर १८"
    },
    ne: {
      deptName: "शल्यक्रिया विभाग (जनरल सर्जरी)",
      doctorName: "डा. हरिश चन्द्र (सर्जन)",
      roomName: "कोठा ११८ (सर्जिकल ओपिडी)",
      counterName: "काउन्टर १८"
    },
    or: {
      deptName: "ଶଲ୍ୟ ଚିକିତ୍ସା ବିଭାଗ (General Surgery)",
      doctorName: "ଡା. ହରୀଶ ଚନ୍ଦ୍ର (ଶଲ୍ୟ ଚିକିତ୍ସକ)",
      roomName: "ରୁମ୍ ୧୧୮ (ସର୍ଜିକାଲ୍ ଓପିଡି)",
      counterName: "କାଉଣ୍ଟର ୧୮"
    },
    pa: {
      deptName: "ਜਨਰਲ ਸਰਜਰੀ (ਆਪ੍ਰੇਸ਼ਨ ਵਿਭਾਗ)",
      doctorName: "ਡਾ. ਹਰੀਸ਼ ਚੰਦਰ (ਸਰਜਨ)",
      roomName: "ਕਮਰਾ 118 (ਸਰਜੀਕਲ ਓਪੀਡੀ)",
      counterName: "ਕਾਊਂਟਰ 18"
    },
    sa: {
      deptName: "शल्यचिकित्सा विभागः",
      doctorName: "डा. हरीश चन्द्र (शल्यचिकित्सकः)",
      roomName: "प्रकोष्ठम् ११८ (सर्जिकल ओपीडी)",
      counterName: "काउण्टर १८"
    },
    sat: {
      deptName: "ᱡᱮᱱᱮᱨᱟᱞ ᱥᱟᱨᱡᱟᱨᱤ (ᱚᱯᱟᱨᱮᱥᱚᱱ ᱵᱤᱵᱷᱟᱜᱽ)",
      doctorName: "ᱰᱟ. ᱦᱟᱨᱤᱥ ᱪᱚᱸᱫᱽᱨᱚ (ᱥᱟᱨᱡᱟᱱ)",
      roomName: "ᱠᱩᱴᱷᱨᱤ 118 (ᱥᱟᱨᱡᱤᱠᱟᱞ ᱳᱯᱤᱰᱤ)",
      counterName: "ᱠᱟᱣᱩᱱᱴᱟᱨ 18"
    },
    sd: {
      deptName: "جنرل سرجري (آپريشن جو شعبو)",
      doctorName: "ڊاڪٽر هريش چندر (سرجن)",
      roomName: "ڪمرو 118 (سرجيڪل او پي ڊي)",
      counterName: "ڪائونٽر 18"
    },
    ta: {
      deptName: "பொது அறுவை சிகிச்சை பிரிவு (General Surgery)",
      doctorName: "டாக்டர் ஹரிஷ் சந்திரா (அறுவை சிகிச்சை நிபுணர்)",
      roomName: "அறை 118 (சர்ஜிகல் ஓபிடி)",
      counterName: "கவுண்டர் 18"
    },
    te: {
      deptName: "జనరల్ సర్జరీ (సాధారణ శస్త్రచికిత్స విభాగం)",
      doctorName: "డా. హరీష్ చంద్ర (సర్జన్)",
      roomName: "గది 118 (సర్జికల్ ఓపీడీ)",
      counterName: "కౌంటర్ 18"
    },
    ur: {
      deptName: "شعبہ جراحتِ عام (General Surgery)",
      doctorName: "ڈاکٹر ہریش چندر (ماہر جراحت)",
      roomName: "کمرہ 118 (سرجیکل او پی ڈی)",
      counterName: "کاؤنٹر 18"
    },
    brx: {
      deptName: "जेनेरेल सारजारी (सार्जरी विभाग)",
      doctorName: "डा. हरीश चन्द्र (सारजन)",
      roomName: "खथा 118 (सार्जिकल ओपिडि)",
      counterName: "काउन्टार 18"
    },
    doi: {
      deptName: "शल्य चिकित्सा विभाग (सर्जरी)",
      doctorName: "डॉ. हरीश चंद्र (सर्जन)",
      roomName: "कमरा ११८ (सर्जिकल ओपीडी)",
      counterName: "काउंटर १८"
    },
    ks: {
      deptName: "جنرل سرجری (آپریشنک شعبہ)",
      doctorName: "ڈاکٹر ہریش چندر (سرجن)",
      roomName: "کمرہ 118 (سرجیکل او پی ڈی)",
      counterName: "کاؤنٹر 18"
    },
    kok: {
      deptName: "जनरल सर्जरी (शस्त्रक्रिया विभाग)",
      doctorName: "डॉ. हरीश चंद्र (सर्जन)",
      roomName: "कूड ११८ (सर्जिकल ओपीडी)",
      counterName: "काउंटर १८"
    },
    mai: {
      deptName: "सामान्य शल्य चिकित्सा विभाग (सर्जरी)",
      doctorName: "डॉ. हरीश चंद्र (शल्य चिकित्सक)",
      roomName: "कोठरी 118 (सर्जिकल ओपीडी)",
      counterName: "काउंटर 18"
    }
  },
  ophthalmology: {
    en: {
      deptName: "Ophthalmology",
      doctorName: "Dr. Madhavan Pillai (Eye Specialist)",
      roomName: "Room 120 (Eye OPD)",
      counterName: "Counter 20"
    },
    hi: {
      deptName: "नेत्र रोग विभाग (ऑप्थल्मोलॉजी)",
      doctorName: "डॉ. माधवन पिल्लई (नेत्र रोग विशेषज्ञ)",
      roomName: "कमरा 120 (नेत्र ओपीडी)",
      counterName: "काउंटर 20"
    },
    bn: {
      deptName: "চক্ষুরোগ বিভাগ (অপথ্যালমোলজি)",
      doctorName: "ডা. মাধবন পিল্লাই (চক্ষু বিশেষজ্ঞ)",
      roomName: "রুম ১২০ (চক্ষু ওপিডি)",
      counterName: "কাউন্টার ২০"
    },
    as: {
      deptName: "চক্ষু ৰোগ বিভাগ (অফথালম'লজি)",
      doctorName: "ডাঃ মাধৱন পিল্লাই (চক্ষু বিশেষজ্ঞ)",
      roomName: "ৰূম ১২০ (চক্ষু অ'পিডি)",
      counterName: "কাউণ্টাৰ ২০"
    },
    gu: {
      deptName: "નેત્ર રોગ વિભાગ (ઓપ્થેલ્મોલોજી)",
      doctorName: "ડૉ. માધવન પિલ્લઈ (આંખના નિષ્ણાત)",
      roomName: "રૂમ 120 (આંખની ઓપીડી)",
      counterName: "કાઉન્ટર 20"
    },
    kn: {
      deptName: "ನೇತ್ರವಿಜ್ಞಾನ (ಕಣ್ಣಿನ ರೋಗ ವಿಭಾಗ)",
      doctorName: "ಡಾ. ಮಾಧವನ್ ಪಿಳ್ಳೈ (ಕಣ್ಣಿನ ತಜ್ಞರು)",
      roomName: "ರೂಮ್ 120 (ಕಣ್ಣಿನ ಒಪಿಡಿ)",
      counterName: "ಕೌಂಟರ್ 20"
    },
    ml: {
      deptName: "ഒഫ്താൽമോളജി (നേത്രരോഗ വിഭാഗം)",
      doctorName: "ഡോ. മാധവൻ പിള്ള (നേത്രരോഗ വിദഗ്ദ്ധൻ)",
      roomName: "റൂം 120 (ഐ ഒപിഡി)",
      counterName: "കൗണ്ടർ 20"
    },
    mni: {
      deptName: "ওপথালমোলজি (মিতকী লায়েং বিভাগ)",
      doctorName: "ডাঃ মাধবন পিল্লাই (মিতকী বিশেষজ্ঞ)",
      roomName: "কা 120 (আই ওপীদী)",
      counterName: "কাউন্টার 20"
    },
    mr: {
      deptName: "नेत्रविकार विभाग (ऑप्थॅल्मोलॉजी)",
      doctorName: "डॉ. माधवन पिल्लई (नेत्ररोग तज्ज्ञ)",
      roomName: "रूम १२० (नेत्र ओपीडी)",
      counterName: "काउंटर २०"
    },
    ne: {
      deptName: "आँखारोग विभाग (अफ्थाल्मोलोजी)",
      doctorName: "डा. माधवन पिल्लई (आँखारोग विशेषज्ञ)",
      roomName: "कोठा १२० (आँखा ओपिडी)",
      counterName: "काउन्टर २०"
    },
    or: {
      deptName: "ନେତ୍ରରୋଗ ବିଭାଗ (Ophthalmology)",
      doctorName: "ଡା. ମାଧବନ ପିଲ୍ଲାଇ (ଚକ୍ଷୁ ବିଶେଷଜ୍ଞ)",
      roomName: "ରୁମ୍ ୧୨୦ (ନେତ୍ର ଓପିଡି)",
      counterName: "କାଉଣ୍ଟର ୨୦"
    },
    pa: {
      deptName: "ਅੱਖਾਂ ਦੇ ਰੋਗਾਂ ਦਾ ਵਿਭਾਗ (ਔਫਥਾਲਮੋਲੋਜੀ)",
      doctorName: "ਡਾ. ਮਾਧਵਨ ਪਿਲਈ (ਅੱਖਾਂ ਦੇ ਮਾਹਿਰ)",
      roomName: "ਕਮਰਾ 120 (ਅੱਖਾਂ ਦੀ ਓਪੀਡੀ)",
      counterName: "ਕਾਊਂਟਰ 20"
    },
    sa: {
      deptName: "नेत्ररोग विभागः",
      doctorName: "डा. माधवन पिल्लई (नेत्ररोग विशेषज्ञः)",
      roomName: "प्रकोष्ठम् १२० (नेत्र ओपीडी)",
      counterName: "काउण्टर २०"
    },
    sat: {
      deptName: "ᱚᱯᱷᱛᱷᱟᱞᱢᱳᱞᱳᱡᱤ (ᱢᱮᱫ ᱵᱮᱢᱟᱨ ᱵᱤᱵᱷᱟᱜᱽ)",
      doctorName: "ᱰᱟ. ᱢᱟᱫᱷᱚᱵᱚᱱ ᱯᱤᱞᱞᱟᱭ (ᱢᱮᱫ ᱵᱤᱥᱮᱥᱚᱜᱽᱭᱚ)",
      roomName: "ᱠᱩᱴᱷᱨᱤ 120 (ᱢᱮᱫ ᱳᱯᱤᱰᱤ)",
      counterName: "ᱠᱟᱣᱩᱱᱴᱟᱨ 20"
    },
    sd: {
      deptName: "اکين جي بيمارين جو شعبو (آفٿالامولاجي)",
      doctorName: "ڊاڪٽر ماڌون پلي (اکين جو ماهر)",
      roomName: "ڪمرو 120 (اکين جي او پي ڊي)",
      counterName: "ڪائونٽر 20"
    },
    ta: {
      deptName: "கண் மருத்துவப் பிரிவு (Ophthalmology)",
      doctorName: "டாக்டர் மாதவன் பிள்ளை (கண் நிபுணர்)",
      roomName: "அறை 120 (கண் ஓபிடி)",
      counterName: "கவுண்டர் 20"
    },
    te: {
      deptName: "ఆప్తాల్మాలజీ (నేత్ర చికిత్స విభాగం)",
      doctorName: "డా. మాధవన్ పిళ్ళై (కంటి నిపుణులు)",
      roomName: "గది 120 (ఐ ఓపీడీ)",
      counterName: "కౌంటర్ 20"
    },
    ur: {
      deptName: "شعبہ امراضِ چشم (Ophthalmology)",
      doctorName: "ڈاکٹر مادھون پلے (ماہر امراضِ چشم)",
      roomName: "کمرہ 120 (چشم او پی ڈی)",
      counterName: "کاؤنٹر 20"
    },
    brx: {
      deptName: "मेगन विभाग (ओफथालमोलजि)",
      doctorName: "डा. माधवन पिल्लइ (मेगन विशेषज्ञ)",
      roomName: "खथा 120 (मेगन ओपिडि)",
      counterName: "काउन्टार 20"
    },
    doi: {
      deptName: "अक्खीं दे रोग विभाग",
      doctorName: "डॉ. माधवन पिल्लई (नेत्र रोग विशेषज्ञ)",
      roomName: "कमरा १२० (नेत्र ओपीडी)",
      counterName: "काउंटर २०"
    },
    ks: {
      deptName: "اوپتھالمولوجی (اچھن ہند شعبہ)",
      doctorName: "ڈاکٹر مادھون پلے (اچھن ہند ماہر)",
      roomName: "کمرہ 120 (آئی او پی ڈی)",
      counterName: "کاؤنٹر 20"
    },
    kok: {
      deptName: "ऑफ्थाल्मोलॉजी (दೊಳयांचे विकार विभाग)",
      doctorName: "डॉ. माधवन पिल्लई (दोळ्यांचे विकार तज्ज्ञ)",
      roomName: "कूड १२० (आय ओपीडी)",
      counterName: "काउंटर २०"
    },
    mai: {
      deptName: "नेत्र रोग विभाग (ऑप्थल्मोलॉजी)",
      doctorName: "डॉ. माधवन पिल्लई (नेत्र रोग विशेषज्ञ)",
      roomName: "कोठरी 120 (नेत्र ओपीडी)",
      counterName: "काउंटर 20"
    }
  }
};

// Helper function to find specialty key
function findSpecialtyKey(nameOrDept: string): string | null {
  if (!nameOrDept) return null;
  const n = nameOrDept.toLowerCase();
  if (n.includes("pulmono") || n.includes("chest") || n.includes("respirat") || n.includes("फेफड़ा") || n.includes("फुसफुस") || n.includes("বক্ষ") || n.includes("104") || n.includes("04") || n.includes("arvind") || n.includes("mehta")) {
    return "pulmonology";
  }
  if (n.includes("cardio") || n.includes("heart") || n.includes("हृदय") || n.includes("হৃদরোগ") || n.includes("102") || n.includes("02") || n.includes("rajesh") || n.includes("sharma")) {
    return "cardiology";
  }
  if (n.includes("emergency") || n.includes("trauma") || n.includes("आपात") || n.includes("জরুরি") || n.includes("er-01") || n.includes("er 01") || n.includes("vikram")) {
    return "emergency_trauma";
  }
  if (n.includes("gastro") || n.includes("liver") || n.includes("पाचन") || n.includes("পরিপাক") || n.includes("106") || n.includes("06") || n.includes("priya") || n.includes("deshmukh")) {
    return "gastroenterology";
  }
  if (n.includes("neuro") || n.includes("brain") || n.includes("मस्तिष्क") || n.includes("স্নায়ু") || n.includes("108") || n.includes("08") || n.includes("suresh") || n.includes("nair")) {
    return "neurology";
  }
  if (n.includes("ortho") || n.includes("bone") || n.includes("joint") || n.includes("हड्डी") || n.includes("অস্থি") || n.includes("110") || n.includes("amit") || n.includes("patel")) {
    return "orthopedics";
  }
  if (n.includes("ent") || n.includes("throat") || n.includes("गला") || n.includes("গল") || n.includes("112") || n.includes("12") || n.includes("sanjay") || n.includes("gupta")) {
    return "ent";
  }
  if (n.includes("uro") || n.includes("kidney") || n.includes("bladder") || n.includes("मूत्र") || n.includes("মূত্র") || n.includes("114") || n.includes("14") || n.includes("alok") || n.includes("verma")) {
    return "urology";
  }
  if (n.includes("derma") || n.includes("skin") || n.includes("त्वचा") || n.includes("চর্ম") || n.includes("116") || n.includes("16") || n.includes("neha") || n.includes("kapoor")) {
    return "dermatology";
  }
  if (n.includes("surgery") || n.includes("surgical") || n.includes("शल्य") || n.includes("অস্ত্রোপচার") || n.includes("118") || n.includes("18") || n.includes("sunita") || n.includes("rao")) {
    return "general_surgery";
  }
  if (n.includes("ophthal") || n.includes("eye") || n.includes("नेत्र") || n.includes("চক্ষু") || n.includes("आँखा") || n.includes("120") || n.includes("20") || n.includes("madhavan") || n.includes("pillai")) {
    return "ophthalmology";
  }
  if (n.includes("general") || n.includes("medicine") || n.includes("चिकित्सा") || n.includes("চিকিৎসা") || n.includes("101") || n.includes("01") || n.includes("ramesh")) {
    return "general_medicine";
  }
  return null;
}

const COUNTER_WORD: Record<string, string> = {
  bn: "কাউন্টার",
  hi: "काउंटर",
  gu: "કાઉન્ટર",
  kn: "ಕೌಂಟರ್",
  ml: "കൗണ്ടർ",
  mr: "काउंटर",
  pa: "ਕਾਊਂਟਰ",
  or: "କାଉଣ୍ଟର",
  ta: "கவுண்டர்",
  te: "కౌంటర్",
  as: "কাউণ্টাৰ",
  ur: "کاؤنٹر",
  ne: "काउन्टर",
  mai: "काउंटर",
  kok: "काउंटर",
  sa: "गणकपीठम्",
  sat: "ᱠᱟᱣᱩᱱᱴᱟᱨ",
  sd: "ڪائونٽر",
  brx: "काउन्टर",
  doi: "काउंटर",
  ks: "کاوَنٹَر",
  mni: "কাউন্তর",
  en: "Counter",
};

const DIGIT_MAPS: Record<string, string[]> = {
  bn: ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"],
  as: ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"],
  hi: ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"],
  mr: ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"],
  ne: ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"],
  sa: ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"],
  mai: ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"],
  doi: ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"],
  kok: ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"],
  gu: ["૦", "૧", "૨", "૩", "૪", "૫", "૬", "૭", "૮", "૯"],
  pa: ["੦", "੧", "੨", "੩", "੪", "੫", "੬", "੭", "੮", "੯"],
  or: ["୦", "୧", "୨", "୩", "୪", "୫", "୬", "୭", "୮", "୯"],
  kn: ["೦", "೧", "೨", "೩", "೪", "೫", "೬", "೭", "೮", "೯"],
  ml: ["൦", "൧", "൨", "൩", "൪", "൫", "൬", "൭", "൮", "൯"],
  ta: ["௦", "௧", "௨", "௩", "௪", "௫", "௬", "௭", "௮", "௯"],
  te: ["౦", "౧", "౨", "౩", "౪", "౫", "౬", "౭", "౮", "౯"],
  ur: ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"],
  sd: ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"],
  ks: ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"],
};

export function localizeDigits(str: string, lang: Language): string {
  const digits = DIGIT_MAPS[lang];
  if (!digits) return str;
  return str.replace(/[0-9]/g, (d) => digits[parseInt(d, 10)] || d);
}

export function getLocalizedDepartment(deptEn: string, lang: Language, deptHi?: string): string {
  if (!deptEn) return "";
  if (lang === "en") return deptEn;
  const key = findSpecialtyKey(deptEn);
  if (key && SPECIALTY_LOCALIZATIONS[key] && SPECIALTY_LOCALIZATIONS[key][lang]) {
    return SPECIALTY_LOCALIZATIONS[key][lang].deptName;
  }
  if (lang === "hi" && deptHi) return deptHi;
  return deptEn;
}

export function getLocalizedDoctor(doctorEn: string, lang: Language, doctorHi?: string): string {
  if (!doctorEn) return "";
  if (lang === "en") return doctorEn;
  const key = findSpecialtyKey(doctorEn);
  if (key && SPECIALTY_LOCALIZATIONS[key] && SPECIALTY_LOCALIZATIONS[key][lang]) {
    return SPECIALTY_LOCALIZATIONS[key][lang].doctorName;
  }
  if (lang === "hi" && doctorHi) return doctorHi;
  return doctorEn;
}

export function getLocalizedRoom(roomEn: string, lang: Language): string {
  if (!roomEn) return "";
  if (lang === "en") return roomEn;
  const key = findSpecialtyKey(roomEn);
  if (key && SPECIALTY_LOCALIZATIONS[key] && SPECIALTY_LOCALIZATIONS[key][lang]) {
    return SPECIALTY_LOCALIZATIONS[key][lang].roomName;
  }
  return localizeDigits(roomEn, lang);
}

export function getLocalizedCounter(counterEn: string, lang: Language): string {
  if (!counterEn) return "";
  if (lang === "en") return counterEn;
  const key = findSpecialtyKey(counterEn);
  if (key && SPECIALTY_LOCALIZATIONS[key] && SPECIALTY_LOCALIZATIONS[key][lang]) {
    return SPECIALTY_LOCALIZATIONS[key][lang].counterName;
  }
  const prefix = COUNTER_WORD[lang] || COUNTER_WORD.en;
  const cleaned = counterEn.replace(/counter/i, "").trim();
  const localizedNum = localizeDigits(cleaned, lang);
  return `${prefix} ${localizedNum}`.trim();
}

export function getLocalizedChiefComplaint(
  result: { chiefComplaintSummaryEn?: string; chiefComplaintSummaryHi?: string; chiefComplaints?: string[] },
  input: { isDontKnow?: boolean; selectedSymptoms?: string[]; selectedRegions?: string[] },
  lang: Language
): string {
  if (lang === "en") return result.chiefComplaintSummaryEn || "";
  if (input.isDontKnow) {
    if (lang === "hi") return result.chiefComplaintSummaryHi || "सामान्य शारीरिक अस्वस्थता";
    if (lang === "bn") return "সাধারণ শারীরিক অস্বস্তি (রোগী নির্দিষ্ট অঙ্গ সম্পর্কে নিশ্চিত নন)";
    return result.chiefComplaintSummaryHi || result.chiefComplaintSummaryEn || "";
  }
  if (input.selectedSymptoms && input.selectedSymptoms.length > 0) {
    const localized = input.selectedSymptoms.map((id) =>
      getLocalizedSymptomName(id, lang, id, id)
    );
    return localized.join(", ");
  }
  if (lang === "hi") return result.chiefComplaintSummaryHi || "";
  return result.chiefComplaintSummaryEn || "";
}
