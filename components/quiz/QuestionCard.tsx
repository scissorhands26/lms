"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { submitQuiz, updateAnswerInDB } from "@/app/quiz/actions";

export default function QuestionCard({ questions, attempt, answers }: any) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(
    attempt.expand.quiz.time_allowed,
  );
  const router = useRouter();

  useEffect(() => {
    // Initialize the selectedAnswers state with existing answers
    const initialAnswers = {};
    answers.forEach((answer) => {
      initialAnswers[answer.question] = answer.answer;
    });
    setSelectedAnswers(initialAnswers);
    calculateTimeLeft(
      attempt.expand.quiz.time_allowed,
      timeRemaining,
      attempt.created,
    );
  }, [answers]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleExpiredQuiz(selectedAnswers); // Submit the quiz (time expired
          router.push("/quiz/expired"); // Redirect to the root page
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  }

  function calculateTimeLeft(time_allowed, timeRemaining, attempt_started) {
    const timeElapsed = Math.floor(
      (new Date() - new Date(attempt_started)) / 1000,
    );
    const timeLeft = time_allowed - timeElapsed;
    setTimeRemaining(timeLeft);
  }

  const handleAnswerSelect = (question, answer, isMultiSelect = false) => {
    setSelectedAnswers((prevState) => {
      let newState;
      if (isMultiSelect) {
        const updatedAnswers = prevState[question.id] || [];
        const index = updatedAnswers.indexOf(answer);
        if (index !== -1) {
          updatedAnswers.splice(index, 1);
        } else {
          updatedAnswers.push(answer);
        }
        newState = {
          ...prevState,
          [question.id]: updatedAnswers,
        };
      } else {
        newState = {
          ...prevState,
          [question.id]: [answer], // Ensure single answer is stored as an array
        };
      }

      // Call the database update function after the state is updated
      saveAnswerToDB(attempt, question, newState[question.id]);

      return newState;
    });
  };

  async function saveAnswerToDB(attempt, question, answerArray) {
    try {
      await updateAnswerInDB(attempt, question, answerArray);
    } catch (error) {
      console.error("Error saving answer:", error);
    }
  }

  async function handleExpiredQuiz(answers) {
    // Submit the quiz (time expired)
    await submitQuiz(attempt, answers);
    router.push("/quiz/expired");
  }

  async function handleSubmitQuiz(answers) {
    await submitQuiz(attempt, answers);
    router.push("/quiz/submitted");
  }

  return (
    <div>
      <div>Timer: {formatTime(timeRemaining)}</div>
      {questions.map((question, index) => (
        <Card key={question.id} className="mb-4">
          <CardHeader>
            <CardTitle>
              {index + 1}
              {". "}
              {question.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {question.expand.type.type === "multiple-choice" && (
              <div className="space-y-2">
                {question.options.map((option) => (
                  <div
                    key={option}
                    className={`flex items-center gap-2 rounded-md px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      (selectedAnswers[question.id] || []).includes(option)
                        ? "bg-gray-100 dark:bg-gray-800"
                        : ""
                    }`}
                  >
                    <Checkbox
                      className="rounded-full"
                      checked={(selectedAnswers[question.id] || []).includes(
                        option,
                      )}
                      onCheckedChange={() =>
                        handleAnswerSelect(question, option)
                      }
                    />
                    <span>{option}</span>
                  </div>
                ))}
              </div>
            )}
            {question.expand.type.type === "select-all" && (
              <div className="space-y-2">
                {question.options.map((option) => (
                  <div
                    key={option}
                    className={`flex items-center gap-2 rounded-md px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      (selectedAnswers[question.id] || []).includes(option)
                        ? "bg-gray-100 dark:bg-gray-800"
                        : ""
                    }`}
                  >
                    <Checkbox
                      checked={(selectedAnswers[question.id] || []).includes(
                        option,
                      )}
                      onCheckedChange={() =>
                        handleAnswerSelect(question, option, true)
                      }
                    />
                    <span>{option}</span>
                  </div>
                ))}
              </div>
            )}
            {question.expand.type.type === "fill-in-the-blank" && (
              <div className="space-y-2">
                <Input
                  value={selectedAnswers[question.id]?.[0] || ""}
                  onChange={(e) => handleAnswerSelect(question, e.target.value)}
                  placeholder="Enter your answer"
                />
              </div>
            )}
            {question.expand.type.type === "true-false" && (
              <div className="space-y-2">
                {question.options.map((option) => (
                  <div
                    key={option}
                    className={`flex items-center gap-2 rounded-md px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      (selectedAnswers[question.id] || []).includes(option)
                        ? "bg-gray-100 dark:bg-gray-800"
                        : ""
                    }`}
                  >
                    <Checkbox
                      className="rounded-full"
                      checked={(selectedAnswers[question.id] || []).includes(
                        option,
                      )}
                      onCheckedChange={() =>
                        handleAnswerSelect(question, option)
                      }
                    />
                    <span>{option}</span>
                  </div>
                ))}
              </div>
            )}
            {question.expand.type.type === "free-response" && (
              <div className="space-y-2">
                <Textarea
                  value={selectedAnswers[question.id]?.[0] || ""}
                  onChange={(e) => handleAnswerSelect(question, e.target.value)}
                  placeholder="Enter your answer"
                  rows={4}
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <div className="mt-8 flex justify-end">
        <Button onClick={() => handleSubmitQuiz(selectedAnswers)}>
          Submit Quiz
        </Button>
      </div>
    </div>
  );
}
