import socketApi from "@/socket/actions";
import Message from "@/types/message.type";
import React, { useEffect, useRef, useState } from "react";
import { ChatMessage } from "./Message";

interface PropMessagesList {
  messages: Array<Message>;
}

const MessagesList: React.FC<PropMessagesList> = ({ messages }) => {
  const [messagesList, setMessagesList] = useState<Array<Message>>(messages);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesList.length]);

  useEffect(() => {
    socketApi.onDeleteMessageResponse(({ message_id }) => {
		setMessagesList(prev=>prev.filter(message=>message.id!==message_id));
	});
  }, []);

  return (
    <div className="my-3 flex h-full flex-col gap-3 overflow-auto">
      {messagesList.map((message) => (
        <ChatMessage message={message} key={message.id} />
      ))}
      <div ref={lastMessageRef} />
    </div>
  );
};

export default MessagesList;
