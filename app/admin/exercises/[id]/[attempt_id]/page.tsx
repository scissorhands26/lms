import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import getPb from "@/pb/getPb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

async function getAttempt(exerciseID: string, attemptID: string) {
  const pb = await getPb();
  pb.autoCancellation(false);

  const tasks = await pb.collection("exercise_tasks").getFullList({
    filter: `exercise = "${exerciseID}"`,
  });

  const attempt = await pb.collection("exercise_attempts").getOne(attemptID, {
    expand: "student",
  });

  const fetchRecordsForAttempt = async () => {
    const records = await pb.collection("exercise_answers").getFullList({
      filter: `attempt = "${attemptID}"`,
    });
    return records;
  };

  const answers = await fetchRecordsForAttempt();

  // Move completed and submitted_answer to the respective task
  const tasksWithAnswers = tasks.map((task) => {
    const answer = answers.find((answer) => answer.task === task.id);
    return {
      ...task,
      completed: answer ? answer.completed : false,
      submitted_answer: answer ? answer.submitted_answer : "",
    };
  });

  const fullAttempt = {
    ...attempt,
    tasks: tasksWithAnswers,
  };

  return fullAttempt;
}

export default async function AttemptPage({ params }: any) {
  const exerciseID = params.id;
  const attemptID = params.attempt_id;
  const attempt = await getAttempt(exerciseID, attemptID);

  return (
    <div>
      <div className="mb-2 grid grid-cols-3 items-center gap-2 text-center">
        <div className="rounded-xl border bg-slate-900 p-2">
          {attempt.expand.student.rank} {attempt.expand.student.last_name}
        </div>
        <div className="rounded-xl border bg-slate-900 p-2">
          Attempt: {attempt.attempt}
        </div>
        <div className="rounded-xl border bg-slate-900 p-2">
          {attempt.container_info.command}
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead>Hint</TableHead>
            <TableHead>Submitted Answer</TableHead>
            <TableHead>Completed</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attempt.tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{task.question}</span>
                </div>
              </TableCell>
              <TableCell>{task.hint}</TableCell>{" "}
              <TableCell>
                {task.submitted_answer ? task.submitted_answer : "--"}
              </TableCell>
              <TableCell>
                {task.completed ? (
                  <Badge className="cursor-default bg-green-500 hover:bg-green-500">
                    Completed
                  </Badge>
                ) : (
                  <Badge className="cursor-default bg-red-500 hover:bg-red-500">
                    Not Completed
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <span className="cursor-pointer rounded-xl border p-1">
                      View
                    </span>
                  </DialogTrigger>
                  <DialogContent className="w-[1000px]">
                    <DialogHeader>
                      <DialogTitle>Description</DialogTitle>
                    </DialogHeader>
                    <div
                      style={{
                        maxHeight: "850px",
                        overflowY: "auto",
                        maxWidth: "1000px",
                      }}
                      className="markdown"
                      dangerouslySetInnerHTML={{
                        __html: task.desc || null,
                      }}
                    />
                    <DialogFooter></DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div>{/* <pre>{JSON.stringify(attempt, null, 2)}</pre> */}</div>
    </div>
  );
}
