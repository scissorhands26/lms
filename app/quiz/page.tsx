import getPb from "@/pb/getPb";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Quiz() {
  const pb = await getPb();

  const unlockedQuizzes = await pb.collection("quiz_attempts").getFullList({
    filter: `user = "${pb.authStore.model.id}" && submitted = false`,
    expand: "quiz",
  });

  const now = new Date();

  // Filter and update expired quizzes
  const validQuizzes = await Promise.all(
    unlockedQuizzes.map(async (quiz: any) => {
      const started = new Date(quiz.expand.quiz.started);
      const timeAllowed = quiz.expand.quiz.time_allowed * 1000;

      if (now.getTime() > started.getTime() + timeAllowed) {
        await pb.collection("quiz_attempts").update(quiz.id, {
          expired: true,
        });
        return null;
      }

      return quiz;
    }),
  );

  // Remove null entries from the validQuizzes array
  const filteredQuizzes = validQuizzes.filter(Boolean);

  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {filteredQuizzes.length > 0 ? (
        filteredQuizzes.map((quiz: any) => (
          <Card key={quiz.expand.quiz.id}>
            <CardHeader>
              <CardTitle>{quiz.expand.quiz.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Questions: {quiz.expand.quiz.questions}</p>
              <p>Time: {formatTime(quiz.expand.quiz.time_allowed)}</p>
            </CardContent>
            <CardFooter>
              <Link href={`/quiz/${quiz.id}`}>
                <Button>Start Quiz</Button>
              </Link>
            </CardFooter>
          </Card>
        ))
      ) : (
        <p>No unlocked quizzes</p>
      )}
    </main>
  );
}
