"use client";

import React, { useEffect, useState } from "react";

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

export default function GradesTable({
  dataGrades,
  dataStudents,
  dataAssignments,
  dataQuizzes,
}: any) {
  const [grades, setGrades] = useState(dataGrades);
  const [students, setStudents] = useState(dataStudents);
  const [assignments, setAssignments] = useState(dataAssignments);
  const [studentFilter, setStudentFilter] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState("");

  const filteredGrades = grades.filter((grade) => {
    const studentMatch = grade.student_name
      .toLowerCase()
      .includes(studentFilter.toLowerCase());
    const assignmentMatch = grade.assignment_name
      .toLowerCase()
      .includes(assignmentFilter.toLowerCase());
    return studentMatch && assignmentMatch;
  });

  console.log(grades);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Grade Summary</CardTitle>
        <CardDescription>
          View and filter student grades by student or assignment.
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
            <Label htmlFor="assignment-filter">Assignment</Label>
            <Input
              id="assignment-filter"
              placeholder="Filter by assignment name"
              value={assignmentFilter}
              onChange={(e) => setAssignmentFilter(e.target.value)}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Assignment</TableHead>
                <TableHead>Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGrades.map((grade, index) => (
                <TableRow key={index}>
                  <TableCell>{grade.student_name}</TableCell>
                  <TableCell>{grade.course_name}</TableCell>
                  <TableCell>{grade.assignment_name}</TableCell>
                  <TableCell>{grade.grade.toFixed(2)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
