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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function StudentsPage() {
  const fakeDB = require("../../../fakeDatabase.json");

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Students</h1>{" "}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="ml-auto" size="sm">
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <form className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter student name"
                    type="text"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="Enter student email"
                    type="email"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="courses">Courses</Label>{" "}
                  <Input
                    id="email"
                    placeholder="Enter student course"
                    type="email"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="enrolled-date">Enrolled Date</Label>
                  <Input id="enrolled-date" type="date" />
                </div>
                <Button className="w-full" type="submit">
                  Add Student
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
              <TableHead>Email</TableHead>
              <TableHead>Courses</TableHead>
              <TableHead>Enrolled Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fakeDB.students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8 border">
                      <AvatarImage
                        alt="Instructor"
                        src="/placeholder-user.jpg"
                      />
                      <AvatarFallback>
                        {student.rank.split(" ")[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">
                      {student.rank + " " + student.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  {student.courses.map((course) => (
                    <Badge key={course} variant="success">
                      {course}
                    </Badge>
                  ))}
                </TableCell>
                <TableCell>{student.enrolled_date}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoveHorizontal className="w-4 h-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Enroll in Course</DropdownMenuItem>
                      <DropdownMenuItem>Unenroll</DropdownMenuItem>
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
