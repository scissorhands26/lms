import getUser from "@/pb/getUser";
import { redirect } from "next/navigation";

export default async function Home() {
  const user: any = await getUser();

  if (user) {
    redirect("/c3");
  } else {
    redirect("/login")
  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>
  );
}
