import AppUser from "@/types/user.type";
import React from "react";

interface propLikeListItem {
  user: AppUser;
}

const LikeListItem: React.FC<propLikeListItem> = ({ user }) => {
  return (
    <div className="bg-red-400">
      <div>{user.last_name}</div>
      <div></div>
    </div>
  );
};

export default LikeListItem;
