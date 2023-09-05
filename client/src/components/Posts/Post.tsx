import UserPost from "@/types/userPost.type";
import getContentDate from "@/utils/getContentDate";
import Image from "next/image";
import UserAvatar from "../UserAvatar";
import { HiHeart, HiOutlineHeart, HiChat } from "react-icons/hi";
import {useCallback, useState} from "react";

interface propPost {
  post: UserPost;
}

const Post: React.FC<propPost> = ({ post }) => {
	const [isLiked, setIsLiked] = useState<boolean>(false);

	const onLikeclick = useCallback(()=>{
		setIsLiked(prev => !prev);
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
            <span className="text-neutral-600">40</span>
			<button className="outline-none" onClick={onLikeclick}>
              {isLiked?<HiHeart size={30} className="text-red-600 animate-like-pulse"/>:<HiOutlineHeart size={30}/>}
            </button>
            <span className="cursor-pointer hover:underline hover:text-neutral-700">Likes</span>
          </div>

          <button className="flex flex-row-reverse items-center gap-2 hover:text-neutral-700">
            <HiChat size={30} />
            <span className="text-neutral-600">
              30
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
