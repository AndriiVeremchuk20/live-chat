import BaseResponse from "@/types/api/response.type";
import AppUser from "@/types/user.type";
import client from "..";

const URLs = {
  base: "/user-actions/like",
  getPostLikes: (post_id: string) => `/user-actions/like/${post_id}`,
};

const getPostLikes = async ({ post_id }: { post_id: string }) => {
  const response = await client.get<BaseResponse<AppUser[]>>(
    URLs.getPostLikes(post_id),
  );
  return response.data;
};

const likesApi = { getPostLikes };

export default likesApi;
