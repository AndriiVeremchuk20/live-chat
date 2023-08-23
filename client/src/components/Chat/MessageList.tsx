import socketApi from "@/socket/actions";
import Message from "@/types/message.type";
import React, { useEffect, useRef, useState } from "react";
import { ChatMessage } from "./Message";

interface PropMessageList {
  messages: Array<Message>;
}

const MessageList: React.FC<PropMessageList> = ({ messages }) => {
  const [messageList, setMessageList] = useState<Array<Message>>(messages);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageList.length]);

  useEffect(() => {
    socketApi.onDeleteMessageResponse(({ message_id }) => {
		setMessageList(prev=>prev.filter(message=>message.id!==message_id));
	});
  }, []);

  return (
    <div className="my-3 flex h-full flex-col gap-3 overflow-auto">
      {messageList.map((message) => (
        <ChatMessage message={message} key={message.id} />
      ))}
      <div ref={lastMessageRef} />
    </div>
  );
};

export default MessageList;
