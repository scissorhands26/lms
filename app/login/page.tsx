import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GlobeComponent from "@/components/login/GlobeComponent";

import getUser from "@/pb/getUser";
import { redirect } from "next/navigation";
import { handleLogin } from "@/app/actions";
import { EvervaultCard, Icon } from "@/components/login/evervault-card";

export default async function LoginPage() {
  const user: any = await getUser();

  if (user) {
    redirect("/c3");
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

            <form action={handleLogin} className="mt-4 flex w-full">
              <div className="grid w-full gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    name="identity"
                    id="username"
                    type="username"
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
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <GlobeComponent />
      </div>
    </div>
  );
}
