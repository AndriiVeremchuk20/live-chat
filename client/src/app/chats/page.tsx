"use client";

import { useMutation } from "react-query";
import ChatApi from "@/api/chat";
import { useEffect, useState } from "react";
import useAppStore from "@/store";
import withAuth from "@/hooks/withAuth";
import { useStore } from "zustand";
import Chat from "@/types/chat.type";
import UserAvatar from "@/components/UserAvatar";

const ChatsPage = () => {
  const { user } = useAppStore();
  const [chats, setChats] = useState<Array<Omit<Chat, "users">>>([]);

  const getChatsMutation = useMutation(ChatApi.getUserChats, {
    onSuccess: (data) => {
      setChats(data.data);
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    if (user) {
      getChatsMutation.mutate();
    }
  }, [user]);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="flex flex-col border-violet-600 bg-neutral-300 bg-opacity-80 dark:bg-gray-800 phone:h-full phone:w-full tablet:w-full desktop:m-1 desktop:my-5 desktop:h-[90%] desktop:w-2/3 desktop:rounded-lg desktop:border-2">
        <div className="flex justify-end bg-violet-400 dark:bg-violet-700">
          <span className="m-3 text-xl font-bold text-white">Chats</span>
        </div>
        <div>
          {chats.length > 0? (
            <div className="flex flex-col items-center">
               {
				chats.map((chat)=><div key={chat.chat_id} className="flex">
					<UserAvatar size={40} user_id={chat.messages[0].sender_id} />
					<div>{chat.messages[0].text.slice(0,20)}</div>
				</div>)
			  }

			</div>
          ) : (
            <div className="mt-10 flex justify-center text-3xl dark:text-white">
              Chats not found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withAuth(ChatsPage);
