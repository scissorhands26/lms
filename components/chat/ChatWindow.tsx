"use client";

import { useEffect, useState } from "react";
import { ChatLayout } from "@/components/chat/chat-layout";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button"; // Make sure to import your Button component if you have one
import PocketBase from "pocketbase";
import { Chat } from "./chat";
import { MessageCircleOff, MessageCirclePlus } from "lucide-react";

export default function ChatWindow() {
  const [chat, setChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const layout = Cookies.get("react-resizable-panels:layout");
  const defaultLayout = layout ? JSON.parse(layout) : undefined;
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  const pb_cookie: any = Cookies.get("pb_auth");

  useEffect(() => {
    async function fetchUser() {
      const user = await getUser();
      setUser(user);
    }

    async function fetchMessages() {
      pb.authStore.loadFromCookie(pb_cookie);

      const records = await pb.collection("chat").getFullList({
        sort: "created",
        expand: "user",
      });

      setMessages(records);

      pb.collection("chat").subscribe(
        "*",
        function (e) {
          console.log(e.action);
          console.log(e.record);
          // Optionally handle real-time updates
          setMessages((prevMessages) => [...prevMessages, e.record]);
        },
        {
          expand: "user",
        },
      );
    }

    fetchUser();
    fetchMessages();

    // Cleanup subscription on unmount
    return () => {
      pb.collection("chat").unsubscribe("*");
    };
  }, []);

  async function createChatMessage(message: string) {
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
    const pb_cookie: any = Cookies.get("pb_auth");
    pb.authStore.loadFromCookie(pb_cookie);

    console.log(pb.authStore.model);

    let userName =
      pb.authStore.model?.rank +
      " " +
      pb.authStore.model?.last_name +
      ", " +
      pb.authStore.model?.first_name;

    const data = {
      message: message,
      user: pb.authStore.model?.id,
      datetime: new Date(),
      name: userName,
    };

    const record = await pb.collection("chat").create(data);
    // setMessages((prevMessages) => [...prevMessages, record]);
  }

  return (
    <div className="fixed bottom-4 right-4">
      <Button
        className="mb-2 bg-blue-500 text-white hover:bg-blue-600"
        onClick={() => setChat(!chat)}
      >
        {chat ? <MessageCircleOff /> : <MessageCirclePlus />}
      </Button>
      {chat && (
        <div className="fixed bottom-20 right-4 z-[10000000000] h-3/4 w-[400px] overflow-hidden rounded-lg border bg-slate-950 shadow-lg">
          <Chat
            messages={messages}
            selectedUser={user}
            isMobile={false}
            createChatMessage={createChatMessage}
          />
        </div>
      )}
    </div>
  );
}

async function getUser() {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  const pb_cookie: any = Cookies.get("pb_auth");
  pb.authStore.loadFromCookie(pb_cookie);

  if (!pb.authStore.model?.id) {
    return null;
  }

  const userRecord = await pb
    .collection("users")
    .getOne(pb.authStore.model?.id, {
      expand: "branch,courses,roles",
    });

  console.log(userRecord);

  let user = {
    name:
      userRecord.rank +
      " " +
      userRecord.last_name +
      ", " +
      userRecord.first_name,
    id: userRecord.id,
    avatar: userRecord.avatar,
    expand: { user: { branch: userRecord.branch } },
  };

  return user;
}
