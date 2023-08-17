import AppUser from "@/types/user.type";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { useMutation } from "react-query";
import ChatApi from "@/api/chat";

interface PropSendMessageForm {
  chat_id: string;
  receiver: AppUser;
}

interface FormFields {
  message: string;
}

const SendMessageForm: React.FC<PropSendMessageForm> = ({ chat_id, receiver }) => {
  const { user } = useAppStore();
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const { currTheme } = useAppStore();
  const { register, setValue, getValues, handleSubmit } = useForm<FormFields>();

  const router = useRouter();

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col">
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
  );
};

export default SendMessageForm;
