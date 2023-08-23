"use client";

import useAppStore from "@/store";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import ChatApi from "@/api/chat";
import ChatListItem from "./ChatsListItem";
import socketApi from "@/socket/actions";
import Message from "@/types/message.type";

const ChatsList = () => {
  const { user } = useAppStore();
  const [lastMessages, setLastMessages] = useState<Array<Message>>([]);

  const getChatsMutation = useMutation(ChatApi.getUserChats, {
    onSuccess: (data) => {
      setLastMessages(data.data);
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

  useEffect(() => {
    socketApi.onReseiveMessage((newMessage) => {
      console.info("new msg");
      console.info(newMessage);
      setLastMessages((prevLastMessages) => {
        const updatedMessages = prevLastMessages.map((message) =>
          message.chat_id === newMessage.chat_id ? newMessage : message,
        );

        if (
          !updatedMessages.some(
            (message) => message.chat_id === newMessage.chat_id,
          )
        ) {
          updatedMessages.unshift(newMessage);
        }

        return updatedMessages;
      });
    });
  }, [lastMessages]);

  if (lastMessages.length <= 0) {
    return (
      <div className=" w-full border-2 border-violet-500">Chats not found</div>
    );
  }

  // add search bar
  return (
    <div className="h-full bg-indigo-950 bg-opacity-50 w-full border-2 border-violet-500">
      {lastMessages.map((message) => (
        <ChatListItem key={message.id} lastChatMessage={message} />
      ))}
    </div>
  );
};

export default ChatsList;
