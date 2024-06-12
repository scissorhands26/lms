//@ts-nocheck

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import getPb from "@/pb/getPb";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import GradesTable from "@/components/admin/GradesTable";

const calculateScore = (quiz, student, quizAnswers) => {
  const studentAnswers = quizAnswers.filter(
    (answer) =>
      answer.expand.user.id === student.id && answer.expand.quiz.id === quiz.id,
  );

  const attempts = studentAnswers.reduce((acc, answer) => {
    const attemptId = answer.expand.attempt.id;
    if (!acc[attemptId]) {
      acc[attemptId] = [];
    }
    acc[attemptId].push(answer);
    return acc;
  }, {});

  const sortedAttempts = Object.entries(attempts).sort((a, b) => {
    const dateA = new Date(a[1][0].expand.attempt.created);
    const dateB = new Date(b[1][0].expand.attempt.created);
    return dateA - dateB;
  });

  const scores = sortedAttempts.map(([attemptId, attemptAnswers]) => {
    let score = 0;
    attemptAnswers.forEach((answer) => {
      const correctOptions = answer.expand.question.correct_options;
      if (correctOptions && Array.isArray(answer.answer)) {
        const isCorrect = answer.answer.every((ans) =>
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
};

async function getGrades() {
  const pb = await getPb();

  const students = await pb.collection("users").getFullList({
    sort: "last_name",
  });

  const assignments = await pb.collection("assignments").getFullList({
    sort: "-created",
    expand: "course",
  });

  const quizzes = await pb.collection("quizzes").getFullList({
    sort: "-created",
    expand: "course",
  });

  const assignmentAnswers = await pb
    .collection("assignment_answers")
    .getFullList({
      sort: "-created",
      expand: "student,assignment",
    });

  const quizAnswers = await pb.collection("quiz_answers").getFullList({
    sort: "-created",
    expand: "user,quiz,attempt,question",
  });

  const assignmentGrades = assignmentAnswers.map((answer) => {
    const student = answer.expand.student;
    const assignment = answer.expand.assignment;
    const correct = answer.correct ? 1 : 0;
    return {
      student_id: student.id,
      student_name: `${student.rank} ${student.last_name}, ${student.first_name}`,
      assignment_name: assignment.name,
      grade: (correct / 1) * 100,
    };
  });

  const quizGrades = quizzes
    .map((quiz) => {
      return students.map((student) => {
        const scores = calculateScore(quiz, student, quizAnswers);
        const bestScore = Math.max(...scores);
        return {
          student_id: student.id,
          student_name: `${student.rank} ${student.last_name}, ${student.first_name}`,
          assignment_name: quiz.name,
          grade: (bestScore / quiz.questions.length) * 100,
        };
      });
    })
    .flat();

  const grades = [...assignmentGrades, ...quizGrades];

  return { grades, students, assignments, quizzes };
}

export default async function GradesPage() {
  const { grades, students, assignments, quizzes } = await getGrades();

  return (
    <main className="flex-1 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Grades</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Grade
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Grade</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <form className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="student-name">Student Name</Label>
                  <Input id="student-name" placeholder="Enter student name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="assignment-name">Assignment Name</Label>
                  <Input
                    id="assignment-name"
                    placeholder="Enter assignment name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Input id="grade" placeholder="Enter grade" type="number" />
                </div>
                <Button type="submit">Save Grade</Button>
              </form>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-6 grid gap-6">
        <GradesTable
          dataGrades={grades}
          dataStudents={students}
          dataAssignments={assignments}
          dataQuizzes={quizzes}
        />
      </div>
    </main>
  );
}
