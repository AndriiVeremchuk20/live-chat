import socketApi from "@/socket/actions";
import UserPost from "@/types/userPost.type";
import React, { useEffect, useState } from "react";
import Post from "./Post";

interface propPostList {
  posts: UserPost[];
}

const PostList: React.FC<propPostList> = ({ posts }) => {

  return (
    <div className="flex w-full justify-center ">
      <div className="flex flex-col items-center gap-3 bg-neutral-600 bg-opacity-50 py-3 phone:w-full tablet:w-full desktop:w-10/12">
        {posts.map((post) => (
          <Post post={post} key={post.id} />
        ))}
      </div>
    </div>
  );
};
export default PostList;
