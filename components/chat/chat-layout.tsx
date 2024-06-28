"use client";

import { userData } from "./data";
import React, { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";
import { Chat } from "./chat";
import Cookies from "js-cookie";
import PocketBase from "pocketbase";

interface ChatLayoutProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  createChatMessage: any;
  user: any;
}

export function ChatLayout({
  defaultLayout = [320, 480],
  defaultCollapsed = false,
  navCollapsedSize,
  createChatMessage,
  user,
}: ChatLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [selectedUser, setSelectedUser] = useState(user);
  const [isMobile, setIsMobile] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    getChatMessages();

    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkScreenWidth();

    // Event listener for screen width changes
    window.addEventListener("resize", checkScreenWidth);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  async function getChatMessages() {
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
    const pb_cookie: any = Cookies.get("pb_auth");
    pb.authStore.loadFromCookie(pb_cookie);

    const records = await pb.collection("chat").getFullList({
      sort: "-created",
    });
    console.log("records", records);
    setMessages(records);
  }

  return (
    <Chat
      messages={messages}
      selectedUser={selectedUser}
      isMobile={isMobile}
      createChatMessage={createChatMessage}
    />
    // <ResizablePanelGroup
    //   direction="horizontal"
    //   onLayout={(sizes: number[]) => {
    //     document.cookie = `react-resizable-panels:layout=${JSON.stringify(
    //       sizes,
    //     )}`;
    //   }}
    //   className="h-full items-stretch"
    // >
    //   <ResizablePanel
    //     defaultSize={defaultLayout[0]}
    //     collapsedSize={navCollapsedSize}
    //     collapsible={true}
    //     minSize={isMobile ? 0 : 24}
    //     maxSize={isMobile ? 8 : 30}
    //     onCollapse={() => {
    //       setIsCollapsed(true);
    //       document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
    //         true,
    //       )}`;
    //     }}
    //     onExpand={() => {
    //       setIsCollapsed(false);
    //       document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
    //         false,
    //       )}`;
    //     }}
    //     className={cn(
    //       isCollapsed &&
    //         "min-w-[50px] transition-all duration-300 ease-in-out md:min-w-[70px]",
    //     )}
    //   >
    //     {/* <Sidebar
    //       isCollapsed={isCollapsed || isMobile}
    //       links={userData.map((user) => ({
    //         name: user.name,
    //         messages: user.messages ?? [],
    //         avatar: user.avatar,
    //         variant: selectedUser.name === user.name ? "grey" : "ghost",
    //       }))}
    //       isMobile={isMobile}
    //     /> */}
    //   </ResizablePanel>
    //   <ResizableHandle withHandle />
    //   <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>

    //   </ResizablePanel>
    // </ResizablePanelGroup>
  );
}
