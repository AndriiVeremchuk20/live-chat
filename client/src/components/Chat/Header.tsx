import socketApi from "@/socket/actions";
import useAppStore from "@/store";
import AppUser from "@/types/user.type";
import React, { useCallback, useEffect, useState } from "react";
import UserAvatar from "../UserAvatar";
import { MdOutlineArrowBack } from "react-icons/md";
import { useRouter } from "next/navigation";
import AppRoutes from "@/config/appRoutes";

interface PropChatHeader {
  receiver: AppUser;
  chat_id: string;
}

const ChatHeader: React.FC<PropChatHeader> = ({ receiver, chat_id }) => {
  const { user } = useAppStore();
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const router = useRouter();

  const onBackClick = useCallback(() => {
    router.push(AppRoutes.chat.base);
  }, []);

  useEffect(() => {
    //console.log(chat_id);
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
    <div className="flex flex-row-reverse items-center justify-between bg-indigo-400 p-2 dark:bg-indigo-700">
      <div
        className="mr-5 rounded-full bg-neutral-200 bg-opacity-10 p-1 hover:bg-opacity-20"
        onClick={onBackClick}
      >
        <MdOutlineArrowBack size={30} />
      </div>
      <div className="flex items-center gap-3">
        <UserAvatar
          size={50}
          user_id={receiver.id}
          image={
            receiver.profile?.avatar_path
              ? {
                  src: receiver.profile.avatar_path,
                  alt: receiver.first_name,
                }
              : undefined
          }
        />
        <span className="font-semibold">
          {receiver.first_name + " " + receiver.last_name}
        </span>

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
      </div>
    </div>
  );
};

export default ChatHeader;
