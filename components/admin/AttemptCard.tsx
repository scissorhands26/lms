"use client";

import { Box, CalendarIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "../ui/badge";
import Link from "next/link";

export default function AttemptCard({ attempt, exerciseID }: any) {
  function calculateTimeSince(date: string) {
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

  function calculateCompletedAnswers(answers: any[]) {
    return answers.filter((answer) => answer.completed).length;
  }

  return (
    <Link href={`/admin/exercises/${exerciseID}/${attempt.id}`}>
      <Card key={attempt.id}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-mono text-sm font-medium">
            Attempt: {attempt.attempt}
          </CardTitle>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Box className="h-8 w-8 rounded-xl border p-1 text-gray-500 hover:cursor-pointer dark:text-gray-400" />
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between space-x-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Container Info</h4>
                  <p className="text-sm">{attempt.container_info?.command}</p>
                  <div className="flex items-center pt-2">
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
                    <span className="text-xs text-muted-foreground">
                      Spawned {attempt.created}
                    </span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {attempt.expand.student.rank} {attempt.expand.student.last_name}
            {", "}
            {attempt.expand.student.first_name}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {calculateTimeSince(attempt.created)}
          </p>
        </CardContent>
        <CardFooter className="flex flex-row justify-between">
          <span>
            {calculateCompletedAnswers(attempt.answers)}/
            {attempt.answers.length} Complete
          </span>
          {attempt.running ? (
            <Badge className="cursor-default bg-green-500 hover:bg-green-500">
              Running
            </Badge>
          ) : (
            <Badge className="cursor-default bg-red-500 hover:bg-red-500">
              Stopped
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
