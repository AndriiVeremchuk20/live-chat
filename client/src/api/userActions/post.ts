import BaseResponse from "@/types/api/response.type";
import UserPost from "@/types/userPost.type";
import client from "..";

const URLs = {
  base: "/user-actions/post",
};

const addPost = async (payload: FormData) => {
  const response = await client.post<BaseResponse<UserPost>>(URLs.base, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

const getPosts = async () => {
  const response = await client.get<BaseResponse<UserPost[]>>(URLs.base);
  return response.data;
};

const postsApi = { addPost, getPosts };

export default postsApi;
