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
import {
  CircleCheck,
  CircleHelp,
  CircleX,
  Circle,
  Minus,
  Maximize2,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "../ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const prettyExerciseID = `Exercise ${pathName[0]}${pathName[1]}`;

  const fetchUserAndExercise = async () => {
    const currentUser = await GetUser();
    setUser(currentUser);

    console.log(exerciseID);
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
                  item.submitted_answer = e.record.submitted_answer;
                  e.record.completed
                    ? // @ts-ignore
                      toast("Task completed!", { type: "success" })
                    : toast("Task updated", {
                        description: `Submitted Answer: ${e.record.submitted_answer}`,
                      });

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
    async function fetchUser() {
      const currentUser = await GetUser();
      setUser(currentUser);
    }
    fetchUser();
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
        let response_json = await response.json();
        throw new Error(`Error ${response.status}: ${response_json.detail}`);
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
      console.log(error);
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

  async function handleSubmitAnswer(
    event: React.FormEvent<HTMLFormElement>,
    data: any,
  ): Promise<void> {
    event.preventDefault();
    console.log(data);
    const formData = new FormData(event.currentTarget);
    const submittedAnswer = formData.get("answer") as string;

    const update = await pb.collection("exercise_answers").update(data.id, {
      submitted_answer: submittedAnswer,
    });
  }

  function showDesc(index: any) {
    const desc: any = document.getElementById(`desc-${index}`);
    if (desc.style.display === "none") {
      desc.style.display = "block";
    } else {
      desc.style.display = "none";
    }
  }

  const statusIcon = (data: any) => {
    if (data.submitted_answer === "" && !data.completed) {
      return (
        <span className="text-gray-700 dark:text-gray-500">
          <Circle />
        </span>
      );
    }

    if (data.submitted_answer !== "" && !data.completed) {
      return (
        <span className="text-red-700 dark:text-red-500">
          <CircleX />
        </span>
      );
    }

    if (data.submitted_answer !== "" && data.completed) {
      return (
        <span className="text-green-700 dark:text-green-500">
          <CircleCheck />
        </span>
      );
    }

    // Optionally handle cases where data.completed is true and submitted_answer is empty
    return null;
  };

  const RenderIcon = ({ data }: any) => {
    return statusIcon(data);
  };

  return (
    <Card className="bg-transparent">
      <CardHeader>
        <CardTitle className="flex flex-row items-center justify-between">
          {prettyExerciseID}
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
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p className="mt-2 text-red-500">{error}</p>}
        {loading && (
          <div className="mt-4 flex flex-col rounded border p-2 font-mono">
            <span className="text-center text-xl">Connect</span>
            <Skeleton className="mb-2 h-[72px] w-full rounded" />
            <Skeleton className="h-[72px] w-full rounded" />
          </div>
        )}
        {exercise && !loading && (
          <div className="mt-4 flex flex-col rounded border p-2 font-mono">
            <span className="text-center text-xl">Connect</span>
            <QuickCopy snippet={exercise?.command} title="Command" />
            <QuickCopy snippet={exercise.password} title="Password" />
          </div>
        )}
        {!loading && data && (
          <div className="mt-4">
            {Object.keys(data).map((key, index) => (
              <div key={data[key].id} className="mt-2 rounded p-2">
                <div className="my-2 flex flex-col rounded-lg">
                  <Toaster />
                  {data[key]?.expand?.task?.desc ? (
                    <div className="mb-2 rounded-lg bg-blue-300 font-mono dark:bg-slate-900">
                      <div className="mb-2 rounded-t-lg bg-blue-200 px-4 dark:bg-slate-800">
                        <div className="flex flex-row justify-between">
                          Information{" "}
                          <span
                            className="hover:cursor-pointer"
                            onClick={() => showDesc(index)}
                          >
                            {data[key]?.expand?.task?.desc ? (
                              <Maximize2 className="w-4" />
                            ) : (
                              <Minus />
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="px-4 pb-2">
                        <div
                          style={{ display: "none" }}
                          className="markdown"
                          id={`desc-${index}`}
                          dangerouslySetInnerHTML={{
                            __html: data[key]?.expand?.task?.desc || null,
                          }}
                        />
                      </div>
                    </div>
                  ) : null}
                  <div className="mb-2 rounded-lg bg-blue-300 font-mono dark:bg-slate-900">
                    <div className="rounded-t-lg bg-blue-200 pl-4 pr-2 dark:bg-slate-800">
                      <div className="flex flex-row items-center justify-between">
                        Task {index + 1}:{" "}
                        <div className="flex flex-row items-center">
                          <div key={key}>
                            <RenderIcon data={data[key]} />
                          </div>
                          <Popover>
                            <PopoverTrigger>
                              <CircleHelp className="m-2 text-white" />
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="grid gap-4">
                                <div className="space-y-2 font-mono">
                                  <h4 className="font-medium leading-none">
                                    Hint
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {data[key]?.expand?.task?.hint || "N/A"}
                                  </p>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-row items-center justify-between">
                      <div className="px-4 pb-2">
                        <code className="font-mono">
                          {data[key]?.expand?.task?.question || "N/A"}
                        </code>
                      </div>
                    </div>
                    {data[key]?.expand?.task?.requires_submission && (
                      <div className="flex w-full px-2 pb-2">
                        <form
                          onSubmit={(e) => handleSubmitAnswer(e, data[key])}
                          className="w-full"
                        >
                          <div className="flex w-full flex-row items-center justify-between space-x-2">
                            <Input
                              name="answer"
                              placeholder="Answer"
                              className="w-full"
                            />
                            <Button className="w-14 ">{">>"}</Button>
                          </div>
                        </form>
                      </div>
                    )}
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
