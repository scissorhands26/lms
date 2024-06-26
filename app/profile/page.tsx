import React from "react";
import getUser from "@/pb/getUser";
import { Button } from "@/components/ui/button";
import { handleLogout } from "@/app/actions";
import { redirect } from "next/navigation";
import UploadImageForm from "./UploadImageForm";

export default async function ProfilePage() {
  const user: any = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-5 flex w-full flex-row items-center justify-between">
        <div>
          <h1 className="text-2xl">
            {user.rank + " " + user.last_name + ", " + user.first_name}
          </h1>
          {user && <p>User ID: {user.id}</p>}
        </div>
        <form action={handleLogout}>
          <Button>Logout</Button>
        </form>
      </div>
      <UploadImageForm user={user} />
    </div>
  );
}
