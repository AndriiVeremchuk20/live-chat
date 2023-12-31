"use client";

import UserAvatar from "@/components/UserAvatar";
import routes from "@/config/appRoutes";
import withAuth from "@/hooks/withAuth";
import useAppStore from "@/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { BiEditAlt } from "react-icons/bi";

const ProfilePage = () => {
  const { user } = useAppStore();
  const router = useRouter();

  const onEditClick = useCallback(() => {
    router.push(routes.profile.completeProfile);
  }, []);

  if (user?.profile)
    return (
      <div className="flex justify-center">
        <div className="mt-10 rounded-lg border-[3px] border-violet-300 bg-neutral-300 bg-opacity-95 p-5 text-black shadow-sm shadow-gray-400 dark:bg-gray-600 dark:text-white phone:w-full tablet:w-3/4 desktop:w-2/3">
          <div className="mb-5 flex flex-col items-center justify-center">
            <UserAvatar
              size={200}
              image={
                user?.avatar_path
                  ? { src: user.avatar_path, alt: user.last_name }
                  : undefined
              }
            />
            <div className="flex gap-3 text-2xl font-semibold">
              <span>{user.first_name}</span>
              <span>{user.last_name}</span>
            </div>
          </div>
          <div className="flex flex-col gap-4 border-t-2 border-violet-300 py-3">
            <span className="mb-5 text-xl font-semibold tracking-wide">
              Personal information
            </span>
            <div>Email: {user.email}</div>
            <div>Your gender: {user.profile.gender}</div>
            <div className="flex flex-col">
              <span>About you:</span>
              <div className="break-all rounded-lg border-2 border-violet-300 bg-neutral-200 bg-opacity-75 p-3 dark:bg-neutral-600">
                {user.profile.about_self}
              </div>
            </div>
            <div className="flex items-center justify-end">
              <button
                onClick={onEditClick}
                className="my-2 flex items-center gap-2 rounded-lg border border-indigo-300 bg-violet-400 p-2 py-1 text-xl font-semibold tracking-widest text-white hover:bg-violet-900 focus:outline-none focus:ring focus:ring-slate-300 active:bg-neutral-600 dark:bg-violet-700 dark:hover:bg-violet-950"
              >
                <BiEditAlt size={25} /> Edit profile
              </button>
            </div>
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
