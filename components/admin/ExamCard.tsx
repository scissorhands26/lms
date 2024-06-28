"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { startExam, stopExam } from "@/app/admin/exams/actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const calculateInitialTimeRemaining = (exam: any): number => {
  const startedTime = new Date(exam.started).getTime();
  const currentTime = new Date().getTime();
  const timeElapsed = (currentTime - startedTime) / 1000;
  return Math.max(Math.round(exam.time_allowed - timeElapsed), 0);
};

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const FormSchema = z.object({
  selectedStudents: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You must select at least one student.",
  }),
});

export default function ExamCard({
  exam,
  studentList,
  examAnswers,
}: {
  exam: any;
  studentList: any[];
  examAnswers: any[];
}) {
  const [timer, setTimer] = useState<number | null>(null);
  const [examState, setExamState] = useState(exam.running);
  const [students, setStudents] = useState<any[]>(studentList);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      selectedStudents: studentList.map((student) => student.id),
    },
  });

  useEffect(() => {
    if (examState) {
      const initialTimeRemaining = calculateInitialTimeRemaining(exam);
      setTimer(initialTimeRemaining);

      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer !== null && prevTimer <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prevTimer !== null ? prevTimer - 1 : prevTimer;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [examState]);

  async function handleExamState(state: string, exam: any) {
    const selectedStudents = form.getValues("selectedStudents");
    if (state === "start") {
      await startExam({ exam, selectedStudents }); // Pass exam and selected students
      setExamState(true);
    } else if (state === "stop") {
      await stopExam(exam);
      setExamState(false);
    } else {
      console.error("Invalid state");
    }
    location.reload();
  }

  const handleSelectAll = () => {
    const currentSelected = form.getValues("selectedStudents") || [];
    if (currentSelected.length === students.length) {
      // All students are currently selected, so deselect all
      form.setValue("selectedStudents", []);
    } else {
      // Not all students are selected, so select all
      form.setValue(
        "selectedStudents",
        students.map((student) => student.id),
      );
    }
  };

  function calculateScore(exam: any, student: any, examAnswers: any[]) {
    console.log(examAnswers, exam, student);

    // Filter exam answers by student ID and exam ID
    const studentAnswers = examAnswers.filter(
      (answer) =>
        answer.expand.user.id === student.id &&
        answer.expand.exam.id === exam.id,
    );

    // Group answers by attempt ID
    const attempts = studentAnswers.reduce((acc, answer) => {
      const attemptId = answer.expand.attempt.id;
      if (!acc[attemptId]) {
        acc[attemptId] = [];
      }
      acc[attemptId].push(answer);
      return acc;
    }, {});

    // Get an array of attempt entries and sort by creation date
    const sortedAttempts = Object.entries(attempts).sort((a, b) => {
      // @ts-ignore
      const dateA = new Date(a[1][0].expand.attempt.created);
      // @ts-ignore
      const dateB = new Date(b[1][0].expand.attempt.created);
      // @ts-ignore
      return dateA - dateB;
    });

    // Calculate score for each attempt
    const scores = sortedAttempts.map(([attemptId, attemptAnswers]: any) => {
      let score = 0;
      console.log(attemptAnswers);
      attemptAnswers.forEach((answer: any) => {
        const correctOptions = answer.expand.question.correct_options;
        if (correctOptions && Array.isArray(answer.answer)) {
          // Check if every answer provided by the student matches a correct option
          const isCorrect = answer.answer.every((ans: any) =>
            correctOptions.includes(ans),
          );
          if (isCorrect) {
            score++;
          }
        }
      });
      return score;
    });

    return scores;
  }

  function checkExamStatus(exam: any, student: any, examAnswers: any) {
    // Check if the exam is currently running for the student
    let runningSession = examAnswers.some(
      (answer: any) =>
        answer.expand.user.id === student.id &&
        answer.expand.exam.id === exam.id &&
        !answer.expand.attempt.expired &&
        !answer.expand.attempt.submitted,
    );

    if (runningSession) return "Running";

    // Check if the student has completed the exam
    let examTaken = examAnswers.some(
      (answer: any) =>
        answer.expand.user.id === student.id &&
        answer.expand.exam.id === exam.id &&
        answer.expand.attempt.submitted,
    );

    if (examTaken) return "Completed";

    return "Not Attempted";
  }

  return (
    <Card key={exam.id}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-mono text-sm font-medium">
          {examState
            ? timer !== null
              ? formatTime(timer)
              : "--:--:--"
            : formatTime(exam.time_allowed)}
        </CardTitle>
        <Pencil className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{exam.name}</div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {exam.questions.length} questions
        </p>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Manage</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Exam</DialogTitle>
            </DialogHeader>
            {examState ? (
              <DialogDescription>
                The exam is currently running.
              </DialogDescription>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(() =>
                    handleExamState("start", exam),
                  )}
                  className="space-y-8"
                >
                  <DialogDescription>
                    Select students to start the exam for:
                    <div className="mt-4 items-start">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="m-0 p-0">Select</TableHead>
                            <TableHead className="m-0 p-0">ID</TableHead>
                            <TableHead className="m-0 p-0">Name</TableHead>
                            <TableHead className="m-0 p-0">
                              Exam Status
                            </TableHead>
                            <TableHead className="m-0 p-0">Score</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {students.map((student) => (
                            <TableRow key={student.id} className="m-0 p-0">
                              <TableCell className="p-2">
                                <FormField
                                  key={student.id}
                                  control={form.control}
                                  name="selectedStudents"
                                  render={({ field }) => (
                                    <FormItem
                                      key={student.id}
                                      className="flex items-center space-x-3"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value.includes(
                                            student.id,
                                          )}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([
                                                  ...field.value,
                                                  student.id,
                                                ])
                                              : field.onChange(
                                                  field.value.filter(
                                                    (id) => id !== student.id,
                                                  ),
                                                );
                                          }}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </TableCell>
                              <TableCell className="m-0 p-0">
                                {student.id}
                              </TableCell>
                              <TableCell className="m-0 p-0">
                                {student.rank} {student.last_name},{" "}
                                {student.first_name}
                              </TableCell>
                              <TableCell className="m-0 p-0">
                                {checkExamStatus(exam, student, examAnswers)}
                              </TableCell>
                              <TableCell className="m-0 p-0">
                                {calculateScore(exam, student, examAnswers)
                                  .map(
                                    (score) =>
                                      `${score}/${exam.questions.length}`,
                                  )
                                  .join(" | ")}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <Button
                        className="mt-4"
                        type="button"
                        onClick={handleSelectAll}
                      >
                        Select All
                      </Button>
                      <FormMessage />
                    </div>
                  </DialogDescription>
                  <DialogFooter>
                    <Button type="submit">Start Exam</Button>
                  </DialogFooter>
                </form>
              </Form>
            )}
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
