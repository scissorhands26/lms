"use server";

import login from "@/pb/login";
import logout from "@/pb/logout";
import { redirect } from "next/navigation";

export async function handleLogin(formData: FormData) {
  const identity = (formData.get("identity") as string) ?? "";
  const password = (formData.get("password") as string) ?? "";

  if (!identity || !password) {
    return { error: "Identity and password are required." };
  }

  const res = await login(identity, password);

  if (res.success === false) {
    return {
      error: "Failed to authenticate. Please check your username and password.",
    };
  }

  redirect("/c3");
}

export async function handleLogout() {
  await logout();
}
