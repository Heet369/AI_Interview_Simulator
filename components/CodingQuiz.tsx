// In H:\interview_platform\components\CodingQuiz.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils"; // Make sure to import cn

const CodingQuiz = ({ questions, interviewId, userId }: any) => {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  const handleSubmit = useCallback(async () => {
    // Stop timer and prevent re-submission
    setTimeLeft(0); 

    let calculatedScore = 0;
    questions.forEach((q: any, index: number) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        calculatedScore += 20;
      }
    });
    
    try {
      await fetch('/api/coding/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewId,
          userId,
          score: calculatedScore,
          answers: selectedAnswers,
        }),
      });
      router.push(`/interview/${interviewId}/coding/results`);
    } catch (error) {
      console.error("Failed to submit results:", error);
      alert("There was an error submitting your results.");
    }
  }, [selectedAnswers, questions, interviewId, userId, router]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmit();
      return;
    }
    const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, handleSubmit]);

  const handleOptionSelect = (option: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = option;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-dark-200 p-8 rounded-lg shadow-lg text-left">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">
          Question {currentQuestionIndex + 1}/{questions.length}
        </h3>
        <div className="bg-slate-700 text-white text-sm font-semibold px-3 py-1 rounded-md">
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>
      </div>
      <p className="text-xl text-white mb-8 break-words">{currentQuestion.question}</p> {/* Added break-words to the question too */}

      <div className="flex flex-col gap-4">
        {currentQuestion.options.map((option: string, index: number) => (
          <div
            key={index}
            onClick={() => handleOptionSelect(option)}
            className={cn(
              "p-4 rounded-lg cursor-pointer transition-all duration-200 break-words", // THIS IS THE FIX
              selectedAnswers[currentQuestionIndex] === option
                ? "bg-gray-200 text-black font-semibold"
                : "text-gray-500 hover:text-white hover:bg-dark-300"
            )}
          >
            {option}
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-8">
        {currentQuestionIndex < questions.length - 1 ? (
          <Button
            onClick={handleNext}
            disabled={!selectedAnswers[currentQuestionIndex]}
            className="bg-gray-300 text-black hover:bg-gray-400 disabled:bg-dark-300 disabled:text-gray-500"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!selectedAnswers[currentQuestionIndex]}
            className="bg-gray-300 text-black hover:bg-gray-400 disabled:bg-dark-300 disabled:text-gray-500"
          >
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};

export default CodingQuiz;