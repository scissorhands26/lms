"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GlobeComponent from "@/components/login/GlobeComponent";
import getUser from "@/pb/getUser";
import { redirect } from "next/navigation";
import { handleLogin } from "@/app/actions";
import { EvervaultCard, Icon } from "@/components/login/evervault-card";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const response = await handleLogin(formData);

    if (response?.error) {
      setError(response.error);
    } else {
      window.location.href = "/c3"; // Ensure navigation to the dashboard
    }
  }

  return (
    <div className="h-screen w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="relative mx-auto flex h-[38rem] max-w-sm flex-col items-center border border-black/[0.2] p-4 dark:border-white/[0.2]">
            <Icon className="absolute -left-3 -top-3 h-6 w-6 text-black dark:text-white" />
            <Icon className="absolute -bottom-3 -left-3 h-6 w-6 text-black dark:text-white" />
            <Icon className="absolute -right-3 -top-3 h-6 w-6 text-black dark:text-white" />
            <Icon className="absolute -bottom-3 -right-3 h-6 w-6 text-black dark:text-white" />

            <EvervaultCard text="C3" />

            <form onSubmit={handleSubmit} className="mt-4 flex w-full">
              <div className="grid w-full gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    name="identity"
                    id="username"
                    type="text"
                    placeholder="student00"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    name="password"
                    id="password"
                    type="password"
                    placeholder="************"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </form>
          </div>
          {error && <p className="text-center text-red-500">{error}</p>}
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <GlobeComponent />
      </div>
    </div>
  );
}
