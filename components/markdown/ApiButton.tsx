import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "../ui/input";
//import getUser from "@/pb/getUser";


export default function ApiButton({ fetchUrl }: { fetchUrl: string }) {
  const [fetchURL, setFetchURL] = useState<string>(fetchUrl);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const [intance, setInstance] = useState<any>(null);
  const [owner, setOwner] = useState<any>(null);
  const [exerciseId, setExerciseId] = useState<any>(null);

  const validateURL = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const getUser = () => {
    return {
      id: "nu2udn80polbnp0"
    }
  }

  const getActiveSession = async () => {
    const user: any = getUser();
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
      if(json.items && json.items.length > 0){
        console.log(json.items[0]);
        console.log(`password: ${json.items[0].password} command: ${json.items[0].command}`);
        setActive(true);
        setData(json.items[0]);
      }
      console.log(json);
    } catch (error: any) {
      setError(error.message || "Failed to fetch data");
      setData(null);
    }
  }

  const launchSession = async (exercise_id: string, owner: string) => {
    try {
      var body = { "owner": "nu2udn80polbnp0" };
      console.log(body)
      const response = await fetch(`http://192.168.153.128:8000/containers/${exercise_id}?owner=${owner}`, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "accept": "application/json",
        }
      });
      
      console.log(response);
      if (!response.ok) {
        console.log("response not ok");
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const json = await response.json();
      console.log(json);
      setData(json);
      setActive(true);
    } catch (error: any) {
      setError(error.message || "Failed to fetch data");
      setData(null);
      setActive(false);
    }
  }

  const launchOrGetSession = async () => {
    if (active) {
      console.log("Getting active session");
      getActiveSession();
    } else {
      console.log("Launching session")
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
          <Button onClick={launchOrGetSession}>
            {active ? "Stop instance" : "Launch instance"}
          </Button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {data && (
          <div className="border border-white p-2 rounded mt-4">
            <pre>Password: {data.password}</pre>
            <pre>Command: {data.command}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
