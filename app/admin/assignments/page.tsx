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

export default function AssignmentsPage() {
  const fakeDB = require("../../../fakeDatabase.json");

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Assignments</h1>
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
                    {fakeDB.courses.map((course) => (
                      <option key={course.id} value={course.code}>
                        {course.name}
                      </option>
                    ))}
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
      <div className="border shadow-sm rounded-lg">
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
            {fakeDB.assignments.map((assignment) => (
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
                  <Badge variant="success">
                    {assignment.submissions.length}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoveHorizontal className="w-4 h-4" />
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
