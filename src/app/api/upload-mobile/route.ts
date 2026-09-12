import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc, arrayUnion } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { sessionId, base64, filename } = await req.json();

    if (!sessionId || !base64) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Append image to the array in the session document using server-side Firebase
    await setDoc(doc(db, "uploads", sessionId), {
      images: arrayUnion({
        id: "mobile-" + Date.now(),
        name: filename || "Mobile_Upload.jpg",
        base64: base64,
        timestamp: new Date().toISOString()
      })
    }, { merge: true });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Mobile Upload API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
