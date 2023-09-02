import AppRoutes from "@/config/appRoutes";
import socketApi from "@/socket/actions";
import useAppStore from "@/store";
import Message from "@/types/message.type";
import AppUser from "@/types/user.type";
import getContentDate from "@/utils/getContentDate";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import UserAvatar from "../UserAvatar";
import { BsCardImage } from "react-icons/bs";

interface PropChatListItem {
  lastChatMessage: Message;
}

const ChatListItem: React.FC<PropChatListItem> = ({ lastChatMessage }) => {
  const { user } = useAppStore();

  const [lastMessage, setLastMessage] = useState<Message>(lastChatMessage);

  const [receiver, setReceiver] = useState<AppUser | null>(
    lastMessage.reciver_id !== user?.id
      ? lastMessage.receiver
      : lastMessage.sender,
  );

  const router = useRouter();

  const onChatClick = useCallback(() => {
    router.push(AppRoutes.chat.toChat(lastChatMessage.chat_id));
  }, []);

  useEffect(() => {
    setReceiver(
      lastChatMessage.sender_id === user?.id
        ? lastChatMessage.receiver
        : lastMessage.sender,
    );
  }, [lastChatMessage]);

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
      className="mx-3 my-1 flex h-[90px] cursor-pointer items-center justify-between py-1 text-black hover:rounded-xl hover:bg-neutral-600 hover:bg-opacity-40 dark:text-white"
      onClick={onChatClick}
    >
      <div className="flex cursor-pointer items-center gap-2">
        <UserAvatar
          image={
            receiver?.avatar_path
              ? {
                  src: receiver.avatar_path,
                  alt: receiver.first_name,
                }
              : undefined
          }
          size={60}
          user_id={receiver?.id}
        />
        <div className="flex flex-col items-start">
          <span className="font-semibold">{`${receiver?.first_name} ${receiver?.last_name}`}</span>{" "}
          {/*check if message sender current user display "you:" else sender name.*/}
          <div className="flex items-center gap-2">
            <span>
              {`${
                user?.id === lastMessage.sender_id
                  ? "You"
                  : receiver?.first_name
              } :`}
            </span>

            {lastMessage.image_url ? (
              <div className="flex items-center gap-1">
                <BsCardImage /> <span className="text-sm">Image</span>
              </div>
            ) : null}
            <span>{lastMessage.text ? lastMessage.text : null}</span>
          </div>
        </div>
      </div>

      <div className="flex h-full flex-col items-center justify-between">
        <div></div>
        <div className="flex items-center justify-center">
          {/* Точка в конце по средине */}
          <div
            className={`h-3 w-3 rounded-full ${
              lastMessage.isRead
                ? "bg-neutral-500 bg-opacity-30"
                : "bg-green-400"
            }`}
          ></div>
        </div>
        <div className="p-1 text-sm text-opacity-50">
          {/* Дата в конце снизу */}
          {getContentDate(lastMessage.created_at)}
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;
