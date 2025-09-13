import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";

export async function POST(request: Request) {
  const { role, techstack } = await request.json();

  try {
    const { text: generatedMCQs } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `
        Generate 5 multiple-choice questions for a coding assessment.
        The job role is ${role}.
        The tech stack is: ${techstack}.
        The questions should be suitable for a technical screening.

        Return the questions in a valid JSON format, as an array of objects. Do not include any text outside of the JSON array.
        Each object in the array should have the following properties: "question", "options" (an array of 4 strings), and "correctAnswer" (a string).

        Example format:
        [
          {
            "question": "What is a closure in JavaScript?",
            "options": ["A function having access to the parent scope", "A type of loop", "A way to declare variables", "A CSS property"],
            "correctAnswer": "A function having access to the parent scope"
          }
        ]
      `,
    });

    // THIS IS THE FIX: Clean the string before parsing
    const cleanedJsonString = generatedMCQs.replace(/```json\n|```/g, "").trim();
    const questions = JSON.parse(cleanedJsonString);

    // Save the questions to the 'codingQuestions' collection
    await db.collection("codingQuestions").doc(role.toLowerCase().replace(/\s+/g, '-')).set({
      domain: role,
      questions: questions,
      createdAt: new Date().toISOString(),
    });

    // Return the generated questions to the client
    return Response.json({ success: true, questions: questions }, { status: 200 });

  } catch (error) {
    console.error("Error generating coding questions:", error);
    return Response.json({ success: false, error: "Failed to generate questions" }, { status: 500 });
  }
}