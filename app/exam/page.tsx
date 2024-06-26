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

export default async function Exam() {
  const pb = await getPb();

  const unlockedExamzes = await pb.collection("exam_attempts").getFullList({
    filter: `user = "${pb.authStore.model.id}" && submitted = false && expired = false`,
    expand: "exam,exam.questions",
  });

  const now = new Date();

  // Filter and update expired exams
  const validExamzes = await Promise.all(
    unlockedExamzes.map(async (exam: any) => {
      const started = new Date(exam.expand.exam.started);
      const timeAllowed = exam.expand.exam.time_allowed * 1000;

      if (now.getTime() > started.getTime() + timeAllowed) {
        await pb.collection("exam_attempts").update(exam.id, {
          expired: true,
        });
        return null;
      }

      return exam;
    }),
  );

  // Remove null entries from the validExamzes array
  const filteredExamzes = validExamzes.filter(Boolean);

  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {filteredExamzes.length > 0 ? (
        filteredExamzes.map((exam: any) => (
          <Card key={exam.expand.exam.id}>
            <CardHeader>
              <CardTitle>{exam.expand.exam.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Questions: {exam.expand.exam.questions.length}</p>
              <p>Time: {formatTime(exam.expand.exam.time_allowed)}</p>
            </CardContent>
            <CardFooter>
              <Link href={`/exam/${exam.id}`}>
                <Button>Start Exam</Button>
              </Link>
            </CardFooter>
          </Card>
        ))
      ) : (
        <p>No unlocked exams</p>
      )}
    </main>
  );
}
