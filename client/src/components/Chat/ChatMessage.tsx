import socketApi from "@/socket/actions";
import useAppStore from "@/store";
import Message from "@/types/message.type";
import getContentDate from "@/utils/getContentDate";
import { useEffect, useState } from "react";
import { MdDone, MdDoneAll } from "react-icons/md";

interface ChatMessageProp {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProp> = ({ message }) => {
  const { user } = useAppStore();
  const [chatMessage, setChatMessage] = useState<Message>(message);
  const lines = message.text.split("\n");

  useEffect(() => {
    if (!chatMessage.isRead && chatMessage.sender_id !== user?.id) {
      socketApi.onReadMessage({ message_id: chatMessage.id });
    }

    socketApi.onReadMessageResponse(({ id, isRead }) => {
      if (chatMessage.id === id) {
        setChatMessage((prev) => ({ ...chatMessage, isRead }));
      }
    });
  }, [user]);

  return (
    <div
      className={`flex ${
        message.sender_id === user?.id ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`mx-2 flex flex-col rounded-md phone:p-1 desktop:p-2 ${
          message.sender_id === user?.id ? "bg-violet-200" : "bg-violet-400"
        }`}
      >
        <div className="flex min-w-fit max-w-xs flex-col  text-lg">
          {lines.map((line, index) => (
            <p className="break-all" key={index}>
              {line}
            </p>
          ))}
        </div>
        <div className={`flex ${message.sender_id===user?.id?"flex-row":"flex-row-reverse"} justify-between gap-2 text-sm text-neutral-500 text-opacity-70`}>
          <div>{chatMessage.isRead ? <MdDoneAll /> : <MdDone />}</div>
          <span>
            {getContentDate(message.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
};