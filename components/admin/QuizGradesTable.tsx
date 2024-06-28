"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function QuizGradesTable({ dataGrades }: any) {
  const [grades, setGrades] = useState(dataGrades);
  const [studentFilter, setStudentFilter] = useState("");

  const filteredGrades = grades.filter((grade: any) => {
    const studentMatch = grade.user_last_name
      .toLowerCase()
      .includes(studentFilter.toLowerCase());
    return studentMatch;
  });

  function calculateGrade(attempt: any) {
    const totalQuestions = attempt.questions.length;
    const correctQuestions = attempt.questions.filter(
      (question: any) => question.correct,
    ).length;
    return (
      <span>
        {correctQuestions} / {totalQuestions} (
        {((correctQuestions / totalQuestions) * 100).toFixed(2)}%)
      </span>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Quiz Summary</CardTitle>
        <CardDescription>
          View and filter student quiz grades by student.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="student-filter">Student</Label>
            <Input
              id="student-filter"
              placeholder="Filter by student name"
              value={studentFilter}
              onChange={(e) => setStudentFilter(e.target.value)}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Assignment</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Attempt History</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGrades.map((grade: any, index: any) => (
                <TableRow key={index}>
                  <TableCell>
                    {grade.user_rank +
                      " " +
                      grade.user_last_name +
                      ", " +
                      grade.user_first_name}
                  </TableCell>
                  <TableCell>{grade.quiz_name}</TableCell>
                  <TableCell>
                    {calculateGrade(grade.attempts[grade.attempts.length - 1])}
                  </TableCell>
                  <TableCell>{grade.attempts.length}</TableCell>
                  <TableCell className="items-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">View</Button>
                      </DialogTrigger>
                      <DialogContent className="font-mono sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>History</DialogTitle>
                          <DialogDescription>
                            {/* <pre>{JSON.stringify(grade.attempts, null, 4)}</pre> */}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          {grade.attempts.map((attempt: any, index: number) => (
                            <div key={index} className="rounded-md border p-2">
                              <div className="flex flex-row justify-between">
                                <span>Attempt {index + 1} </span>
                                <span className="text-slate-500">
                                  {formatTime(attempt.quiz_attempt_date)}
                                </span>
                              </div>
                              <p>{calculateGrade(attempt)}</p>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function formatTime(date: string) {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} days ago`;
  }

  if (hours > 0) {
    return `${hours} hours ago`;
  }

  if (minutes > 0) {
    return `${minutes} minutes ago`;
  }

  return `${seconds} seconds ago`;
}
