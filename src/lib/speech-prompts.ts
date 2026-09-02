import { Language } from "./i18n";

export interface VoicePrompts {
  modal: string;
  step0: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  langChanged: string;
  voiceActive: string;
  stateSelected: (s: string) => string;
  emergencyIssued: (num: string | number) => string;
}

const baseEn: VoicePrompts = {
  step0: "Welcome to the Smart Triage Kiosk. On the top right corner you can change language, text size, theme dark or light, and mute the voice. Please select from option 1: Emergency, 2: OPD, 3: OPD Token Display, or 4: Doctor or Staff Portal.",
  step1: "Welcome to Patient Registration. Please enter your Full Name, Age, Gender, 10-digit Mobile Number, and your ABHA ID or Aadhaar Number. You can type them in or use the microphone icon next to each field to speak. Tap Next when you are done.",
  step2: "This is the interactive body map. Please tap on the specific body region where you are experiencing pain or discomfort. You can tap on the skeleton model directly, or select a region from the list on the right side.",
  modal: "You have selected a body part. Now, please select the specific affected areas and any common symptoms you are experiencing from the list. If you are unsure, you can tap I don't know. Then, select your pain severity and duration, and tap Save Symptoms.",
  step3: "Medical Record Upload. If you have any previous prescriptions or lab reports, you can upload them here. Tap the upload button to capture or browse files. If you don't have any, you can tap Continue to skip this step.",
  step4: "Your OPD Token has been successfully generated. Please collect your thermal slip and proceed to the waiting area. The doctor will see you shortly.",
  langChanged: "Language changed to English.",
  voiceActive: "Voice assistant is now active.",
  stateSelected: (s) => `State ${s} selected.`,
  emergencyIssued: (num) => `Emergency token ${num} issued. Please go to Room 01 Trauma Ward immediately.`,
};



const baseHi: VoicePrompts = {
  step0: "Smart Triage Kiosk mein aapka swagat hai. Upar dayen kone mein aap bhasha, text size, theme dark ya light badal sakte hain aur aawaz band kar sakte hain. Kripaya option 1: Emergency, 2: OPD, 3: OPD Token Display, ya 4: Doctor Portal mein se chunen.",
  step1: "Marij panjikaran mein aapka swagat hai. Kripaya apna poora naam, umra, ling, das ankon ka mobile number, aur apna ABHA ID ya Aadhaar number darj karein. Aap type kar sakte hain ya bolne ke liye har field ke bagal mein diye gaye mic icon ka upyog kar sakte hain. Pura hone par Next dabayein.",
  step2: "Yeh interactive body map hai. Kripaya sharir ke us hisse par tap karein jahan aapko dard ya pareshani ho rahi hai. Aap seedhe skeleton model par tap kar sakte hain, ya daen or di gayi suchi mein se koi hissa chun sakte hain.",
  modal: "Aapne ek sharir ka hissa chuna hai. Ab, kripaya suchi mein se prabhavit ang aur apne lakshan chunein. Agar aapko nahi pata, toh 'Mujhe nahi pata' par tap karein. Phir, apne dard ki teevrata aur samay avadhi chunein, aur Save Symptoms par tap karein.",
  step3: "Medical record upload. Yadi aapke paas koi pichli prescription ya lab report hai, toh aap unhein yahan upload kar sakte hain. File capture ya browse karne ke liye upload button par tap karein. Agar aapke paas koi report nahi hai, toh aap is step ko chhodne ke liye aage badhein par tap kar sakte hain.",
  step4: "Aapka OPD token safaltapurvak ban gaya hai. Kripaya apni thermal slip lein aur pratiksha kshetra mein jayein. Doctor jaldi hi aapse milenge.",
  langChanged: "Bhasha Hindi mein badal gayi hai.",
  voiceActive: "Voice assistant sakriya ho gaya hai.",
  stateSelected: (s) => `Rajya ${s} chuna gaya.`,
  emergencyIssued: (num) => `Emergency token ${num} jaari kiya gaya hai. Kripaya turant Kamra sankhya ek Trauma Ward mein jayen.`,
};



export const VOICE_PROMPTS: Record<Language, VoicePrompts> = {
  en: baseEn,
  hi: baseHi,
  mr: {
    ...baseHi,
    step0: "Swagat ahe. Varil ujava konyat bhasha, text akar, dark ya light theme badlata yeil ani awaz band karta yeil. Paryay 1. Emergency, 2. OPD, 3. OPD Token Display, 4. Doctor va Staff Portal yatun nivadaa.",
    step1: "Krupaya aapale poorn nav, mobile number, ABHA ID ani Aadhaar number pravish kara kinva bola.",
    step2: "Sharir nakashaavar dukhanare bhag sparsh karun nivadaa.",
    step3: "Magil prescription kinva report upload kara athwa pudhe chala.",
    step4: "Aapala OPD token yashswirityane tayar jhala ahe. Krupaya pahavani ghya.",
    langChanged: "Bhasha Marathi madhe badalli ahe.",
    voiceActive: "Voice sahayak sakriy jhala ahe.",
    stateSelected: (s) => `Rajya ${s} nivadala.`,
    emergencyIssued: (num) => `Emergency token ${num} jari kela. Kholi 01 Trauma Ward la ja.`,
  },
  kn: {
    ...baseEn,
    step0: "Swagata. Mele balagada mule mooleli nevu bhasha, aksharada gaatu, dark athava light vishaya badalabahudhu mattu dwani nilugyabahudhu. Option 1. Emergency, 2. OPD, 3. OPD Token Display, 4. Doctor athava Staff Portal ninda erandukonapadi.",
    step1: "Dayavittu nimage hesaru, mobile number, ABHA ID mattu Aadhaar number nomundu athava heliri.",
    step2: "Dehavarsha nakasheya mele novaluva bhagagalalli muchchi erandukonapadi.",
    step3: "Hindina cheethi athava varadiyanu upload madi athava munde hogiri.",
    step4: "Nimage OPD token yashashwiyagi nikki maalagide. Dayavittu cheethi tageyiri.",
    langChanged: "Bhasha Kannadakkge badalaagide.",
    voiceActive: "Voice sahayakanu sakriyagide.",
    stateSelected: (s) => `Rajya ${s} erandukonapadi.`,
    emergencyIssued: (num) => `Emergency token ${num} jari maadagide. Room 01 Trauma Wardge hogi.`,
  },
  ta: {
    ...baseEn,
    step0: "Vanakkam. Mela valam munailil mozhiyai, elutthu alavu, dark athava light themaiyai maatralaam matrum kutral kuralai arai seyyalaam. Option 1. Emergency, 2. OPD, 3. OPD Token Display, 4. Doctor athava Staff Portal il irunthu thernthedungathal.",
    step1: "Thayavuseythu ungal peyar, mobile number, ABHA ID matrum Aadhaar number likhungathal athava pesungathal.",
    step2: "Udal manchitrey byatha howa angshoguloote thottu thernthedungathal.",
    step3: "Agaru prescription athava arivithalai upload seyyungathal athava munnagethar.",
    step4: "Ungal OPD token vettrikarammaka urvaakappattadu. Rethiyai eduthukollung.",
    langChanged: "Mozhi Tamilukku maattappattadu.",
    voiceActive: "Kural uriyavan sakriyam.",
    stateSelected: (s) => `Maanilam ${s} terthuduttu.`,
    emergencyIssued: (num) => `Emergency token ${num} vazhangapattadu. Room 01 Trauma Ward ku selli.`,
  },
  te: {
    ...baseEn,
    step0: "Swagatham. Paina kudi moolalo meeru bhasha, font parimanam, dark leda light theme marpavachhu mariyu voice ni aapavachhu. Option 1. Emergency, 2. OPD, 3. OPD Token Display, 4. Doctor leda Staff Portal nunchi erandukonapadi.",
    step1: "Dayachesi mee peru, mobile number, ABHA ID mariyu Aadhaar number nondhu cheyyandi leda cheppandi.",
    step2: "Sarira patalonu noppi undi anukune bhagalanu touch chesi erandukonapadi.",
    step3: "Mundu prasam leda niveditanu upload cheyyandi leda munduku vellaandi.",
    step4: "Mee OPD token vijayavanthamga sadhinchindi. Dayachesi rasidi teesukoni vellaandi.",
    langChanged: "Bhasha Telugulo marichangindi.",
    voiceActive: "Voice sahayakudu sakriyamainadu.",
    stateSelected: (s) => `Rajyam ${s} erandukonapadi.`,
    emergencyIssued: (num) => `Emergency token ${num} jaari cheyyadindi. Room 01 Trauma Wardku vellaandi.`,
  },
  bn: {
    ...baseHi,
    step0: "Swagatam. Upore danike koner mekhay apni bhasha, text size, dark othoba light theme pariborton korte paren ebong awaj banda korte paren. Option 1. Emergency, 2. OPD, 3. OPD Token Display, 4. Doctor ba Staff Portal er modhye theke beche nin.",
    step1: "Doyakore apnar naam, mobile number, ABHA ID ebong Aadhaar number likhun ba bolun.",
    step2: "Sharir manchitrey byatha howa angshogulo thottu thirajedukkuka.",
    step3: "Agerer prescription ba report upload korun othoba egiey jan.",
    step4: "Apnar OPD token sapholvabe toiri hoyeche. Rasid sangrah korun.",
    langChanged: "Bhasha Banglay pariborton kora hoyeche.",
    voiceActive: "Voice sahayak sakriyo hoyeche.",
    stateSelected: (s) => `Rajyo ${s} nirbachito hoyeche.`,
    emergencyIssued: (num) => `Emergency token ${num} jari kora hoyeche. Room 01 Trauma Ward e jan.`,
  },
  gu: {
    ...baseHi,
    step0: "Swagat chhe. Upara jamna kona maa bhasha, text size, dark ke light theme badali shakay chhe ane awaj band kari shakay chhe. Option 1. Emergency, 2. OPD, 3. OPD Token Display, 4. Doctor ke Staff Portal mathi pashando karo.",
    step1: "Krupa karine tamaru naam, mobile number, ABHA ID ane Aadhaar number darj karo athva bolo.",
    step2: "Sharir na nakasha par dard wala bhagone sparsh kari pasand karo.",
    step3: "Agelanu prescription athva report upload karo athva aage vadho.",
    step4: "Tamaro OPD token saphalatapurvak generate thayo chhe. Krupa karine rasid lo.",
    langChanged: "Bhasha Gujarati ma badali gai chhe.",
    voiceActive: "Voice sahayak sakriy thayo chhe.",
    stateSelected: (s) => `Rajya ${s} pasand thayel chhe.`,
    emergencyIssued: (num) => `Emergency token ${num} jari karwama aavyo chhe. Room 01 Trauma Ward ma jao.`,
  },
  pa: {
    ...baseHi,
    step0: "Jee aayan nu. Upar sajan mule vich tusi bhasha, text size, dark ya light theme badal sakte ho te awaz band kar sakte ho. Option 1. Emergency, 2. OPD, 3. OPD Token Display, 4. Doctor ya Staff Portal vichon chuneo.",
    step1: "Kirpa karke apna naam, mobile number, ABHA ID ate Aadhaar number darj karo ya bolo.",
    step2: "Sharir de nakshe te dard wale angaan nu chhu ke chuneo.",
    step3: "Pichla prescription ya report upload karo ya aage wadho.",
    step4: "Tumhada OPD token safaltapurvak taiyar ho gaya hai. Kirpa karke rasid lavo.",
    langChanged: "Bhasha Punjabi vich badal gayi hai.",
    voiceActive: "Voice sahayak sakriy ho gaya hai.",
    stateSelected: (s) => `Rajya ${s} chuniya gaya.`,
    emergencyIssued: (num) => `Emergency token ${num} jaari kita gaya hai. Kamra 01 Trauma Ward vich jao.`,
  },
  ml: {
    ...baseEn,
    step0: "Swaagatham. Mele vala moola konil bhasha, text size, dark athava light theme maarkkam marichu voiceum off cheyyam. Option 1. Emergency, 2. OPD, 3. OPD Token Display, 4. Doctor athava Staff Portal il ninnum thirajedukkuka.",
    step1: "Dayavaayi ninge peru, mobile number, ABHA ID mattu Aadhaar number nalkuka athava paranjalu.",
    step2: "Sharir mapil vedana ullathu thottu thirajedukkuka.",
    step3: "Munpu prascription athava report upload cheyyuka athava munnottu pokuka.",
    step4: "Ninge OPD token vijayakramam srushtichu. Rasid vanguka.",
    langChanged: "Bhasha Malayalamil marri.",
    voiceActive: "Voice assistant sakriyam.",
    stateSelected: (s) => `Samsthaanam ${s} thirajeduththu.`,
    emergencyIssued: (num) => `Emergency token ${num} nalki. Room 01 Trauma Ward il poko.`,
  },
  or: {
    ...baseHi,
    step0: "Swagatam. Upare dahin mule re bhasha, text size, dark ba light theme badliba pare ebam awaj banda kariba pare. Option 1. Emergency, 2. OPD, 3. OPD Token Display, 4. Doctor ba Staff Portal ru chunti kara.",
    step1: "Dayakari apananka naam, mobile number, ABHA ID ebam Aadhaar number pravesha karantu kinba kahuntu.",
    step2: "Sarira manchitara re jantrana heuthibha anga ku sparsa kari chayita karantu.",
    step3: "Agaru prescription ba vivrana upload karantu kinba agaku badhanti.",
    step4: "Apananka OPD token saphalatare jari hayachi. Rasida sangrahana karantu.",
    langChanged: "Bhasha Odia re paribartita haiachi.",
    voiceActive: "Voice sahayaka sakriya haiachi.",
    stateSelected: (s) => `Rajya ${s} chayita karaagala.`,
    emergencyIssued: (num) => `Emergency token ${num} pradana karaagichi. Room 01 ku jaaantu.`,
  },
  as: {
    ...baseHi,
    step0: "Swagata. Opore sawan kone bhasha, text size, dark athava light theme pariborton koribo paribo aru awaj band koribo paribo. Option 1. Emergency, 2. OPD, 3. OPD Token Display, 4. Doctor aru Staff Portal ru bechok.",
    step1: "Anugrahakori apunar naam, mobile number, ABHA ID aru Aadhaar number likhok ba kobok.",
    step2: "Sarira mananchitrote biswa howa angabotur sporsho kori bachonik.",
    step3: "Agaru prescription aru nivedon upload korok athava agolo jaoik.",
    step4: "Apunar OPD token saphaltatare srishti kora hoiche. Rasid sangrahon korok.",
    langChanged: "Bhasha Axomiyaloi pariborton kora hoiche.",
    voiceActive: "Voice sahayak sakriya kora hoiche.",
    stateSelected: (s) => `Rajya ${s} nirbachon kora hoiche.`,
    emergencyIssued: (num) => `Emergency token ${num} jaari kora hoiche. Room 01 Trauma Wardloi jaok.`,
  },
  ur: {
    ...baseHi,
    step0: "Khush aamdeed. Upar dayen konay mein aap zaban, text size, dark ya light theme badal sakte hain aur awaaz band kar sakte hain. Option 1. Emergency, 2. OPD, 3. OPD Token Display, 4. Doctor ya Staff Portal mein se chunein.",
    step1: "Baraah karam apna naam, mobile number, ABHA ID aur Aadhaar number darj karen ya bolen.",
    step2: "Insani jism ke naqshe par dard wale aazaa ko chho kar chunein.",
    step3: "Pehla nuskha ya report upload karen ya aage badhen.",
    step4: "Aapka OPD token kamyabi ke saath jari ho gaya hai. Baraah karam raseed haasil karen.",
    langChanged: "Zabaan Urdu mein tabdeel kar di gayi hai.",
    voiceActive: "Sauti muaawin faaal ho gaya hai.",
    stateSelected: (s) => `Riyasat ${s} muntakhib ho gayi.`,
    emergencyIssued: (num) => `Emergency token ${num} jari ho gaya. Kamra 01 Trauma Ward mein jaayen.`,
  },
  brx: {
    ...baseHi,
    langChanged: "Bhasha Bodo mein badal gayi hai.",
  },
  doi: {
    ...baseHi,
    langChanged: "Bhasha Dogri ch badal gayi hai.",
  },
  ks: {
    ...baseHi,
    langChanged: "Bhasha Kashmiri manz badal gayi hai.",
  },
  kok: {
    ...baseHi,
    langChanged: "Bhas Konkani madhe badalli ahe.",
  },
  mai: {
    ...baseHi,
    langChanged: "Bhasha Maithili mein badal gel.",
  },
  mni: {
    ...baseHi,
    langChanged: "Bhasha Manipuri Meiteilon da hongle.",
  },
  ne: {
    ...baseHi,
    langChanged: "Bhasha Nepali ma parivartan bhayo.",
  },
  sa: {
    ...baseHi,
    langChanged: "Bhasha Sanskritam parivartita.",
  },
  sat: {
    ...baseHi,
    langChanged: "Bhasha Santali te parivartan ena.",
  },
  sd: {
    ...baseHi,
    langChanged: "Zabaan Sindhi mein tabdeel thayi.",
  },
};
