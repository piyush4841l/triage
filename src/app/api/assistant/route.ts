import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { bodyPart, symptoms, transcript } = await req.json();

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) throw new Error("Missing Gemini API Key");

    const prompt = `You are an expert AI triage doctor. 
    The patient clicked the body part: "${bodyPart}".
    They have currently selected these symptoms: [${symptoms.join(", ")}].
    They just said: "${transcript}".
    
    Based on this information, act as a conversational doctor.
    Output a JSON object with exactly four fields:
    1. "nextQuestion": A short, empathetic, spoken question to ask the patient next (e.g. "When did the pain start?").
    2. "checkboxes": An array of 3-5 strings representing dynamic symptom checkboxes the patient could tap to answer your question.
    3. "summary": A professional Medical History of Present Illness (HPI) paragraph summarizing what we know so far, formatted for a doctor to read.
    4. "extractedSymptoms": An array of EXACT symptom IDs the patient explicitly stated they have, matching the predefined symptoms (e.g., if they say "fever", output ["fever"]). If none, output [].
    
    JSON MUST BE valid JSON format, with no markdown tags surrounding it. Just the object.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
        }
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini Error:", err);
      throw new Error("Gemini API Request Failed");
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!resultText) {
      throw new Error("No response from Gemini");
    }

    const parsedData = JSON.parse(resultText);
    return NextResponse.json(parsedData);

  } catch (error: any) {
    console.error("Assistant API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
