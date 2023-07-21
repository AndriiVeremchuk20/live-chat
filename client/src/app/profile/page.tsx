"use client";

import UserAvatar from "@/components/UserAvatar";
import withAuth from "@/hooks/withAuth";
import useAppStore from "@/store";

const ProfilePage = () => {
  const { user } = useAppStore();

  if (user?.profile)
    return (
      <div className="flex justify-center">
        <div className="mt-10 p-5 desktop:w-2/3 phone:w-full tablet:w-3/4 border-[3px] bg-neutral-300 dark:bg-gray-600 bg-opacity-95 border-violet-300 rounded-lg text-black dark:text-white">
          <div className="flex flex-col items-center justify-center mb-5">
            <UserAvatar
              size={200}
              image={
                user.profile?.avatar_path
                  ? { src: user.profile.avatar_path, alt: user.last_name }
                  : undefined
              }
            />
            <div className="text-2xl font-semibold flex gap-3">
              <span>{user.first_name}</span>
              <span>{user.last_name}</span>
            </div>
          </div>
          <div className="border-t-2 border-violet-300 py-3">
            <span className="text-xl">Personal information</span>
            <div>Email: {user.email}</div>
            <div>Your gender: {user.profile.gender}</div>
            <div>Partner gender: {user.profile.partner_gender}</div>
            <div>
              <span>About you:</span>
              <span>{user.profile.about_self}</span>
            </div>
            <div>
              <span>About partner:</span>
              <span>{user.profile.about_self}</span>
            </div>
          </div>
        </div>
      </div>
    );

  return <div>Please Create your profile</div>;
};

export default withAuth(ProfilePage);
