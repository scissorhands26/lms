import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { MoveHorizontal } from "lucide-react";

export default function CoursesPage() {
  const fakeDB = require("../../../fakeDatabase.json");

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Courses</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="ml-auto" size="sm">
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <form className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter course name"
                    type="text"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="code">Code</Label>
                  <Input
                    id="code"
                    placeholder="Enter course code"
                    type="text"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input
                    id="code"
                    placeholder="Enter instructor name"
                    type="text"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter course description"
                  />
                </div>
                <Button className="w-full" type="submit">
                  Add Course
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
              <TableHead>Code</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Enrolled Students</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fakeDB.courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{course.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="success">{course.code}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8 border">
                      <AvatarImage
                        alt="Instructor"
                        src="/placeholder-user.jpg"
                      />
                      <AvatarFallback>
                        {course.instructor.split(" ")[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span>{course.instructor}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="success">120</Badge>
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
                      <DropdownMenuItem>View Course</DropdownMenuItem>
                      <DropdownMenuItem>Edit Course</DropdownMenuItem>
                      <DropdownMenuItem>Manage Enrollments</DropdownMenuItem>
                      <DropdownMenuItem>Delete Course</DropdownMenuItem>
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
