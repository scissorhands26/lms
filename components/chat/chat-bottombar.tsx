"use client";

import { FileImage, PlusCircle, SendHorizontal, ThumbsUp } from "lucide-react";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Message } from "./data";
import { Textarea } from "../ui/textarea";
import { EmojiPicker } from "./emoji-picker";
import { Popover, PopoverTrigger } from "../ui/popover";

interface ChatBottombarProps {
  sendMessage: (newMessage: Message, file?: File | null) => void;
  isMobile: boolean;
  user: any;
}

export const BottombarIcons = [{ icon: FileImage }, { icon: PlusCircle }];

export default function ChatBottombar({
  sendMessage,
  isMobile,
  user,
}: ChatBottombarProps) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleThumbsUp = () => {
    const newMessage: any = {
      id: message.length + 1,
      name: user.name,
      avatar: user.avatar,
      message: "👍",
      created: new Date(),
      expand: { user: { branch: user.branch } },
    };
    console.log(user);
    sendMessage(newMessage, null);
    setMessage("");
  };

  const handleSend = () => {
    if (message.trim() || file) {
      const newMessage: any = {
        id: message.length + 1,
        name: user.name,
        avatar: user.avatar,
        message: message.trim(),
        created: new Date(),
        expand: { user: { branch: user.branch } },
      };
      sendMessage(newMessage, file);
      setMessage("");
      setFile(null);

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }

    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      setMessage((prev) => prev + "\n");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      setMessage((prevMessage) => prevMessage);
    }
  };

  return (
    <div className="flex w-full items-center justify-between gap-2 p-2">
      <div className="flex">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <Link
          href="#"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "h-9 w-9",
            "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          <PlusCircle size={20} className="text-muted-foreground" />
        </Link>
      </div>

      <AnimatePresence initial={false}>
        <motion.div
          key="input"
          className="relative w-full"
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.05 },
            layout: {
              type: "spring",
              bounce: 0.15,
            },
          }}
        >
          <Textarea
            autoComplete="off"
            value={message}
            ref={inputRef}
            onKeyDown={handleKeyPress}
            onChange={handleInputChange}
            name="message"
            placeholder="Aa"
            className="flex w-full resize-none items-center overflow-hidden rounded-xl border bg-background"
          ></Textarea>
          <div className="absolute bottom-0.5 right-2">
            <EmojiPicker
              onChange={(value) => {
                setMessage(message + value);
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }}
            />
          </div>
        </motion.div>

        {message.trim() || file ? (
          <Link
            href="#"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-9 w-9",
              "shrink-0 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
            )}
            onClick={handleSend}
          >
            <SendHorizontal size={20} className="text-muted-foreground" />
          </Link>
        ) : (
          <Link
            href="#"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-9 w-9",
              "shrink-0 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
            )}
            onClick={handleThumbsUp}
          >
            <ThumbsUp size={20} className="text-muted-foreground" />
          </Link>
        )}
      </AnimatePresence>
    </div>
  );
}
