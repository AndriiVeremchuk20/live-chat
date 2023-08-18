import AppRoutes from "@/config/appRoutes";
import socketApi from "@/socket/actions";
import useAppStore from "@/store";
import Chat from "@/types/chat.type";
import Message from "@/types/message.type";
import getContentDate from "@/utils/getContentDate";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import UserAvatar from "../UserAvatar";

interface PropChatListItem {
  chat: Chat;
}

const ChatListItem: React.FC<PropChatListItem> = ({ chat }) => {
  const { user } = useAppStore();

  const receiver = chat.receiver;
  const receiverAvatar = receiver.profile?.avatar_path;
  const [lastMessage, setLastMessage] = useState<Message>(chat.messages[0]);

  const router = useRouter();

  const onChatClick = useCallback(() => {
    router.push(AppRoutes.chat.toChat(chat.chat_id));
  }, []);

  useEffect(() => {
    socketApi.onReseiveMessage((message) => {
      if (message.sender_id === receiver.id) {
        setLastMessage(message);
      }
    });

    socketApi.onReadMessageResponse(({ id, isRead }) => {
      if (lastMessage.id === id) {
        setLastMessage((prev) => ({ ...prev, isRead }));
      }
    });
  }, []);

  return (
    <div
      className="flex h-[80px] cursor-pointer items-center justify-between  border-b-2 border-violet-700 bg-neutral-300 hover:opacity-50 dark:bg-cyan-950"
      onClick={onChatClick}
    >
      <div className="flex cursor-pointer items-center">
        <UserAvatar
          image={
            receiverAvatar
              ? { src: receiverAvatar, alt: receiver.first_name }
              : undefined
          }
          size={60}
          user_id={receiver.id}
        />
        <div className="flex flex-col items-start">
          <span>{`${receiver.first_name} ${receiver.last_name}`}</span>{" "}
          {/*check if message sender current user display "you:" else sender name.*/}
          <span>{`${
            user?.id === lastMessage.sender_id ? "You" : receiver.first_name
          }: ${lastMessage.text}`}</span>
        </div>
      </div>
      <div className="m-2 flex h-full items-center justify-center">
        <div
          className={`h-3 w-3 rounded-full ${
            lastMessage.isRead ? "bg-neutral-500 bg-opacity-30" : "bg-green-400"
          }`}
        ></div>
        <div className="self-end text-sm text-opacity-50">
          {getContentDate(lastMessage.created_at)}
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;
