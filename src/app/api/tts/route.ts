import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, lang } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Sarvam supported language codes
    const langMap: Record<string, string> = {
      en: "en-IN",
      hi: "hi-IN",
      bn: "bn-IN",
      kn: "kn-IN",
      ml: "ml-IN",
      mr: "mr-IN",
      ta: "ta-IN",
      te: "te-IN",
      gu: "gu-IN",
      pa: "pa-IN",
      or: "or-IN"
    };

    const targetLang = langMap[lang] || "en-IN";

    if (!process.env.SARVAM_API_KEY) {
      throw new Error("No Sarvam API key configured, falling back to native TTS");
    }

    // Call Sarvam AI
    const response = await fetch("https://api.sarvam.ai/text-to-speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": process.env.SARVAM_API_KEY,
      },
      body: JSON.stringify({
        inputs: [text],
        target_language_code: targetLang,
        speaker: "ritu", // high-quality Indian female voice for bulbul:v3
        pace: 1.0,
        speech_sample_rate: 24000,
        enable_preprocessing: true,
        model: "bulbul:v3",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Sarvam Error details:", errorText);
      throw new Error(`Sarvam API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.audios && data.audios.length > 0) {
      return NextResponse.json({ audio: data.audios[0] });
    } else {
      throw new Error("No audio returned from Sarvam");
    }
  } catch (error: any) {
    console.error("TTS API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
