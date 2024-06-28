"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LockOpen, Lock } from "lucide-react";
import Link from "next/link";
import PocketBase from "pocketbase";
import Cookies from "js-cookie";

export default function ExercisesTable({ exercises }: any) {
  const [exercisesState, setExercisesState] = useState(exercises);

  useEffect(() => {
    console.log("Initial exercises data:", exercises);
  }, [exercises]);

  async function handleStatusChange(exercise: any) {
    console.log(exercise.id);
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
    const pb_cookie: any = Cookies.get("pb_auth");

    pb.authStore.loadFromCookie(pb_cookie);

    if (!pb.authStore.model?.id) {
      return null;
    }

    try {
      await pb.collection("exercises").update(exercise.id, {
        unlocked: !exercise.unlocked,
      });

      // Update the state to reflect the change in the UI
      setExercisesState((prevExercises: any) =>
        prevExercises.map((ex: any) =>
          ex.id === exercise.id ? { ...ex, unlocked: !ex.unlocked } : ex,
        ),
      );
    } catch (error) {
      console.error("Error updating exercise status:", error);
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Exercise</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {exercisesState.map((exercise: any) => (
          <TableRow key={exercise.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <span className="font-medium">{exercise.title}</span>
              </div>
            </TableCell>
            <TableCell>{exercise.description}</TableCell>
            <TableCell>
              {exercise.unlocked ? (
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange(exercise)}
                  className="rounded border bg-green-500 p-1 hover:bg-green-600"
                >
                  <LockOpen />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange(exercise)}
                  className="rounded border bg-red-500 p-1 hover:bg-red-600"
                >
                  <Lock />
                </Button>
              )}
            </TableCell>
            <TableCell>
              <Link href={`/admin/exercises/${exercise.id}`}>
                <span className="rounded border p-1">Manage</span>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
