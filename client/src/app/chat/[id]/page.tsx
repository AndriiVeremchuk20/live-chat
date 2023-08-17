"use client";

import withAuth from "@/hooks/withAuth";
import AppUser from "@/types/user.type";
import { useCallback, useEffect, useRef, useState } from "react";
import { BiSolidSend } from "react-icons/bi";
import { FiPaperclip } from "react-icons/fi";
import { BsEmojiSmileUpsideDown } from "react-icons/bs";
import useAppStore from "@/store";
import { SubmitHandler, useForm } from "react-hook-form";
import socket from "@/socket";
import Message from "@/types/message.type";
import routes from "@/config/appRoutes";
import { useRouter } from "next/navigation";
import socketApi from "@/socket/actions";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import ChatsList from "@/components/Chat/ChatsList";
import { useMutation } from "react-query";
import ChatApi from "@/api/chat";
import ChatHeader from "@/components/Chat/ChatHeader";
import MessagesList from "@/components/Chat/MessagesList";
import SendMessageForm from "@/components/Chat/SendMessageForm";

interface FormFields {
  message: string;
}

const Chat = ({ params }: { params: { id: string } }) => {
  const chat_id = params.id;

  const { user } = useAppStore();
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const { currTheme } = useAppStore();
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [receiver, setReceiver] = useState<AppUser | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const { register, setValue, getValues, handleSubmit } = useForm<FormFields>();

  //const messgesBlock = useRef<HTMLDivElement | null>(null);

  const router = useRouter();

  const getChatMetadataMutation = useMutation(ChatApi.getChatMetadata, {
    onSuccess: (data) => {
      //console.log(data);
      setReceiver(data.data.receiver);
      setMessages(data.data.messages);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onShowEmojiClick = useCallback(() => {
    setShowEmoji((state) => !state);
  }, []);

  const onEmojiClick = useCallback((emoji: any) => {
    console.log(emoji);
    const text = getValues("message");
    setValue("message", text + emoji.native);
  }, []);

  const onClickOutsideEmojiPicker = useCallback(() => {
    setShowEmoji(false);
  }, []);

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    console.log(data);
    if (!user?.id || !receiver?.id || !getValues("message")) {
      return;
    }

    const userMessage = {
      chat_id: chat_id,
      sender_id: user.id,
      receiver_id: receiver.id,
      text: data.message,
    };

    // send message
    socketApi.onSendMessage(userMessage);
    setValue("message", ""); //clear input message form

    // end typing
    socketApi.onTyping({
      chat_id: chat_id,
      sender_id: user.id,
      isTyping: false,
    });
  };

  const onMessageTyping = () => {
    if (!user) return;
    socketApi.onTyping({
      chat_id: chat_id,
      sender_id: user.id,
      isTyping: !!getValues("message"),
    });
  };

  useEffect(() => {
    if (user) {
      getChatMetadataMutation.mutate({ chat_id: chat_id });

      // receive message
      socketApi.onReseiveMessage((message) => {
        if (message.chat_id === chat_id) {
          setMessages((prev) => [...prev, message]);
        }
      });

      // typing response status
      //socketApi.onTypingResponse((data) => {
      //  if (data.sender_id !== user.id && data.chat_id === chat_id) {
      //    setIsTyping(data.isTyping);
      //  }
     // });

      socket.on("socket_error", (data) => {
        router.replace(routes.home);
      });
    }
  }, []);

  // scroll chat to bottom
  //useEffect(() => {
  //  messgesBlock.current?.scrollIntoView({ behavior: "smooth" });
 // }, [messages.length]);

  if (!receiver) {
    return <div>user not found</div>;
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col justify-between border-violet-600 bg-neutral-300 bg-opacity-80 dark:bg-gray-800 phone:h-full phone:w-full tablet:w-full desktop:m-1 desktop:my-5 desktop:h-[90%] desktop:w-2/3 desktop:rounded-lg desktop:border-2">
        <ChatsList />
        <ChatHeader receiver={receiver} chat_id={chat_id} />
        <MessagesList messages={messages}/>
		<SendMessageForm receiver={receiver} chat_id={chat_id}/>    
	         </div>
    </div>
  );
};

export default withAuth(Chat);
