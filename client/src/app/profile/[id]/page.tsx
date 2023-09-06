"use client";

import userActions from "@/api/userActions";
import UserAvatar from "@/components/UserAvatar";
import routes from "@/config/appRoutes";
import withAuth from "@/hooks/withAuth";
import useAppStore from "@/store";
import AppUser from "@/types/user.type";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FiSend } from "react-icons/fi";
import { useMutation } from "react-query";
import ChatApi from "@/api/chat";
import socketApi from "@/socket/actions";

const ProfilePage = ({ params }: { params: { id: string } }) => {
  const userId = params.id;
  const [userInfo, setUserInfo] = useState<AppUser | null>(null);
  const [chatId, setChatId] = useState<string>("");
  const { user } = useAppStore();
  const router = useRouter();

  const getUserByIdMutation = useMutation(userActions.getProfileById, {
    onSuccess(data) {
      console.log(data);
      setUserInfo(data.data);
    },
    onError(error) {
      console.log(error);
    },
  });

  const getChatMutation = useMutation(ChatApi.getChat, {
    onSuccess(data) {
      if (!user?.chats.includes(data.data.chat_id) && userInfo && user) {
        socketApi.onNewChat({
          chat_id: data.data.chat_id,
          receiver_id: userInfo.id,
        });
      }
      //setChatId(data.data.chat_id);
      console.log(data);
      router.push(routes.chat.toChat(data.data.chat_id));
    },
    onError(error) {
      console.log(error);
    },
  });

  const onSendMessageClick = useCallback(() => {
    console.log(userId);
    getChatMutation.mutate({ receiverId: userId });
  }, []);

  useEffect(() => {
    if (user && userId) {
      getUserByIdMutation.mutate(params.id);
    }
  }, [user, userId]);

  if (userInfo?.profile)
    return (
      <div className="flex justify-center">
        <div className="mt-10 rounded-lg border-[3px] border-violet-300 bg-neutral-300 bg-opacity-95 p-5 text-black shadow-sm shadow-gray-400 dark:bg-gray-600 dark:text-white phone:w-full tablet:w-3/4 desktop:w-2/3">
          <div className="mb-5 flex flex-col items-center justify-center">
            <UserAvatar
              size={200}
              user_id={params.id}
              image={
                userInfo?.avatar_path
                  ? {
                      src: userInfo.avatar_path,
                      alt: userInfo.last_name,
                    }
                  : undefined
              }
            />
            <div className="flex gap-3 text-2xl font-semibold">
              <span>{userInfo.first_name}</span>
              <span>{userInfo.last_name}</span>
            </div>
            <button
              onClick={onSendMessageClick}
              className="my-2 flex items-center gap-2 rounded-lg border border-indigo-300 bg-violet-400 p-2 py-1 text-xl font-semibold tracking-widest text-white hover:bg-violet-900 focus:outline-none focus:ring focus:ring-slate-300 active:bg-neutral-600 dark:bg-violet-700 dark:hover:bg-violet-950"
            >
              <FiSend size={25} /> Send message
            </button>
          </div>
          <div className="flex flex-col gap-4 border-t-2 border-violet-300 py-3">
            <span className="mb-5 text-xl font-semibold tracking-wide">
              Personal information
            </span>
            <div>Email: {userInfo.email}</div>
            <div>Gender: {userInfo.profile.gender}</div>
            <div className="flex flex-col">
              <span>About you:</span>
              <div className="break-all rounded-lg border-2 border-violet-300 bg-neutral-200 bg-opacity-75 p-3 dark:bg-neutral-600">
                {userInfo.profile.about_self}
              </div>
            </div>
            <div className="flex items-center justify-end"></div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="mt-10 flex justify-center text-xl">
      Please Create your profile{" "}
      <Link
        href={routes.profile.completeProfile}
        className="text-blue-600 underline hover:text-blue-300"
      >
        Here.
      </Link>
    </div>
  );
};

export default withAuth(ProfilePage);
