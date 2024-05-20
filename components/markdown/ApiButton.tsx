import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuickCopy from "./QuickCopy";
import { GetUser } from "./GetUser";

export default function ApiButton({ fetchUrl }: { fetchUrl: string }) {
  const [fetchURL, setFetchURL] = useState<string>(fetchUrl);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const [intance, setInstance] = useState<any>(null);
  const [owner, setOwner] = useState<any>(null);
  const [exerciseId, setExerciseId] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

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
    fetchUser();
  }, []);

  async function getActiveSession() {
    // javascript code to get current time plus 30 minutes
    var currentTime = new Date();
    var minutes = 30;
    currentTime.setMinutes(currentTime.getMinutes() + minutes);
    var time = currentTime.toISOString();
    time = time.replace("T", " ");
    time = time.replace("Z", "");
    console.log(time);

    try {
      var fetchURL = `http://10.1.2.93:8090/api/collections/sessions/records?filter=(owner="${user.id}")&&(expires<"${time}")`;
      console.log(fetchURL);
      const response = await fetch(fetchURL);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const json = await response.json();
      if (json.items && json.items.length > 0) {
        console.log(json.items[0]);
        console.log(
          `password: ${json.items[0].password} command: ${json.items[0].command}`,
        );
        setActive(true);
        setData(json.items[0]);
      }
      console.log(json);
    } catch (error: any) {
      setError(error.message || "Failed to fetch data");
      setData(null);
    }
  }

  async function launchSession(exercise_id: string, owner: string) {
    console.log("Launching session");
    setLoading(true);

    try {
      var body = { owner: "nu2udn80polbnp0" };
      console.log(body);
      const response = await fetch(
        `http://10.1.2.93:8000/containers/${exercise_id}?owner=${owner}`,
        {
          method: "POST",
          // mode: "no-cors",
          headers: {
            accept: "application/json",
          },
        },
      );

      console.log(response);
      if (!response.ok) {
        console.log("response not ok");
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const json = await response.json();
      console.log(json);
      setData(json);
      setActive(true);
      setLoading(false);
    } catch (error: any) {
      setError(error.message || "Failed to fetch data");
      setData(null);
      setActive(false);
      setLoading(false);
    }
  }

  async function stopSession(exercise_id: string) {
    console.log("Stopping session");
    setLoading(true);
    try {
      const response = await fetch(
        `http://10.1.2.93:8000/containers/${exercise_id}`,
        {
          method: "DELETE",
          headers: {
            accept: "application/json",
          },
        },
      );

      console.log(response);
      if (!response.ok) {
        console.log("response not ok");
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const json = await response.json();
      console.log(json);
      setData(json);
      setActive(false);
      setLoading(false);
    } catch (error: any) {
      setError(error.message || "Failed to fetch data");
      setData(null);
      setActive(false);
      setLoading(false);
    }
  }

  async function launchOrGetSession() {
    if (active) {
      console.log("Getting active session");
      getActiveSession();
    } else {
      launchSession("exercise01", "nu2udn80polbnp0");
    }
  }

  return (
    <Card className="bg-transparent">
      <CardHeader>
        <CardTitle>Exercise 01</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          {active && !loading ? (
            <Button onClick={() => stopSession("exercise01")}>
              Stop instance
            </Button>
          ) : (
            <Button onClick={launchOrGetSession} disabled={loading}>
              {loading ? "Loading..." : "Launch instance"}
            </Button>
          )}
        </div>
        {error && <p className="mt-2 text-red-500">{error}</p>}
        {active && (
          <div className="mt-4 rounded border border-white p-2">
            <QuickCopy snippet={data.command} title="Command" />
            <QuickCopy snippet={data.password} title="Password" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
