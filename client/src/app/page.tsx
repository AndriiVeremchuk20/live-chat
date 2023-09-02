"use client";

import userActions from "@/api/userActions";
import postsApi from "@/api/userActions/post";
import ChatList from "@/components/Chat/ChatList";
import routes from "@/config/appRoutes";
import useAppStore from "@/store";
import Post from "@/types/post.type";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";

const Home = () => {
  const { user } = useAppStore();
  const [posts, setPosts] = useState<Array<Post>>([]);

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

  return (
    <div className="">
      <div>Text</div>
      <div>
        {posts.map((post, index) => <div key={index}>{post.description}</div>)} 
      </div>
    </div>
  );
};

export default Home;
