"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Component() {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const questions = [
    {
      id: 1,
      type: "multiple-choice",
      question: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Madrid"],
      correctAnswer: "Paris",
    },
    {
      id: 2,
      type: "select-all",
      question: "Which of these are planets in our solar system?",
      options: ["Venus", "Jupiter", "Mars", "Saturn", "New York", "Sun"],
      correctAnswers: ["Venus", "Jupiter", "Mars", "Saturn"],
    },
    {
      id: 3,
      type: "fill-in-the-blank",
      question: "The Mona Lisa was painted by ____________.",
      correctAnswer: "Leonardo da Vinci",
    },
    {
      id: 4,
      type: "true-false",
      question: "The largest ocean on Earth is the Atlantic Ocean.",
      correctAnswer: false,
    },
    {
      id: 5,
      type: "free-response",
      question:
        "Explain the difference between prokaryotic and eukaryotic cells.",
      correctAnswer:
        "Prokaryotic cells are simpler and lack a true nucleus, while eukaryotic cells have a true nucleus and more complex internal structures.",
    },
  ];
  const handleAnswerSelect = (questionId, answer, isMultiSelect = false) => {
    setSelectedAnswers((prevState) => {
      if (isMultiSelect) {
        return {
          ...prevState,
          [questionId]: prevState[questionId]
            ? [...prevState[questionId], answer]
            : [answer],
        };
      } else {
        return {
          ...prevState,
          [questionId]: answer,
        };
      }
    });
  };
  const handleSubmitQuiz = () => {
    console.log("Quiz submitted:", selectedAnswers);
  };
  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <h1 className="mb-8 text-3xl font-bold">Quiz</h1>
      <div className="grid gap-6">
        {questions.map((question) => (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle>{question.question}</CardTitle>
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
            <CardFooter>
              {question.type !== "free-response" && (
                <Button
                  onClick={() =>
                    handleAnswerSelect(
                      question.id,
                      question.type === "select-all"
                        ? question.correctAnswers
                        : question.correctAnswer,
                    )
                  }
                  className="ml-auto"
                >
                  Save Answer
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <Button onClick={handleSubmitQuiz}>Submit Quiz</Button>
      </div>
    </div>
  );
}
