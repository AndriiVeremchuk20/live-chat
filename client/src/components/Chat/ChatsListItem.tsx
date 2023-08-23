import AppRoutes from "@/config/appRoutes";
import socketApi from "@/socket/actions";
import useAppStore from "@/store";
import Message from "@/types/message.type";
import getContentDate from "@/utils/getContentDate";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import UserAvatar from "../UserAvatar";

interface PropChatListItem {
  lastChatMessage: Message;
}

const ChatListItem: React.FC<PropChatListItem> = ({ lastChatMessage }) => {
  const { user } = useAppStore();

  const [lastMessage, setLastMessage] = useState<Message>(lastChatMessage);
  
  const receiver =
    lastMessage.reciver_id === user?.id
      ? lastMessage.receiver
      : lastMessage.sender;

  const router = useRouter();

  const onChatClick = useCallback(() => {
    router.push(AppRoutes.chat.toChat(lastChatMessage.chat_id));
  }, []);

  useEffect(() => {
    socketApi.onReadMessageResponse(({ id, isRead }) => {
      if (lastMessage.id === id) {
        setLastMessage((prev) => ({ ...prev, isRead }));
      }
    });
  }, []);

  if (!lastMessage.receiver) {
    return null;
  }

  return (
    <div
      className="flex h-[80px] bg-opacity-50 cursor-pointer items-center justify-between  border-b-2 border-violet-700 bg-neutral-300 hover:opacity-90 dark:bg-stone-400 dark:bg-opacity-90"
      onClick={onChatClick}
    >
      <div className="flex cursor-pointer items-center">
        <UserAvatar
          image={
            receiver?.profile?.avatar_path
              ? {
                  src: receiver.profile.avatar_path,
                  alt: receiver.first_name,
                }
              : undefined
          }
          size={60}
          user_id={receiver?.id}
        />
        <div className="flex flex-col items-start">
          <span>{`${receiver?.first_name} ${receiver?.last_name}`}</span>{" "}
          {/*check if message sender current user display "you:" else sender name.*/}
          <span>{`${
            user?.id === lastMessage.sender_id
              ? "You"
              : receiver?.first_name
          }: ${lastMessage.text}`}</span>
        </div>
      </div>
      <div className="m-2 flex h-full items-end justify-end">
        <div
          className={`h-3 w-3 self-center rounded-full ${
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
