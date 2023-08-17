import socketApi from "@/socket/actions";
import useAppStore from "@/store";
import AppUser from "@/types/user.type";
import React, { useEffect, useState } from "react";
import UserAvatar from "../UserAvatar";

interface PropChatHeader {
  receiver: AppUser;
  chat_id: string;
}

const ChatHeader: React.FC<PropChatHeader> = ({ receiver, chat_id }) => {
  const { user } = useAppStore();
  const [isTyping, setIsTyping] = useState<boolean>(false);

  useEffect(() => {
  console.log(chat_id)
    if (user) {
      // typing response status
      socketApi.onTypingResponse((data) => {
        if (data.sender_id !== user.id && data.chat_id === chat_id) {
          setIsTyping(data.isTyping);
        }
      });
    }
  }, [user]);

  return (
    <div className="flex justify-end bg-violet-400 p-2 dark:bg-violet-700">
      <div className="flex items-center gap-3">
        {isTyping ? (
          <div className="flex text-xl">
            Typing{" "}
            <div className="flex">
              <div className="animate-bounce">.</div>{" "}
              <div className="animate-bounce-slow">.</div>{" "}
              <div className="animate-bounce">.</div>
            </div>
          </div>
        ) : null}
        <span className="font-semibold">
          {receiver.first_name + " " + receiver.last_name}
        </span>
        <UserAvatar
          size={50}
          image={
            receiver.profile?.avatar_path
              ? {
                  src: receiver.profile.avatar_path,
                  alt: receiver.first_name,
                }
              : undefined
          }
        />
      </div>
    </div>
  );
};

export default ChatHeader;
