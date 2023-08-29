import AppUser from "@/types/user.type";
import React, { ChangeEvent, useCallback, useRef, useState } from "react";
import { BiSolidSend } from "react-icons/bi";
import { FiPaperclip } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { BsEmojiSmileUpsideDown } from "react-icons/bs";
import useAppStore from "@/store";
import { SubmitHandler, useForm } from "react-hook-form";
import socketApi from "@/socket/actions";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import Image from "next/image";
import ChatImage from "./Image";
import { toast } from "react-toastify";

interface PropSendMessageForm {
  chat_id: string;
  receiver: AppUser;
}

interface FormFields {
  message: string | null;
  image: File | null;
}

const SendMessageForm: React.FC<PropSendMessageForm> = ({
  chat_id,
  receiver,
}) => {
  const { user, replyMessage, removeReplyMessage } = useAppStore();
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const { currTheme } = useAppStore();
  const { reset, register, setValue, getValues, handleSubmit } =
    useForm<FormFields>();

  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setFilePreview] = useState<string | null>(null);

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
    if (!user?.id || !receiver?.id) {
      return;
    }

    if (!getValues("message") && !getValues("image")) {
      return toast.warning("Message is Empty!", {
        theme: currTheme === "LIGHT" ? "light" : "dark",
      });
    }

    const userMessage = {
      chat_id: chat_id,
      sender_id: user.id,
      receiver_id: receiver.id,
      text: data.message,
      image: data.image,
      reply_to_message_id: replyMessage?.id ?? null,
    };

    // send message
    socketApi.onSendMessage(userMessage);
    // reset form data.
    reset();
    // setValue("message", ""); //clear input message form
    // setValue("")

    //clear preview file
    setFilePreview(null);

    //remove reply_to message
    removeReplyMessage();

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

  const onCloseReplyMessage = useCallback(() => {
    removeReplyMessage();
  }, []);

  const onChooseFileClick = useCallback(() => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  }, []);

  const onFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setValue("image", file);
      const previewImageURL = URL.createObjectURL(file);
      setFilePreview(previewImageURL);
    }
  }, []);

  const onRemoveFileClick = useCallback(() => {
    setValue("image", null);
    setFilePreview(null);
  }, []);

  return (
    <div>
      {/* user can send only images (.jpg .png .gif)*/}
      <input
        type="file"
        hidden
        accept="image/*"
        ref={inputFileRef}
        onClick={onChooseFileClick}
        onChange={onFileChange}
      />
      {replyMessage ? (
        <div className="mx-5 flex items-center justify-between text-black dark:text-white ">
          <div className="flex flex-col items-start">
            {
              // if message has image
              replyMessage.image_url ? (
                <ChatImage
                  width={400}
                  height={400}
                  src={replyMessage.image_url}
                />
              ) : null
            }
            <div>
              <div className="text-lg font-semibold">
                {replyMessage.sender?.first_name}
              </div>
              <div className="">{replyMessage.text}</div>
            </div>
          </div>

          <div
            className="cursor-pointer rounded-full bg-neutral-300 bg-opacity-30 p-1 hover:bg-opacity-90"
            onClick={onCloseReplyMessage}
          >
            <MdClose size={25} />
          </div>
        </div>
      ) : null}
      {imagePreview ? (
        <div>
          <div className="flex items-center justify-between bg-neutral-500 bg-opacity-40 p-3">
            <div className="flex items-end gap-3">
              <Image width={400} height={400} src={imagePreview} alt="image" />
              <span>{getValues("image")?.name}</span>
            </div>
            <div
              onClick={onRemoveFileClick}
              className="mx-5 cursor-pointer rounded-full bg-neutral-400 bg-opacity-25"
            >
              <MdClose size={30} />
            </div>
          </div>
        </div>
      ) : null}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col drop-shadow-2xl"
      >
        {showEmoji ? (
          <div className="absolute bottom-[10%] right-5 z-10">
            <Picker
              data={data}
              onEmojiSelect={onEmojiClick}
              onClickOutside={onClickOutsideEmojiPicker}
              theme={currTheme}
            />
          </div>
        ) : null}
        <div className="mt-2 flex text-xl text-black dark:text-white">
          <textarea
            onKeyUp={onMessageTyping}
            className="m-1 w-full resize-none rounded-lg bg-opacity-75 px-2 py-1 outline-none dark:bg-neutral-800"
            {...register("message", { minLength: 1, maxLength: 252 })}
            placeholder="Send message"
          ></textarea>
          <button onClick={onShowEmojiClick} type="button" className="p-2">
            <BsEmojiSmileUpsideDown size={30} />
          </button>
          <button onClick={onChooseFileClick} className="p-2" type="button">
            <FiPaperclip size={30} />
          </button>
          <button type="submit" className="p-2">
            <BiSolidSend size={30} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendMessageForm;
