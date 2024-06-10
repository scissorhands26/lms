import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import QuickCopy from "./QuickCopy";
import { GetUser } from "./GetUser";
import { GetExercise } from "./GetExercise";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import PocketBase from "pocketbase";
import Cookies from "js-cookie";
import { CircleHelp } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function ApiButton() {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  const pb_cookie: any = Cookies.get("pb_auth");
  pb.authStore.loadFromCookie(pb_cookie);

  const [data, setData] = useState<any>(null);
  const [tasks, setTasks] = useState<any>(null);
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

  const fetchUserAndExercise = async () => {
    const currentUser = await GetUser();
    setUser(currentUser);

    const exerciseData = await GetExercise(exerciseID);
    setExercise(exerciseData);
    if (exerciseData) {
      setActive(true);
      await fetchTasks(currentUser);
    }
  };

  const fetchTasks = async (currentUser: any) => {
    const url = `${process.env.NEXT_PUBLIC_CONTAINER_URL}/exercises/tasks/${exerciseID}/${currentUser.id}`;
    const response = await fetch(url, {
      headers: { accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();
    setData(json);
    setTasks(json);

    // Subscribe to real-time updates for each task
    Object.keys(json).forEach((key) => {
      const taskId = json[key].id;
      pb.collection("exercise_answers").subscribe(taskId, function (e) {
        if (e.action === "update" && e.record.id === taskId) {
          setData((prevData: any) =>
            prevData.map(
              (item: any) => {
                if (item.id === taskId) {
                  item.completed = e.record.completed;
                  toast("Task completed!", { type: "success" });
                  return item;
                } else {
                  return item;
                }
              },
              { expand: "task,attempt" },
            ),
          );
        }
      });
    });
  };

  useEffect(() => {
    fetchUserAndExercise();
    return () => {
      // Unsubscribe from all real-time updates when the component unmounts
      pb.collection("exercise_answers").unsubscribe("*");
    };
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
        await fetchTasks(user);
      } else if (method === "DELETE") {
        setExercise(null);
        setActive(false);
        setData(null);
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
        {!loading && data && (
          <div className="mt-4">
            {Object.keys(data).map((key, index) => (
              <div key={data[key].id} className="mt-2 rounded border p-2">
                <div className="my-2 flex flex-col rounded-lg bg-blue-300 dark:bg-slate-900">
                  <Toaster />

                  <div className="rounded-t-lg bg-blue-200 px-4 dark:bg-slate-800">
                    Question {index + 1}:{" "}
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <pre className="overflow-auto">
                      <code className="font-mono">
                        {data[key]?.expand?.task?.question || "N/A"}
                      </code>
                    </pre>
                    <div className="flex flex-row items-center">
                      {data[key].completed ? (
                        <span className="text-green-500">Completed</span>
                      ) : (
                        <span className="text-red-500">Not Completed</span>
                      )}
                      <Popover>
                        <PopoverTrigger>
                          <CircleHelp className="m-2" />
                        </PopoverTrigger>
                        <PopoverContent>
                          {data[key]?.expand?.task?.hint || "N/A"}
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
