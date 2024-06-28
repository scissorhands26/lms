"use client";

import { Message, UserData } from "./data";
import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ChatProps {
  messages?: Message[];
  selectedUser: UserData;
  isMobile: boolean;
  createChatMessage: any;
}

export function Chat({
  messages,
  selectedUser,
  isMobile,
  createChatMessage,
}: ChatProps) {
  const [messagesState, setMessages] = useState(messages || []);
  const [user, setUser] = useState();

  const sendMessage = (newMessage: Message) => {
    setMessages([...messagesState, newMessage]);
    createChatMessage(newMessage.message);
  };

  useEffect(() => {
    setMessages(messages);
  }, [messages]);

  const scrollingText =
    "This is a U.S. Government (USG) Information System (IS) that is provided for USG-authorized use only. By using this IS (which includes any device attached to this IS), you consent to the following conditions: The USG routinely intercepts and monitors communications on this IS for purposes including, but not limited to, penetration testing, COMSEC monitoring, network operations and defense, personnel misconduct (PM), law enforcement (LE), and counterintelligence (CI) investigations. At any time, the USG may inspect and seize data stored on this IS. Communications using, or data stored on, this IS are not private, are subject to routine monitoring, interception, and search, and may be disclosed or used for any USG-authorized purpose. This IS includes security measures (e.g., authentication and access controls) to protect USG interests -- not for your personal benefit or privacy. Notwithstanding the above, using this IS does not constitute consent to PM, LE, or CI investigative searching or monitoring of the content of privileged communications, or work product, related to personal representation or services by attorneys, psychotherapists, or clergy, and their assistants. Such communications and work product are private and confidential. See User Agreement for details.";

  const ScrollMessage = () => {
    const [duration, setDuration] = useState(60);

    return (
      <div
        className="relative h-8 w-full overflow-hidden bg-gray-800 text-white"
        onMouseEnter={() => {
          setDuration(1);
        }}
        onMouseLeave={() => setDuration(60)}
      >
        <motion.div
          key={duration}
          className="absolute whitespace-nowrap"
          initial={{ x: "5%" }}
          animate={{ x: "-100%" }}
          transition={{
            duration: duration,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          <span>{scrollingText}</span>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <ChatTopbar selectedUser={selectedUser} />
      <ScrollMessage />
      <ChatList
        messages={messagesState}
        selectedUser={selectedUser}
        sendMessage={sendMessage}
        isMobile={isMobile}
        createChatMessage={createChatMessage}
      />
    </div>
  );
}
