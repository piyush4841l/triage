import { Language } from "./i18n";

export interface VoicePrompts {
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
  step0: "Welcome. On the top right corner you can change language, text size, theme dark or light, and mute the voice. Select from option 1. Emergency, 2. OPD, 3. OPD Token Display, 4. Doctor or Staff Portal.",
  step1: "Please enter or speak your Full Name, Age, Gender, 10-digit Mobile Number, and either your ABHA ID or Aadhaar Number. You can also use the mic button next to each field to speak.",
  step2: "Select the body part. Tap on the body model or select from the list.",
  step3: "Upload previous prescriptions or reports, or proceed.",
  step4: "Your OPD token has been successfully generated. Please collect your receipt.",
  langChanged: "Language changed to English.",
  voiceActive: "Voice assistant activated.",
  stateSelected: (s) => `State ${s} selected.`,
  emergencyIssued: (num) => `Emergency token ${num} issued. Please go to Room 01 Trauma Ward immediately.`,
};

const baseHi: VoicePrompts = {
  step0: "Swagat hai. Upar dayen kone mein aap bhasha, text size, theme dark ya light badal sakte hain aur aawaz band kar sakte hain. Option 1. Emergency, 2. OPD, 3. OPD Token Display, 4. Doctor ya Staff Portal mein se chunen.",
  step1: "Kripaya apna poora naam, mobile number, ABHA ID aur Aadhaar number darj karen ya bolen.",
  step2: "Sharir ke nakashe par dard wale hisson ko chhukar chunen.",
  step3: "Pichhli dawa parchi ya report upload karen ya aage badhein.",
  step4: "Aapka OPD token safaltapurvak generate ho gaya hai. Kripaya rasid len.",
  langChanged: "Bhasha Hindi mein badal gayi hai.",
  voiceActive: "Voice sahayak sakriy ho gaya hai.",
  stateSelected: (s) => `Rajya ${s} chuna gaya.`,
  emergencyIssued: (num) => `Emergency token ${num} jari kiya gaya hai. Kamra 01 Trauma Ward mein jaayen.`,
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
