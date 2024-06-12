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
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import getPb from "@/pb/getPb";
import Link from "next/link";

async function getContent() {
  const pb = await getPb();
  const content = await pb.collection("content").getFullList({
    sort: "-created",
  });

  return content;
}

export default async function CoursesPage() {
  const content = await getContent();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Content</h1>
      </div>
      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Day</TableCell>
              <TableCell>Lesson</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>File</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {content.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.day}</TableCell>
                <TableCell>{item.lesson}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.file}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="rounded bg-white px-2 py-1 text-black">
                      Actions
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Link
                          href={`${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/content/${item.id}/${item.file}`}
                        >
                          Download
                        </Link>
                      </DropdownMenuItem>
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
