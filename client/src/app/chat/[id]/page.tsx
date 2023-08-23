"use client";

import withAuth from "@/hooks/withAuth";
import AppUser from "@/types/user.type";
import { useEffect, useState } from "react";
import useAppStore from "@/store";
import Message from "@/types/message.type";
import socketApi from "@/socket/actions";
import { useMutation } from "react-query";
import ChatApi from "@/api/chat";
import ChatHeader from "@/components/Chat/Header";
import MessageList from "@/components/Chat/MessageList";
import SendMessageForm from "@/components/Chat/SendMessageForm";
import ChatList from "@/components/Chat/ChatList";

const Chat = ({ params }: { params: { id: string } }) => {
  const chat_id = params.id;

  const { user } = useAppStore();
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [receiver, setReceiver] = useState<AppUser | null>(null);

  const getChatMetadataMutation = useMutation(ChatApi.getChatMetadata, {
    onSuccess: (data) => {
      setReceiver(data.data.receiver);
      setMessages(data.data.messages);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    if (user) {
      getChatMetadataMutation.mutate({ chat_id: chat_id });
      
	  socketApi.onReseiveMessage((message) => {
        if (message.chat_id === chat_id) {
          console.log("Receive message");
		  setMessages((prev) => [...prev, message]);
        }
      });

      socketApi.onDeleteMessageResponse(({ message_id }) => {
        console.log("Delete message");
		setMessages((prev) =>
          prev.filter((message) => message.id !== message_id),
        );
      });

    }
  }, []);

  if (!receiver) {
    return <div>user not found</div>;
  }

  return (
    <div className="h-screen backdrop-blur">
      <div className="flex h-full w-full">
        <div className="h-full w-1/3 phone:hidden tablet:hidden desktop:block">
          <ChatList />
        </div>
        <div className="flex h-full w-full flex-col">
          <ChatHeader receiver={receiver} chat_id={chat_id} />
          <MessageList messages={messages} />
          <SendMessageForm receiver={receiver} chat_id={chat_id} />
        </div>
      </div>
    </div>
  );
};

export default withAuth(Chat);
