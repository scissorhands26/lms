import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import QuickCopy from "./QuickCopy";
import { GetUser } from "./GetUser";
import { GetExercise } from "./GetExercise";
import { usePathname } from "next/navigation";

export default function ExerciseTasks() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const [exercise, setExercise] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  const rawPathName = usePathname();
  const pathName =
    rawPathName
      ?.split("/")
      .pop()
      ?.split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") || "";

  const exerciseID = `Exercise${pathName[0]}${pathName[1]}`;

  async function getTasks() {
    const user = await GetUser();

    const url = `${process.env.NEXT_PUBLIC_CONTAINER_URL}/exercises/tasks/${exerciseID}/${user.id}`;
    const response = await fetch(url, {
      headers: { accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();
    setActive(true);
    return json;
  }

  useEffect(() => {
    async function fetchUserAndTasks() {
      try {
        const data = await getTasks();
        setData(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchUserAndTasks();
  }, [exerciseID]);

  return (
    <Card className="bg-transparent">
      <CardHeader>
        <CardTitle>{exerciseID}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="mt-4 rounded border border-white p-2">
            <Skeleton className="mb-2 h-[72px] w-full rounded" />
            <Skeleton className="h-[72px] w-full rounded" />
          </div>
        )}
        {error && <p className="mt-2 text-red-500">{error}</p>}

        {!loading && data && (
          <div>
            {Object.keys(data).map((key) => (
              <div key={key}>
                <h3>{key}</h3>
                <p>Question: {data[key].expand.task.question}</p>
                <p>Hint: {data[key].expand.task.hint}</p>
                <p>Answer: {data[key].expand.task.answer}</p>
                <p>Completed: {data[key].completed ? "Yes" : "No"}</p>
                <p>ID: {data[key].id}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
