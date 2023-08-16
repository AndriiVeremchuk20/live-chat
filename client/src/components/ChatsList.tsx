"use client"

import useAppStore from "@/store";
import Chat from "@/types/chat.type";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import ChatApi from "../api/chat";


const ChatItem = () =>{
	return (<div>Chat</div>)
}

const ChatsList = () => {
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

  if(chats.length <= 0){
	return <div>
		Chats not found
	</div>
  }

  return (<div>
	<div>
		{chats.map(chat=><div key={chat.chat_id}>{chat.chat_id}</div>)}
	</div>
  </div>);
};

export default ChatsList;
