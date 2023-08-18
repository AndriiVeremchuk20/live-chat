"use client"

import useAppStore from "@/store";
import Chat from "@/types/chat.type";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import ChatApi from "@/api/chat";
import ChatListItem from "./ChatListItem";

const ChatsList = () => {
  const { user } = useAppStore();
  const [chats, setChats] = useState<Array<Chat>>([]);

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

  if(chats.length <= 0){
	return <div className="w-full border-2 border-violet-500">
		Chats not found
	</div>
  }

// add search bar
  return (
	<div className="w-full border-2 border-violet-500">
		{chats.map(chat=><ChatListItem key={chat.chat_id} chat={chat}/>)}
	</div>);
};

export default ChatsList;