import UserPost from "@/types/userPost.type";
import getContentDate from "@/utils/getContentDate";
import Image from "next/image";
import UserAvatar from "../UserAvatar";
import {HiHeart, HiOutlineHeart, HiChat} from "react-icons/hi"


interface propPost {
  post: UserPost;
}

const Post: React.FC<propPost> = ({ post }) => {
  console.log(post);
  return (
    <div className="w-fit flex flex-col gap-2 rounded-lg bg-neutral-200 p-3 drop-shadow-2xl dark:bg-neutral-300">
      <div className="flex items-center border-b border-neutral-400">
        <UserAvatar
          size={40}
          image={
            post.user.avatar_path
              ? { src: post.user?.avatar_path, alt: post.user.first_name }
              : undefined
          }
        />
        <div className="w-full flex justify-between">
          <span className="font-semibold text-md">{`${post.user.first_name} ${post.user.last_name}`}</span>
          <span className="text-sm">{getContentDate(post.created_at)}</span>
        </div>
      </div>
      <div className="w-full flex flex-col gap-2">
        <Image width={500} height={500} src={post.file_path} alt={`post`} />
        {post.description ? (
          <div className="w-full break-all">
            <span className="font-semibold text-md">{post.user.first_name}:</span>
            <span className="w-fit break-all">{post.description}</span>
          </div>
        ) : null}
        <div className="flex justify-between">
          <button><HiOutlineHeart size={30}/></button>
          <button><HiChat size={30}/></button>
        </div>
      </div>
    </div>
  );
};

export default Post;
