import AppUser from "@/types/user.type";
import React from "react";
import UserListItem from "./UserListItem";


interface propLikeList {
  users: AppUser[];
}

const UserList: React.FC<propLikeList> = ({ users }) => {
  return (
    <div className="flex justify-center my-5">
      <div className="bg-neutral-600 bg-opacity-50 h-screen">
        {users.map((user, index) => (
          <UserListItem user={user} key={index} />
        ))}
      </div>
    </div>
  );
};

export default UserList;
