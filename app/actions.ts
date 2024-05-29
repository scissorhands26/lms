import login from "@/pb/login";
import logout from "@/pb/logout";
import { redirect } from "next/navigation";

async function handleLogin(formData: FormData) {
  "use server";
  console.log(formData.get("identity"), formData.get("password"));
  const identity = (formData.get("identity") as string) ?? "";
  const password = (formData.get("password") as string) ?? "";

  if (!identity || !password) {
    return;
  }

  await login(identity, password);
  // redirect("/c3");
}

async function handleLogout() {
  "use server";
  await logout();
}

export { handleLogin, handleLogout };
