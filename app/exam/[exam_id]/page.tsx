import QuestionCard from "@/components/exam/QuestionCard";
import getPb from "@/pb/getPb";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Component() {
  const pb = await getPb();

  const attempt = await pb.collection("exam_attempts").getFullList({
    filter: `user = "${pb.authStore.model.id}"`,
    expand: "exam,exam.questions,exam.questions.type",
    sort: "-created",
  });

  console.log(attempt);

  const answers = await pb.collection("exam_answers").getFullList({
    filter: `attempt = "${attempt[0].id}"`,
  });

  // check if exam is expired
  // if (
  //   attempt[0].expand.exam.time_allowed <
  //   new Date() - new Date(attempt[0].created)
  // ) {
  //   redirect("/exam/expired");
  // }

  if (attempt[0].expired) redirect("/exam/expired");

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <h1 className="mb-8 text-3xl font-bold">Exam</h1>
      <div className="grid gap-6">
        {attempt.length > 0 && (
          <QuestionCard
            questions={attempt[0].expand.exam.expand.questions}
            attempt={attempt[0]}
            answers={answers}
          />
        )}
      </div>
    </div>
  );
}
