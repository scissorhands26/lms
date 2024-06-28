import React from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { UserData } from "./data";
import { Globe, Info, Phone, Video } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

interface ChatTopbarProps {
  selectedUser: UserData;
}

export const TopbarIcons = [{ icon: Phone }, { icon: Video }, { icon: Info }];

export default function ChatTopbar({ selectedUser }: ChatTopbarProps) {
  return (
    <div className="flex h-20 w-full items-center justify-between border-b p-4">
      <div className="flex items-center gap-2">
        <Avatar className="flex items-center justify-center">
          {/* <AvatarImage
            src={selectedUser.avatar}
            alt={selectedUser.name}
            width={6}
            height={6}
            className="h-10 w-10 "
          /> */}
          <Globe />
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">Global Chat</span>
          <span className="text-xs">Everyone</span>
        </div>
      </div>
      {/* <div>
          {TopbarIcons.map((icon, index) => (
            <Link
              key={index}
              href="#"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9",
                "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
              )}
            >
              <icon.icon size={20} className="text-muted-foreground" />
            </Link>
          ))}
        </div> */}
    </div>
  );
}