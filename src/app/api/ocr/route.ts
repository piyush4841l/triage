import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey || geminiKey === "PASTE_YOUR_AIZA_GEMINI_KEY_HERE") {
      // Return a mocked response for demo if key is missing
      return NextResponse.json({
        diagnoses: ["Hypertension", "Type 2 Diabetes"],
        medications: ["Telmisartan 40mg (1-0-0)", "Metformin 500mg (1-0-1)"],
        allergies: ["Penicillin (Rash)"],
        rawText: "Mocked OCR Result: Patient has a history of Hypertension and Type 2 Diabetes. Current medications include Telmisartan and Metformin. Known allergy to Penicillin. Please add a real Gemini API Key to .env.local to scan real images!"
      });
    }

    // Strip the data:image/jpeg;base64, prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const prompt = `You are an expert medical AI reading a scanned prescription or medical record.
    Extract the information from this document and output exactly this JSON structure:
    {
      "diagnoses": ["list", "of", "diagnoses"],
      "medications": ["list", "of", "medications with dosages if present"],
      "allergies": ["list", "of", "allergies, or empty array"],
      "rawText": "A 1-2 sentence professional summary of the document's contents"
    }
    Make sure it is valid JSON with no markdown formatting.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${geminiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Data
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
        }
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini Vision Error:", err);
      throw new Error("Gemini API Request Failed: " + err);
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!resultText) {
      throw new Error("No response from Gemini");
    }

    const parsedData = JSON.parse(resultText);
    return NextResponse.json(parsedData);

  } catch (error: any) {
    console.error("OCR API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
