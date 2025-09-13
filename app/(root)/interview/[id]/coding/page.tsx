import { getInterviewById, getQuestionsFromBank } from "@/lib/actions/general.action";
import { redirect } from "next/navigation";
import CodingQuiz from "@/components/CodingQuiz";
import { getCurrentUser } from "@/lib/actions/auth.action";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function getCodingQuestions(interview: any) {
  let questions = await getQuestionsFromBank({ domain: interview.role });

  if (!questions || questions.length === 0) {
    console.log("No questions in bank, generating new ones...");
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/coding/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role: interview.role,
        techstack: interview.techstack.join(', '),
      }),
      cache: 'no-store',
    });

    if (!response.ok) return [];

    const data = await response.json();
    questions = data.questions;
  }

  return questions;
}

const CodingChallengePage = async ({ params }: PageProps) => {
  const { id } = await params;
  const user = await getCurrentUser();
  const interview = await getInterviewById(id);

  if (!interview) {
    redirect("/");
  }

  const questions = await getCodingQuestions(interview);

  if (!questions || questions.length === 0) {
    return <p className="text-center">Could not load coding questions. Please try again later.</p>;
  }

  return (
    <section className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-2">
          {interview.role} Coding Challenge
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Answer the 5 multiple-choice questions below.
        </p>

        <CodingQuiz
          questions={questions}
          interviewId={id}
          userId={user?.id!}
        />
      </div>
    </section>
  );
};

export default CodingChallengePage;