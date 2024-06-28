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
    <div className="flex flex-col items-center justify-center space-y-6 p-6">
      <div className="mb-6 flex w-full items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {user.rank} {user.last_name}, {user.first_name}
          </h1>
          {user && <p className="text-gray-600">User ID: {user.id}</p>}
        </div>
        <form action={handleLogout}>
          <Button className="bg-red-500 text-white hover:bg-red-600">
            Logout
          </Button>
        </form>
      </div>
      <UploadImageForm user={user} />
    </div>
  );
}
