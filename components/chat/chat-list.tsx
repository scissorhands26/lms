import { Message, UserData } from "./data";
import { cn } from "@/lib/utils";
import React, { useRef, useEffect } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import ChatBottombar from "./chat-bottombar";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

interface ChatListProps {
  selectedUser: any;
  sendMessage: (newMessage: Message) => void;
  isMobile: boolean;
  createChatMessage: any;
  messages: any[];
}

export function ChatList({
  selectedUser,
  sendMessage,
  isMobile,
  createChatMessage,
  messages,
}: ChatListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  // const [messages, setMessages] = React.useState<any[]>();

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  let imagePath = "/uscc.png";

  function getAvatar(user: any) {
    let img = `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/users/${user.id}/${user.avatar}`;
    console.log(img);
    if (user.avatar === "") {
      img = imagePath;
    }
    return img;
  }

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden">
      <div
        ref={messagesContainerRef}
        className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden"
      >
        <AnimatePresence>
          {messages?.map((message, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
              transition={{
                opacity: { duration: 0.1 },
                layout: {
                  type: "spring",
                  bounce: 0.3,
                  duration: messages.indexOf(message) * 0.05 + 0.2,
                },
              }}
              style={{
                originX: 0.5,
                originY: 0.5,
              }}
              className={cn(
                "flex flex-col gap-2 whitespace-pre-wrap p-4",
                message.name !== selectedUser.name
                  ? "items-start"
                  : "items-end",
              )}
            >
              <div className="flex items-center gap-3">
                {message.name !== selectedUser.name && (
                  <Avatar className="flex items-center justify-center">
                    <AvatarImage
                      src={getAvatar(message.expand.user)}
                      alt={imagePath}
                      width={6}
                      height={6}
                    />
                  </Avatar>
                )}
                <div
                  className={`flex max-w-xs flex-col rounded-md p-2 ${
                    message.expand.user.branch === "Army"
                      ? "bg-green-900"
                      : message.expand.user.branch === "Navy"
                        ? "bg-blue-900"
                        : message.expand.user.branch === "Air Force"
                          ? "bg-gray-900"
                          : message.expand.user.branch === "Marines"
                            ? "bg-red-900"
                            : "bg-accent"
                  } ${message.expand.user.roles === "gwmmfjponodgguw" ? "border-2 border-yellow-500" : ""}`}
                >
                  <span className="text-xs font-bold text-white">
                    {message.name}
                  </span>
                  <span className="text-sm text-white">{message.message}</span>
                  {message.file && (
                    <img
                      width={300}
                      alt={message.file}
                      src={`${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/chat/${message.id}/${message.file}`}
                    ></img>
                  )}
                  <span className="text-xs text-gray-400">
                    {formatTime(message.created)}
                  </span>
                </div>
                {message.name === selectedUser.name && (
                  <Avatar className="flex items-center justify-center">
                    <AvatarImage
                      src={`${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/users/${selectedUser.id}/${selectedUser.avatar}`}
                      alt={imagePath}
                      width={6}
                      height={6}
                    />
                  </Avatar>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <ChatBottombar
        sendMessage={sendMessage}
        isMobile={isMobile}
        user={selectedUser}
      />
    </div>
  );
}

function formatTime(date: string) {
  const now = new Date();
  const then = new Date(date);
  let diff = now.getTime() - then.getTime();

  if (diff < 0) {
    diff = 0; // Normalize to now if the date is in the future
  }

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} days ago`;
  }

  if (hours > 0) {
    return `${hours} hours ago`;
  }

  if (minutes > 0) {
    return `${minutes} minutes ago`;
  }

  return `${seconds} seconds ago`;
}
