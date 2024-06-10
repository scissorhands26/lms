import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import QuickCopy from "./QuickCopy";
import { GetUser } from "./GetUser";
import { GetExercise } from "./GetExercise";
import { usePathname } from "next/navigation";

export default function ApiButton() {
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

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = await GetUser();
      setUser(currentUser);

      const exerciseData = await GetExercise(exerciseID);
      setExercise(exerciseData);
      if (exerciseData) {
        setActive(true);
      }
    };

    fetchData();
  }, [exerciseID]);

  const handleSession = async (
    method: "GET" | "POST" | "DELETE",
    exercise_id: string,
    owner: string,
  ) => {
    setLoading(true);

    try {
      const url = `${process.env.NEXT_PUBLIC_CONTAINER_URL}/exercises/${exercise_id}/${owner}`;
      const response = await fetch(url, {
        method,
        headers: { accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      if (method === "GET" && json.items?.length > 0) {
        setActive(true);
        setData(json.items[0]);
      } else if (method === "POST") {
        setExercise(json);
        setActive(true);
      } else if (method === "DELETE") {
        setExercise(null);
        setActive(false);
      }
    } catch (error: any) {
      setError(error.message || "Failed to fetch data");
      setData(null);
      setActive(false);
    } finally {
      setLoading(false);
    }
  };

  const launchOrGetSession = () => {
    if (active) {
      handleSession("GET", exerciseID, user.id);
    } else {
      handleSession("POST", exerciseID, user.id);
    }
  };

  const stopSession = () => handleSession("DELETE", exerciseID, user.id);

  return (
    <Card className="bg-transparent">
      <CardHeader>
        <CardTitle>{exerciseID}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          {exercise && !loading ? (
            <Button onClick={stopSession}>Stop instance</Button>
          ) : (
            <Button onClick={launchOrGetSession} disabled={loading}>
              {loading
                ? active
                  ? "Shutting down..."
                  : "Launching..."
                : "Launch instance"}
            </Button>
          )}
        </div>
        {error && <p className="mt-2 text-red-500">{error}</p>}
        {loading && (
          <div className="mt-4 rounded border border-white p-2">
            <Skeleton className="mb-2 h-[72px] w-full rounded" />
            <Skeleton className="h-[72px] w-full rounded" />
          </div>
        )}
        {exercise && !loading && (
          <div className="mt-4 rounded border border-white p-2">
            <QuickCopy snippet={exercise.command} title="Command" />
            <QuickCopy snippet={exercise.password} title="Password" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
