import QuestionCard from "@/components/quiz/QuestionCard";
import getPb from "@/pb/getPb";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Component() {
  const pb = await getPb();

  const attempt = await pb.collection("quiz_attempts").getFullList({
    filter: `user = "${pb.authStore.model.id}"`,
    expand: "quiz,quiz.questions,quiz.questions.type",
    sort: "-created",
  });

  const answers = await pb.collection("quiz_answers").getFullList({
    filter: `attempt = "${attempt[0].id}"`,
  });

  // check if quiz is expired
  // if (
  //   attempt[0].expand.quiz.time_allowed <
  //   new Date() - new Date(attempt[0].created)
  // ) {
  //   redirect("/quiz/expired");
  // }

  if (attempt[0].expired) redirect("/quiz/expired");

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <h1 className="mb-8 text-3xl font-bold">Quiz</h1>
      <div className="grid gap-6">
        {attempt.length > 0 && (
          <QuestionCard
            questions={attempt[0].expand.quiz.expand.questions}
            attempt={attempt[0]}
            answers={answers}
          />
        )}
      </div>
    </div>
  );
}
