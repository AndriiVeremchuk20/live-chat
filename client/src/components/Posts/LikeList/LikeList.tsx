import AppUser from "@/types/user.type";
import React from "react";
import LikeListItem from "./LikeListItem";

interface propLikeList {
  users: AppUser[];
}

const LikeList: React.FC<propLikeList> = ({ users }) => {
  return (
    <div className="flex justify-center my-5">
      <div className="bg-neutral-600 bg-opacity-50 h-screen">
        {users.map((user, index) => (
          <LikeListItem user={user} key={index} />
        ))}
      </div>
    </div>
  );
};

export default LikeList;
