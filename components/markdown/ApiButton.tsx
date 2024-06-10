import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import QuickCopy from "./QuickCopy";
import { GetUser } from "./GetUser";
import { GetExercise } from "./GetExercise";
import { useRouter, usePathname } from "next/navigation";

export default function ApiButton({ fetchUrl }: { fetchUrl: string }) {
  const [fetchURL, setFetchURL] = useState<string>(fetchUrl);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const [instance, setInstance] = useState<any>(null);
  const [owner, setOwner] = useState<any>(null);
  const [exercise, setExercise] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  const router = useRouter();
  const rawPathName = usePathname();

  const pathName =
    rawPathName
      ?.split("/")
      .pop()
      ?.split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") || "";

  const exerciseID = "Exercise" + pathName[0] + pathName[1];

  function validateURL(url: string) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  useEffect(() => {
    async function fetchUser() {
      const currentUser = await GetUser();
      setUser(currentUser);
    }
    async function fetchExercise() {
      const exercise = await GetExercise(exerciseID);
      setExercise(exercise);
      console.log(exercise);
      if (exercise) {
        setActive(true);
      }
    }
    fetchUser();
    fetchExercise();
  }, []);

  async function getActiveSession() {
    var currentTime = new Date();
    var minutes = 30;
    currentTime.setMinutes(currentTime.getMinutes() + minutes);
    var time = currentTime.toISOString();
    time = time.replace("T", " ");
    time = time.replace("Z", "");

    try {
      var fetchURL = `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/collections/sessions/records?filter=(owner="${user.id}")&&(expires<"${time}")`;
      const response = await fetch(fetchURL);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const json = await response.json();
      if (json.items && json.items.length > 0) {
        setActive(true);
        setData(json.items[0]);
      }
    } catch (error: any) {
      setError(error.message || "Failed to fetch data");
      setData(null);
    }
  }

  async function launchSession(exercise_id: string, owner: string) {
    setLoading(true);
    try {
      var body = { owner: "nu2udn80polbnp0" };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CONTAINER_URL}/exercises/${exercise_id}?student=${owner}`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const json = await response.json();
      setData(json);
      setActive(true);
    } catch (error: any) {
      setError(error.message || "Failed to fetch data");
      setData(null);
      setActive(false);
    } finally {
      setLoading(false);
    }
  }

  async function stopSession(exercise_id: string) {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CONTAINER_URL}/containers/${exercise_id}`,
        {
          method: "DELETE",
          headers: {
            accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      setData(null);
      setActive(false);
    } catch (error: any) {
      setError(error.message || "Failed to fetch data");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  async function launchOrGetSession() {
    if (active) {
      getActiveSession();
    } else {
      launchSession(exerciseID, user.id);
    }
  }

  return (
    <Card className="bg-transparent">
      <CardHeader>
        <CardTitle>{exerciseID}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          {exercise && !loading ? (
            <Button onClick={() => stopSession(exerciseID)}>
              Stop instance
            </Button>
          ) : (
            <Button onClick={launchOrGetSession} disabled={loading}>
              {loading && !active
                ? "Launching..."
                : loading && active
                  ? "Shutting down..."
                  : "Launch instance"}
            </Button>
          )}
        </div>
        {error && <p className="mt-2 text-red-500">{error}</p>}
        {loading ? (
          <div className="mt-4 rounded border border-white p-2">
            <Skeleton className="mb-2 h-[72px] w-full rounded" />
            <Skeleton className="h-[72px] w-full rounded" />
          </div>
        ) : null}
        {exercise && !loading ? (
          <div className="mt-4 rounded border border-white p-2">
            <QuickCopy snippet={exercise.command} title="Command" />
            <QuickCopy snippet={exercise.password} title="Password" />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
