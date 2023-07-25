"use client";

import userActions from "@/api/userActions";
import UserAvatar from "@/components/UserAvatar";
import withAuth from "@/hooks/withAuth";
import AppUser from "@/types/user.type";
import { useCallback, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { BiSolidSend } from "react-icons/bi";
import { FiPaperclip } from "react-icons/fi";
import { BsEmojiSmileUpsideDown } from "react-icons/bs";
import useAppStore from "@/store";
import { SubmitHandler, useForm } from "react-hook-form";
import * as io from "socket.io-client";

const socket = io.connect("http://localhost:5000/");

interface FormFields {
  message: string;
}

const Chat = ({ params }: { params: { id: string } }) => {
  const [receiver, setReceiver] = useState<null | AppUser>(null);
  //const [showEmoji, setShowEmoji] = useState<boolean>(false);
  //const { currTheme } = useAppStore();



  const { register, setValue, getValues, handleSubmit } = useForm<FormFields>();

  const getUserByIdMutation = useMutation(userActions.getProfileById, {
    onSuccess(data) {
      setReceiver(data.data);
      console.log(data);
    },
    onError(error) {
      console.log(error);
    },
  });

  //  const onShowEmojiClick = useCallback(() => {
  //    setShowEmoji((state) => !state);
  //  }, []);

  //const onEmojiClick = useCallback((emoji: EmojiClickData) => {
  //  const text = getValues("message");
  //  setValue("message", text + emoji.emoji);
  //}, []);

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    console.log(data);
  };

  useEffect(() => {
    getUserByIdMutation.mutate(params.id);
  }, []);

   useEffect(() => {
    let socket = io.connect("http://localhost:5000");
	console.log(socket)
  }, []);

  if (!receiver) {
    return <div>user not found</div>;
  }

  return (
    <div className="flex items-center justify-center">
      <div className="m-1 my-5 flex h-96 flex-col justify-between rounded-lg border-2 border-violet-600 bg-neutral-300 bg-opacity-80 dark:bg-gray-800 phone:w-full tablet:w-full desktop:w-2/3">
        <div className="flex justify-end bg-violet-400 p-2 dark:bg-violet-700">
          <div className="flex items-center gap-3">
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col"
        >
          <div className="flex text-black dark:text-white">
            <textarea
              className="m-1 w-full resize-none rounded-lg bg-opacity-75 px-2 py-1 outline-none dark:bg-neutral-800"
              {...register("message")}
              placeholder="Send message"
            ></textarea>
            <button type="button" className="p-2">
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
