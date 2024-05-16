import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "../ui/input";

export default function ApiButton() {
  // get json from endpoint and set in state
  const [fetchURL, setFetchURL] = useState(
    "https://jsonplaceholder.typicode.com/todos/1"
  );
  const [data, setData] = useState<any>(null);

  const fetchData = async () => {
    let failMessage = "Failed to fetch data";
    const response = await fetch(fetchURL);
    // if fetch fails, set data to error message
    if (!response.ok) {
      setData(failMessage);
      return;
    }
    const json = await response.json();
    setData(json);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Button</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex">
          <Input
            className="mr-4"
            placeholder="Enter fetch URL"
            value={fetchURL}
            onChange={(e) => setFetchURL(e.target.value)}
          />
          <Button onClick={fetchData}>Fetch Data</Button>
        </div>
        <div className="border border-white p-2 rounded mt-4">
          {data ? (
            <p>{JSON.stringify(data, null, 2)}</p>
          ) : (
            <p>fetching from: {fetchURL}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
