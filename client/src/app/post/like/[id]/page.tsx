"use client";

import likesApi from "@/api/userActions/postLikes";
import UserList from "@/components/UserList/UserList";
import useAppStore from "@/store";
import AppUser from "@/types/user.type";
import { useCallback, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { IoMdArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";

const PostLikesPage = ({ params }: { params: { id: string } }) => {
  const post_id = params.id;
  const { user } = useAppStore();
  const router = useRouter();

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

  const onBackClick = useCallback(() => {
    router.back();
  }, []);

  useEffect(() => {
    if (user) {
      getLikedUsersMutation.mutate({ post_id });
    }
  }, [user]);

  return (
    <div>
      <div className=" flex h-[100px] w-full items-center bg-violet-700">
        <button className="mx-5 rounded-full bg-neutral-400 bg-opacity-50 p-1 hover:bg-opacity-30" onClick={onBackClick}>
          <IoMdArrowBack size={30} />
        </button>
      </div>
      <div>
        <UserList users={likedUsers} />
      </div>
    </div>
  );
};

export default PostLikesPage;
