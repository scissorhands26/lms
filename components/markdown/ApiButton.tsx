import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "../ui/input";

export default function ApiButton() {
  const [fetchURL, setFetchURL] = useState<string>(
    "https://dummyjson.com/products/1?delay=1000"
  );
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const validateURL = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const fetchData = async () => {
    if (!validateURL(fetchURL)) {
      setError("Invalid URL");
      setData(null);
      return;
    }

    setError(null);
    setLoading(true);
    let failMessage = "Failed to fetch data";
    try {
      const response = await fetch(fetchURL);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const json = await response.json();
      setData(json);
    } catch (error: any) {
      setError(error.message || failMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-transparent">
      <CardHeader>
        <CardTitle>API Button</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <Input
            className="mr-4 flex-1"
            placeholder="Enter fetch URL"
            value={fetchURL}
            onChange={(e) => {
              setFetchURL(e.target.value);
              if (!validateURL(e.target.value)) {
                setError("Invalid URL");
              } else {
                setError(null);
              }
            }}
          />
          <Button onClick={fetchData} disabled={loading}>
            {loading ? "Fetching..." : "Fetch Data"}
          </Button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {data && (
          <div className="border border-white p-2 rounded mt-4">
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
        {data && (
          <Button className="mt-4" onClick={() => setData(null)}>
            Clear Data
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
