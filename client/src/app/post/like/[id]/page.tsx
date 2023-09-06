"use client";

import likesApi from "@/api/userActions/postLikes";
import LikeList from "@/components/Posts/LikeList/LikeList";
import useAppStore from "@/store";
import AppUser from "@/types/user.type";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";

const PostLikesPage = ({ params }: { params: { id: string } }) => {
  const post_id = params.id;
  const { user } = useAppStore();

  const [likedUsers, setLikedUsers] = useState<AppUser[]>([]);

  const getLikedUsersMutation = useMutation(likesApi.getPostLikes, {
    onSuccess(data) {
      console.log(data);
      setLikedUsers(data.data);
    },
    onError(error) {
      console.log(error);
    },
  });

  useEffect(() => {
    if (user) {
      getLikedUsersMutation.mutate({ post_id });
    }
  }, [user]);

  return (
    <div>
      <LikeList users={likedUsers}/>
    </div>
  );
};

export default PostLikesPage;
