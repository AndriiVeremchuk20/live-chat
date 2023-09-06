"use client";

import postsApi from "@/api/userActions/post";
import ChatList from "@/components/Chat/ChatList";
import PostList from "@/components/Posts/PostList";
import useAppStore from "@/store";
import UserPost from "@/types/userPost.type";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";

const Home = () => {
  const { user } = useAppStore();
  const [posts, setPosts] = useState<Array<UserPost>>([]);

  const getPostsMutation = useMutation(postsApi.getPosts, {
    onSuccess: (data) => {
      console.log(data);
      setPosts(data.data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    if (user) {
      getPostsMutation.mutate();
    }
  }, [user]);

  if (!user) {
    return <div>You are guest</div>;
  }

  return (
    <div className="flex">
      <div className="phone:hidden tablet:hidden desktop:block w-4/12 h-screen sticky top-0">
        <ChatList />
      </div>
      <div className="my-5 default:w-8/12 phone:w-full tablet:w-full">
        <PostList posts={posts} />
      </div>
    </div>
  );
};

export default Home;
