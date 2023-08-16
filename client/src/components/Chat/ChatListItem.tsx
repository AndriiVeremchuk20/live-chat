import AppRoutes from "@/config/appRoutes";
import routes from "@/config/appRoutes";
import useAppStore from "@/store";
import Chat from "@/types/chat.type";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import UserAvatar from "../UserAvatar";

interface PropChatListItem {
  chat: Chat;
}

const ChatListItem: React.FC<PropChatListItem> = ({ chat }) => {
  const { user } = useAppStore();

  const lastMessage = chat.messages[0];
  const receiver = chat.receiver;

  const router = useRouter();

  const onChatClick = useCallback(() => {
    router.push(AppRoutes.chat.toChat(chat.chat_id));
  }, []);

  return (
    <div className="flex items-center" onClick={onChatClick}>
      <UserAvatar size={60} user_id={receiver.id} />{" "}
      <div className="flex flex-col items-start">
        <span>{`${receiver.first_name} ${receiver.last_name}`}</span>{" "}
        {/*check if message sender current user display "you:" else sender name.*/}
        <span>{`${
          user?.id === lastMessage.sender_id ? "You" : receiver.first_name
        }: ${lastMessage.text}`}</span>
      </div>
    </div>
  );
};

export default ChatListItem;
