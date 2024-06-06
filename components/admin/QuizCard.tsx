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
import { startQuiz, stopQuiz } from "@/app/admin/quizzes/actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface Quiz {
  id: string;
  name: string;
  questions: number;
  running: boolean;
  started: string;
  time_allowed: number;
}

interface Student {
  id: string;
  name: string;
}

const calculateInitialTimeRemaining = (quiz: Quiz): number => {
  const startedTime = new Date(quiz.started).getTime();
  const currentTime = new Date().getTime();
  const timeElapsed = (currentTime - startedTime) / 1000;
  return Math.max(Math.round(quiz.time_allowed - timeElapsed), 0);
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

export default function QuizCard({
  quiz,
  studentList,
}: {
  quiz: Quiz;
  studentList: Student[];
}) {
  const [timer, setTimer] = useState<number | null>(null);
  const [quizState, setQuizState] = useState(quiz.running);
  const [students, setStudents] = useState<Student[]>(studentList);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      selectedStudents: studentList.map((student) => student.id), // default to all students
    },
  });

  useEffect(() => {
    if (quizState) {
      const initialTimeRemaining = calculateInitialTimeRemaining(quiz);
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
  }, [quizState]);

  async function handleQuizState(state: string, quiz: Quiz) {
    const selectedStudents = form.getValues("selectedStudents");
    if (state === "start") {
      await startQuiz({ quiz, selectedStudents }); // Pass quiz and selected students
      setQuizState(true);
    } else if (state === "stop") {
      await stopQuiz(quiz);
      setQuizState(false);
    } else {
      console.error("Invalid state");
    }
    location.reload();
  }

  const handleSelectAll = () => {
    form.setValue(
      "selectedStudents",
      students.map((student) => student.id),
    );
  };

  return (
    <Card key={quiz.id}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-mono text-sm font-medium">
          {quizState
            ? timer !== null
              ? formatTime(timer)
              : "--:--:--"
            : formatTime(quiz.time_allowed)}
        </CardTitle>
        <Pencil className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{quiz.name}</div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {quiz.questions.length} questions
        </p>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Manage</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Quiz</DialogTitle>
            </DialogHeader>
            {quizState ? (
              <DialogDescription>
                The quiz is currently running.
              </DialogDescription>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(() =>
                    handleQuizState("start", quiz),
                  )}
                  className="space-y-8"
                >
                  <DialogDescription>
                    Select students to start the quiz for:
                    <div className="mt-4">
                      <Button type="button" onClick={handleSelectAll}>
                        Select All Students
                      </Button>
                      <div className="grid grid-cols-3">
                        {students.map((student) => (
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
                                    checked={field.value.includes(student.id)}
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
                                <FormLabel className="text-sm font-normal">
                                  {student.rank +
                                    " " +
                                    student.last_name +
                                    ", " +
                                    student.first_name}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </div>
                  </DialogDescription>
                  <DialogFooter>
                    <Button type="submit">Start Quiz</Button>
                  </DialogFooter>
                </form>
              </Form>
            )}
            {quizState && (
              <DialogFooter>
                <Button onClick={() => handleQuizState("stop", quiz)}>
                  Stop Quiz
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
