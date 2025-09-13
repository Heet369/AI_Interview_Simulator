// File Path: app/api/coding/submit/route.ts

import { db } from "@/firebase/admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { interviewId, userId, score, answers } = await request.json();

    if (!interviewId || !userId || score === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const resultData = {
      interviewId,
      userId,
      score,
      answers: answers || [],
      submittedAt: new Date().toISOString(),
    };

    // This creates the document in the 'codingResults' collection
    await db.collection("codingResults").add(resultData);

    return NextResponse.json(
      { success: true, message: "Results submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error submitting coding results:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit results" },
      { status: 500 }
    );
  }
}