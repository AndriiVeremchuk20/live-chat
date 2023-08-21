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
import MessagesList from "@/components/Chat/MessagesList";
import SendMessageForm from "@/components/Chat/SendMessageForm";

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

      // receive message
      socketApi.onReseiveMessage((message) => {
        if (message.chat_id === chat_id) {
          setMessages((prev) => [...prev, message]);
        }
      });
    }
  }, []);

  if (!receiver) {
    return <div>user not found</div>;
  }

  return (
    <div className="h-screen backdrop-blur">
      <div className="flex h-full w-full">
        <div className="flex h-full w-full flex-col">
          <ChatHeader receiver={receiver} chat_id={chat_id} />
          <MessagesList messages={messages} />
          <SendMessageForm receiver={receiver} chat_id={chat_id} />
        </div>
      </div>
    </div>
  );
};

export default withAuth(Chat);
