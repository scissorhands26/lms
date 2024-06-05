"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { submitQuiz } from "@/app/quiz/actions";

export default function QuestionCard({ questions, attempt }: any) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(attempt.time_remaining);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleAnswerSelect = (questionId, answer, isMultiSelect = false) => {
    setSelectedAnswers((prevState) => {
      if (isMultiSelect) {
        const updatedAnswers = prevState[questionId] || [];
        const index = updatedAnswers.indexOf(answer);
        if (index !== -1) {
          // If the answer is already selected, remove it
          updatedAnswers.splice(index, 1);
        } else {
          updatedAnswers.push(answer);
        }
        return {
          ...prevState,
          [questionId]: updatedAnswers,
        };
      } else {
        return {
          ...prevState,
          [questionId]: answer,
        };
      }
    });
  };

  const handleSubmitQuiz = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(selectedAnswers).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v));
      } else {
        formData.append(key, value);
      }
    });

    await submitQuiz(formData);
  };

  return (
    <div>
      <div>Timer: {formatTime(timeRemaining)}</div>
      <form onSubmit={handleSubmitQuiz}>
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
              {question.type === "multiple-choice" && (
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <div
                      key={option}
                      className={`flex items-center gap-2 rounded-md px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                        selectedAnswers[question.id] === option
                          ? "bg-gray-100 dark:bg-gray-800"
                          : ""
                      }`}
                      onClick={() => handleAnswerSelect(question.id, option)}
                    >
                      <Checkbox
                        className="rounded-full"
                        checked={selectedAnswers[question.id] === option}
                        onCheckedChange={() =>
                          handleAnswerSelect(question.id, option)
                        }
                      />
                      <span>{option}</span>
                    </div>
                  ))}
                </div>
              )}
              {question.type === "select-all" && (
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <div
                      key={option}
                      className={`flex items-center gap-2 rounded-md px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                        (selectedAnswers[question.id] || []).includes(option)
                          ? "bg-gray-100 dark:bg-gray-800"
                          : ""
                      }`}
                      onClick={() =>
                        handleAnswerSelect(question.id, option, true)
                      }
                    >
                      <Checkbox
                        checked={(selectedAnswers[question.id] || []).includes(
                          option,
                        )}
                        onCheckedChange={() =>
                          handleAnswerSelect(question.id, option, true)
                        }
                      />
                      <span>{option}</span>
                    </div>
                  ))}
                </div>
              )}
              {question.type === "fill-in-the-blank" && (
                <div className="space-y-2">
                  <Input
                    value={selectedAnswers[question.id] || ""}
                    onChange={(e) =>
                      handleAnswerSelect(question.id, e.target.value)
                    }
                    placeholder="Enter your answer"
                  />
                </div>
              )}
              {question.type === "true-false" && (
                <div className="space-y-2">
                  <div
                    className={`flex items-center gap-2 rounded-md px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      selectedAnswers[question.id] === true
                        ? "bg-gray-100 dark:bg-gray-800"
                        : ""
                    }`}
                    onClick={() => handleAnswerSelect(question.id, true)}
                  >
                    <Checkbox
                      className="rounded-full"
                      checked={selectedAnswers[question.id] === true}
                      onCheckedChange={() =>
                        handleAnswerSelect(question.id, true)
                      }
                    />
                    <span>True</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 rounded-md px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      selectedAnswers[question.id] === false
                        ? "bg-gray-100 dark:bg-gray-800"
                        : ""
                    }`}
                    onClick={() => handleAnswerSelect(question.id, false)}
                  >
                    <Checkbox
                      className="rounded-full"
                      checked={selectedAnswers[question.id] === false}
                      onCheckedChange={() =>
                        handleAnswerSelect(question.id, false)
                      }
                    />
                    <span>False</span>
                  </div>
                </div>
              )}
              {question.type === "free-response" && (
                <div className="space-y-2">
                  <Textarea
                    value={selectedAnswers[question.id] || ""}
                    onChange={(e) =>
                      handleAnswerSelect(question.id, e.target.value)
                    }
                    placeholder="Enter your answer"
                    rows={4}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        <div className="mt-8 flex justify-end">
          <Button>Submit Quiz</Button>
        </div>
      </form>
    </div>
  );
}
