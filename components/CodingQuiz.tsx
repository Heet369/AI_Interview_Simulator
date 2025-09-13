
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface CodingQuizProps {
  questions: Question[];
  interviewId: string;
  userId: string;
}

const CodingQuiz = ({ questions, interviewId, userId }: CodingQuizProps) => {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(300); 

  const handleSubmit = useCallback(async () => {
    if (timeLeft <= 0) return; 
    setTimeLeft(0); 

    let calculatedScore = 0;
    questions.forEach((q, index) => {
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
      alert("There was an error submitting your results. Please try again.");
    }
  }, [selectedAnswers, questions, interviewId, userId, router, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmit();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

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
    <div className="bg-dark-200 p-8 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">
          Question {currentQuestionIndex + 1}/{questions.length}
        </h3>
        <div className="bg-dark-300 text-primary-200 font-bold px-4 py-2 rounded-lg">
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>
      </div>
      <p className="text-lg mb-6">{currentQuestion.question}</p>

      <div className="flex flex-col gap-4 ">
        {currentQuestion.options.map((option, index) => (
          <Button
            key={index}
            onClick={() => handleOptionSelect(option)}
            className={`justify-start  p-4 h-auto text-wrap rounded-lg transition-colors ${
              selectedAnswers[currentQuestionIndex] === option
                ? "bg-primary-200 text-black "
                : "bg-gray-300  text-shadow-white hover:bg-dark-400"
            }`}
          >
            {option}
          </Button>
        ))}
      </div>

      <div className="flex justify-end mt-8">
        {currentQuestionIndex < questions.length - 1 ? (
          <Button onClick={handleNext} disabled={!selectedAnswers[currentQuestionIndex]}>
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!selectedAnswers[currentQuestionIndex]}>
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};

export default CodingQuiz;