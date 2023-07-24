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

const ProfilePage = ({ params }: { params: { id: string } }) => {
  const userId = params.id;
  const [userInfo, setUserInfo] = useState<AppUser | null>(null);
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

  const onSendMessageClick = useCallback(()=>{
	//	router.push(chat/[id]);
  },[]);

  useEffect(() => {
    if (user && userId) {
      getUserByIdMutation.mutate(params.id);
    }
  }, [user, userId]);

  if (userInfo?.profile)
    return (
      <div className="flex justify-center">
        <div className="mt-10 p-5 desktop:w-2/3 phone:w-full tablet:w-3/4 border-[3px] bg-neutral-300 dark:bg-gray-600 bg-opacity-95 border-violet-300 rounded-lg text-black dark:text-white shadow-sm shadow-gray-400">
          <div className="flex flex-col items-center justify-center mb-5">
            <UserAvatar
              size={200}
              image={
                userInfo.profile?.avatar_path
                  ? {
                      src: userInfo.profile.avatar_path,
                      alt: userInfo.last_name,
                    }
                  : undefined
              }
            />
            <div className="text-2xl font-semibold flex gap-3">
              <span>{userInfo.first_name}</span>
              <span>{userInfo.last_name}</span>
            </div>
            <button
              //onClick={onEditClick}
              className="flex items-center gap-2 my-2 p-2 text-xl text-white rounded-lg border border-indigo-300 font-semibold tracking-widest py-1 bg-violet-400 dark:bg-violet-700 hover:bg-violet-900 dark:hover:bg-violet-950 active:bg-neutral-600 focus:outline-none focus:ring focus:ring-slate-300"
            >
              <FiSend size={25} /> Send message
            </button>
          </div>
          <div className="flex flex-col gap-4 border-t-2 border-violet-300 py-3">
            <span className="text-xl font-semibold tracking-wide mb-5">
              Personal information
            </span>
            <div>Email: {userInfo.email}</div>
            <div>Your gender: {userInfo.profile.gender}</div>
            <div>Partner gender: {userInfo.profile.partner_gender}</div>
            <div className="flex flex-col">
              <span>About you:</span>
              <div className="break-all border-2 p-3 border-violet-300 rounded-lg bg-neutral-200 dark:bg-neutral-600 bg-opacity-75">
                {userInfo.profile.about_self}
              </div>
            </div>
            <div>
              <span>About partner:</span>
              <div className="break-all border-2 p-3 border-violet-300 rounded-lg bg-neutral-200 dark:bg-neutral-600 bg-opacity-75">
                {userInfo.profile.about_self}
              </div>
            </div>
            <div className="flex justify-end items-center"></div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex justify-center mt-10 text-xl">
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
