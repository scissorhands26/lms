import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Plus } from "lucide-react";

export default function GradesPage() {
  const fakeDB = require("../../../fakeDatabase.json");

  return (
    <main className="flex-1 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Grades</h1>{" "}
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
        <Card>
          <CardHeader>
            <CardTitle>Student Grade Summary</CardTitle>
            <CardDescription>
              View and filter student grades by class, student, or assignment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="class">Class</Label>
                <Select defaultValue="all" id="class">
                  <SelectTrigger>
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="math">Math</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                  </SelectContent>
                </Select>
                <Label htmlFor="student">Student</Label>
                <Select defaultValue="all" id="student">
                  <SelectTrigger>
                    <SelectValue placeholder="All Students" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="john">John Doe</SelectItem>
                    <SelectItem value="jane">Jane Smith</SelectItem>
                    <SelectItem value="bob">Bob Johnson</SelectItem>
                  </SelectContent>
                </Select>
                <Label htmlFor="assignment">Assignment</Label>
                <Select defaultValue="all" id="assignment">
                  <SelectTrigger>
                    <SelectValue placeholder="All Assignments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Assignments</SelectItem>
                    <SelectItem value="math-test">Math Test</SelectItem>
                    <SelectItem value="english-essay">English Essay</SelectItem>
                    <SelectItem value="science-lab">Science Lab</SelectItem>
                  </SelectContent>
                </Select>
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
                  {fakeDB.grades.map((grade) => (
                    <TableRow key={grade.id}>
                      <TableCell>{grade.student_name}</TableCell>
                      <TableCell>{grade.course_name}</TableCell>
                      <TableCell>{grade.assignment_name}</TableCell>
                      <TableCell>{grade.grade}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
