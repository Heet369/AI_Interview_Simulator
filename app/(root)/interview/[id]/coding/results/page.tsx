// In H:\interview_platform\app\(root)\interview\[id]\coding\results\page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getFeedbackByInterviewId, getCodingResultByInterviewId } from "@/lib/actions/general.action";

type PageProps = {
  params: Promise<{ id: string }>;
};

const ResultsPage = async ({ params }: PageProps) => {
  const { id: interviewId } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch both sets of results in parallel for better performance
  const [feedback, codingResult] = await Promise.all([
    getFeedbackByInterviewId({ interviewId, userId: user.id! }),
    getCodingResultByInterviewId({ interviewId, userId: user.id! })
  ]);

  // If we can't find either result, show an error
  if (!feedback || !codingResult) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold mb-4">Results Not Found</h1>
        <p>We couldn't find the complete results for this session. Please return to the dashboard.</p>
        <Button asChild className="mt-6">
          <Link href="/">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  // --- Calculate Scores ---
  const interviewScore = feedback.totalScore || 0;
  const codingScore = codingResult.score || 0;
  // Each correct answer is worth 20 points
  const correctAnswers = codingScore / 20; 
  // Final score is an average of the two
  const finalCombinedScore = Math.round((interviewScore + codingScore) / 2);

  return (
    <section className="flex flex-col items-center justify-center p-4 text-center">
      <div className="card-border w-full max-w-2xl">
        <div className="card p-10">
          <h1 className="text-3xl font-bold text-white mb-4">
            Interview & Coding Results
          </h1>
          <p className="text-gray-400 mb-8">
            Here's a breakdown of your performance.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 text-left">
            {/* Interview Score */}
            <div className="bg-dark-200 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-300 mb-2">Interview Feedback Score</h2>
              <p className="text-4xl font-bold text-primary-200">{interviewScore}<span className="text-xl text-gray-400">/100</span></p>
            </div>
            {/* Coding Score */}
            <div className="bg-dark-200 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-300 mb-2">Coding Challenge Score</h2>
              <p className="text-4xl font-bold text-primary-200">{codingScore}<span className="text-xl text-gray-400">/100</span></p>
              <p className="text-gray-400 mt-1">{correctAnswers} out of 5 correct</p>
            </div>
          </div>
          
          <hr className="border-dark-300 my-8" />

          {/* Final Combined Score */}
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-semibold text-white">Final Combined Score</h2>
            <p className="text-7xl font-bold text-primary-200 mt-2">{finalCombinedScore}<span className="text-3xl text-gray-400">/100</span></p>
          </div>

          <div className="flex gap-4 w-full mt-10">
            <Button asChild className="btn-secondary flex-1">
              <Link href="/">Back to Dashboard</Link>
            </Button>
            <Button asChild className="btn-primary flex-1">
              <Link href={`/interview/${interviewId}/feedback`}>View Detailed Feedback</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsPage;