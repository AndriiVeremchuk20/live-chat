import AppUser from "@/types/user.type";
import React from "react";
import UserAvatar from "../UserAvatar";

interface propUserListItem {
  user: AppUser;
}

const UserListItem: React.FC<propUserListItem> = ({ user }) => {
  return (
    <div className="flex w-[400px] items-center justify-between bg-neutral-200 p-2 dark:bg-neutral-600">
      <div className="flex items-center gap-2">
        <UserAvatar
          size={50}
          image={
            user.avatar_path
              ? { src: user.avatar_path, alt: user.first_name }
              : undefined
          }
        />
        <div className="font-semibold">{`${user.first_name} ${user.last_name}`}</div>
      </div>
      <button>Subscribe</button>
    </div>
  );
};

export default UserListItem;
