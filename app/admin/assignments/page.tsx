import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { MoveHorizontal } from "lucide-react";
import getPb from "@/pb/getPb";

async function getAssignments() {
  const pb = await getPb();

  // Fetch all assignments
  const assignments = await pb.collection("assignments").getFullList({
    sort: "-created",
    expand: "course",
  });

  // Prepare a list of promises to fetch assignment answers
  const assignmentPromises = assignments.map(async (assignment) => {
    // Fetch all answers for the current assignment
    const answers = await pb.collection("assignment_answers").getFullList({
      sort: "-created",
      filter: `assignment = "${assignment.id}"`,
    });

    // Create a set of unique student IDs
    const uniqueStudents = new Set(answers.map((answer) => answer.student));

    // Return the processed assignment data
    return {
      name: assignment.name,
      course_name: assignment.expand?.course.name,
      course_code: assignment.expand?.course.code,
      submissions: uniqueStudents.size,
      due_date: assignment.due_date,
    };
  });

  // Wait for all promises to resolve
  const results = await Promise.all(assignmentPromises);

  return results;
}

export default async function AssignmentsPage() {
  const assignments = await getAssignments();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Assignments</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="ml-auto" size="sm">
              Add Assignment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Assignment</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <form className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter assignment name"
                    type="text"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="course">Course</Label>
                  <Select id="course">
                    {/* {fakeDB.courses.map((course) => (
                      <option key={course.id} value={course.code}>
                        {course.name}
                      </option>
                    ))} */}
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input id="due-date" type="date" />
                </div>
                <Button className="w-full" type="submit">
                  Add Assignment
                </Button>
              </form>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Submissions</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{assignment.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="success">
                    {assignment.course_name} ({assignment.course_code})
                  </Badge>
                </TableCell>
                <TableCell>{assignment.due_date}</TableCell>
                <TableCell>
                  <Badge variant="success">{assignment.submissions}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoveHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Submissions</DropdownMenuItem>
                      <DropdownMenuItem>Edit Assignment</DropdownMenuItem>
                      <DropdownMenuItem>Grade Submissions</DropdownMenuItem>
                      <DropdownMenuItem>Delete Assignment</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
