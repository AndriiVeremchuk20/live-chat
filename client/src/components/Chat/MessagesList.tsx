import Message from "@/types/message.type";
import React, { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";

interface PropMessagesList {
  messages: Array<Message>;
}

const MessagesList: React.FC<PropMessagesList> = ({ messages }) => {
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

export default MessagesList;
