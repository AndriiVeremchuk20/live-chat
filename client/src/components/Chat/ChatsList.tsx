"use client";

import useAppStore from "@/store";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import ChatApi from "@/api/chat";
import ChatListItem from "./ChatListItem";
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
      console.log(
        lastMessages.some((message) => message.chat_id === newMessage.chat_id),
      );
      console.log(lastMessages);
      if (
        lastMessages.some((message) => message.chat_id === newMessage.chat_id)
      ) {
        const updateLastMessagesList = lastMessages.map((message) => {
          if (message.chat_id === newMessage.chat_id) {
            return newMessage;
          }
          return message;
        });
        return setLastMessages(updateLastMessagesList);
      } else {
        return setLastMessages((prev) => [newMessage, ...prev]);
      }
    });
  }, [lastMessages]);

  if (lastMessages.length <= 0) {
    return (
      <div className=" w-full border-2 border-violet-500">Chats not found</div>
    );
  }

  // add search bar
  return (
    <div className="h-4/5 w-full border-2 border-violet-500">
      {lastMessages.map((message) => (
        <ChatListItem key={message.id} lastChatMessage={message} />
      ))}
    </div>
  );
};

export default ChatsList;
