//@ts-nocheck

import React from "react";
import getPb from "@/pb/getPb";
import { handleCreateStudent } from "./actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { toast } from "sonner";
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
  DialogClose,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { MoveHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

async function getStudents() {
  const pb = await getPb();

  const users = await pb.collection("users").getFullList({
    sort: "-created",
    expand: "roles,courses",
  });

  const students: any[] = [];

  users.forEach((user) => {
    const student = {
      age: user.age,
      avatar: user.avatar,
      branch: user.branch,
      courses: user.expand?.courses,
      created: user.created,
      email: user.email || "Not found",
      enrolled_date: user.enrolled_date,
      first_name: user.first_name,
      id: user.id,
      last_login: user.last_login,
      last_name: user.last_name,
      mos: user.mos,
      name: user.name,
      rank: user.rank,
      role: user.expand?.roles,
      updated: user.updated,
      username: user.username,
      verified: user.verified,
      birthdate: user.birthdate,
    };

    console.log(student.role);

    if (student.role.name === "student") students.push(student);
  });

  return students;
}

export default async function StudentsPage() {
  const students = await getStudents();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Students</h1>{" "}
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
              <form className="grid gap-4" action={handleCreateStudent}>
                <div className="grid gap-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    placeholder="Enter student first name"
                    type="text"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    placeholder="Enter student last name"
                    type="text"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="Enter student email"
                    type="email"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    placeholder="Enter student password"
                    type="password"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="birthdate">Birthdate</Label>
                  <Input id="birthdate" type="date" name="birthdate" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="branch">Branch</Label>
                  <Input
                    id="branch"
                    name="branch"
                    placeholder="Enter student branch"
                    type="text"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="mos">MOS</Label>
                  <Input
                    id="mos"
                    name="mos"
                    placeholder="Enter student MOS"
                    type="text"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rank">Rank</Label>
                  <Input
                    id="rank"
                    name="rank"
                    placeholder="Enter student rank"
                    type="text"
                  />
                </div>
                <DialogClose asChild>
                  <Button className="w-full" type="submit">
                    Add Student
                  </Button>
                </DialogClose>
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
              <TableHead>Branch</TableHead>
              <TableHead>MOS</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Courses</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 border">
                      <AvatarImage
                        alt="Instructor"
                        src="/placeholder-user.jpg"
                      />
                      <AvatarFallback>
                        {student.rank.split(" ")[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">
                      {student.rank +
                        " " +
                        student.last_name +
                        ", " +
                        student.first_name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{student.branch}</TableCell>
                <TableCell>{student.mos}</TableCell>
                <TableCell>
                  {
                    // convert birthdate to age
                    new Date().getFullYear() -
                      new Date(student.birthdate).getFullYear()
                  }
                </TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  {student.courses.map((course: any) => (
                    <Badge key={course} variant="success">
                      {course.name}
                    </Badge>
                  ))}
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
                      <DropdownMenuItem>Edit</DropdownMenuItem>
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
