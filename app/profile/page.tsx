import React from "react";
import getUser from "@/pb/getUser";
import { Button } from "@/components/ui/button";
import { handleLogout } from "@/app/actions";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user: any = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <div>
        <h1>Profile Page</h1>
        {user && <p>User ID: {user.id}</p>}
        <p>Welcome to the profile page!</p>
      </div>
      Profile Page
      <form action={handleLogout}>
        <Button>Logout</Button>
      </form>
    </div>
  );
}
