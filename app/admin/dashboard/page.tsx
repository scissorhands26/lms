import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { BookOpen, Pencil, Users, Clipboard } from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fakeDB.students.length}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              +{fakeDB.students.length} from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fakeDB.courses.length}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              +{fakeDB.courses.length} from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Assignments Submitted
            </CardTitle>
            <Clipboard className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                fakeDB.assignments.filter(
                  (assignment) => assignment.submissions
                ).length
              }
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              +{" "}
              {fakeDB.assignments.filter((assignment) => assignment.submissions)
                .length - fakeDB.assignments.length}
              % from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Average Grades
            </CardTitle>
            <Pencil className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                fakeDB.assignments.reduce(
                  (acc, assignment) =>
                    acc +
                    assignment.submissions.reduce(
                      (acc, submission) => acc + submission.grade,
                      0
                    ),
                  0
                ) /
                  fakeDB.assignments.reduce(
                    (acc, assignment) => acc + assignment.submissions.length,
                    0
                  )
              )}
              %
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              +
              {Math.round(
                fakeDB.assignments.reduce(
                  (acc, assignment) =>
                    acc +
                    assignment.submissions.reduce(
                      (acc, submission) => acc + submission.grade,
                      0
                    ),
                  0
                ) /
                  fakeDB.assignments.reduce(
                    (acc, assignment) => acc + assignment.submissions.length,
                    0
                  )
              ) -
                Math.round(
                  fakeDB.assignments.reduce(
                    (acc, assignment) =>
                      acc +
                      assignment.submissions.reduce(
                        (acc, submission) => acc + submission.grade,
                        0
                      ),
                    0
                  ) /
                    fakeDB.assignments.reduce(
                      (acc, assignment) => acc + assignment.submissions.length,
                      0
                    )
                )}
              % from last month
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fakeDB.students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.rank + " " + student.name}</TableCell>
                    <TableCell>{student.courses}</TableCell>
                    <TableCell>{student.enrolled_date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fakeDB.assignments
                  .filter(
                    (assignment) => new Date(assignment.due_date) > new Date()
                  )
                  .map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell>{assignment.course_name}</TableCell>
                      <TableCell>{assignment.name}</TableCell>
                      <TableCell>{assignment.due_date}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card> */}
      </div>
    </main>
  );
}
