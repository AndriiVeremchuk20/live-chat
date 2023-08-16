"use client";

import UserAvatar from "@/components/UserAvatar";
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
import { ChatMessage } from "@/components/ChatMessage";
import socketApi from "@/socket/actions";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import ChatsList from "@/components/ChatsList";
import { useMutation } from "react-query";
import ChatApi from "@/api/chat";

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

  const messgesBlock = useRef<HTMLDivElement | null>(null);

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
      socketApi.onTypingResponse((data) => {
		if (data.sender_id !== user.id && data.chat_id === chat_id) {
          setIsTyping(data.isTyping);
        }
      });

      socket.on("socket_error", (data) => {
        router.replace(routes.home);
      });
    }
  }, []);

  // scroll chat to bottom
  useEffect(() => {
    messgesBlock.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (!receiver) {
    return <div>user not found</div>;
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col justify-between border-violet-600 bg-neutral-300 bg-opacity-80 dark:bg-gray-800 phone:h-full phone:w-full tablet:w-full desktop:m-1 desktop:my-5 desktop:h-[90%] desktop:w-2/3 desktop:rounded-lg desktop:border-2">
        <ChatsList />

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
        {/*show chat messages*/}
        <div className="my-3 flex h-full flex-col gap-3 overflow-auto">
          {messages.map((message) => (
            <ChatMessage message={message} key={message.id} />
          ))}
          <div ref={messgesBlock} />
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col"
        >
          {showEmoji ? (
            <div className="absolute bottom-[5%] z-10 phone:right-3 desktop:right-[20%]">
              <Picker
                data={data}
                onEmojiSelect={onEmojiClick}
                onClickOutside={onClickOutsideEmojiPicker}
                theme={currTheme}
              />
            </div>
          ) : null}
          <div className="mt-2 flex bg-opacity-20 text-black dark:text-white">
            <textarea
              onKeyUp={onMessageTyping}
              className="m-1 w-full resize-none rounded-lg bg-opacity-75 px-2 py-1 outline-none dark:bg-neutral-800"
              {...register("message", { minLength: 1, maxLength: 252 })}
              placeholder="Send message"
            ></textarea>
            <button onClick={onShowEmojiClick} type="button" className="p-2">
              <BsEmojiSmileUpsideDown size={25} />
            </button>
            <button className="p-2" type="button">
              <FiPaperclip size={25} />
            </button>
            <button type="submit" className="p-2">
              <BiSolidSend size={25} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withAuth(Chat);
