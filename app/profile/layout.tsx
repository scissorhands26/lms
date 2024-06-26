import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Search } from "lucide-react";
import { NavLinks } from "@/components/admin/NavLinks";
import getPb from "@/pb/getPb";

export default async function ProfileLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pb = await getPb();

  const user = await pb.authStore.model;

  return (
    <div className="min-h-screen w-full">
      <div className="flex flex-col">
        <header className="flex h-14 items-center justify-between gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 lg:h-[60px]">
          <Link className="" href="/">
            <span className="text-xl font-bold">C3</span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="h-8 w-8 rounded-full border border-gray-200 dark:border-gray-800"
                size="icon"
                variant="ghost"
              >
                <Avatar>
                  <AvatarImage
                    src={`${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/users/${user?.id}/${user?.avatar}`}
                  />
                  <AvatarFallback>{user.rank}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {user.rank + " " + user.last_name}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
