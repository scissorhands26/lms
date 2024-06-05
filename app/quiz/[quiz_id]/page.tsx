import QuestionCard from "@/components/quiz/QuestionCard";
import getPb from "@/pb/getPb";

export default async function Component() {
  const pb = await getPb();

  const attempt = await pb.collection("quiz_attempts").getFullList({
    filter: `user = "${pb.authStore.model.id}"`,
    sort: "-created",
  });

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

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <h1 className="mb-8 text-3xl font-bold">Quiz</h1>
      <div className="grid gap-6">
        <QuestionCard questions={questions} attempt={attempt[0]} />
      </div>
    </div>
  );
}
