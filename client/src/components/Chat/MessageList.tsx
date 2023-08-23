import socketApi from "@/socket/actions";
import Message from "@/types/message.type";
import React, { useEffect, useRef, useState } from "react";
import { ChatMessage } from "./Message";

interface PropMessageList {
  messages: Array<Message>;
}

const MessageList: React.FC<PropMessageList> = ({ messages }) => {
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  return (
    <div className="my-3 flex h-full flex-col gap-3 overflow-auto">
      {messages.map((message) => (
        <ChatMessage message={message} key={message.id} />
      ))}
      <div ref={lastMessageRef} />
    </div>
  );
};

export default MessageList;
