import UserPost from "@/types/userPost.type";
import getContentDate from "@/utils/getContentDate";
import Image from "next/image";
import UserAvatar from "../UserAvatar";
import { HiHeart, HiOutlineHeart, HiChat } from "react-icons/hi";
import { useCallback, useEffect, useState } from "react";
import socketApi from "@/socket/actions";
import useAppStore from "@/store";
import { useMutation } from "react-query";
import likesApi from "@/api/userActions/postLikes";

interface propPost {
  post: UserPost;
}

const Post: React.FC<propPost> = ({ post }) => {
  const { user } = useAppStore();
  const [likes, setLikes] = useState<{ isLiked: boolean; numLikes: number }>({
    isLiked: post.isLiked,
    numLikes: post.likes,
  });

  const getUsersWhoLikedPostMutation = useMutation(likesApi.getPostLikes, {
    onSuccess(data) {
      console.log(data);
    },
    onError(error) {
      console.log(error);
    },
  });

  const onLikeclick = useCallback(() => {
    if (!user) return;
    setLikes((prev) =>
      prev.isLiked
        ? { isLiked: false, numLikes: prev.numLikes - 1 }
        : { isLiked: true, numLikes: prev.numLikes + 1 },
    );

    socketApi.onLikePost({ user_id: user.id, post_id: post.id });
  }, []);

  const onShowUserLikesClick = useCallback(async () => {
    getUsersWhoLikedPostMutation.mutate({ post_id: post.id });
  }, []);

  useEffect(() => {
    socketApi.onLikePostResponse(({ like }) => {
      if (like.post_id === post.id) {
        setLikes((prev) => ({ isLiked: true, numLikes: prev.numLikes + 1 }));
      }
    });
  }, []);

  return (
    <div className="flex w-fit flex-col gap-2 rounded-lg bg-neutral-200 p-3 drop-shadow-2xl dark:bg-neutral-300">
      <div className="flex items-center border-b border-neutral-400">
        <UserAvatar
          size={40}
          image={
            post.user.avatar_path
              ? { src: post.user?.avatar_path, alt: post.user.first_name }
              : undefined
          }
        />
        <div className="flex w-full justify-between">
          <span className="text-md font-semibold">{`${post.user.first_name} ${post.user.last_name}`}</span>
          <span className="text-sm">{getContentDate(post.created_at)}</span>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2">
        <Image width={500} height={500} src={post.file_path} alt={`post`} />
        {post.description ? (
          <div className="max-w-[500px] break-all">
            <span className="text-md font-semibold">
              {post.user.first_name}:
            </span>
            <div>{post.description}</div>
          </div>
        ) : null}
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <span className="text-neutral-600">{likes.numLikes}</span>
            <button className="outline-none" onClick={onLikeclick}>
              {likes.isLiked ? (
                <HiHeart
                  size={30}
                  className="animate-like-pulse text-red-600"
                />
              ) : (
                <HiOutlineHeart size={30} />
              )}
            </button>
            <span className="cursor-pointer hover:text-neutral-700 hover:underline" onClick={onShowUserLikesClick}>
              Likes
            </span>
          </div>

          <button className="flex flex-row-reverse items-center gap-2 hover:text-neutral-700">
            <HiChat size={30} />
            <span className="text-neutral-600">30</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
