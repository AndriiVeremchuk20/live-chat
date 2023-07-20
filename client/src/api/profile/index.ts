import BaseResponse from "@/types/api/response.type";
import Profile from "@/types/profile.type";
import client from "..";

const URLs = {
  base: "/profile/",
};

const postProfile = async (payload: FormData) => {
  const response = await client.post<BaseResponse<Profile>>(URLs.base, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export default {
  postProfile,
};
