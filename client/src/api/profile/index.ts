import BaseResponse from "@/types/api/response.type";
import Profile from "@/types/profile.type";
import AppUser from "@/types/user.type";
import client from "..";

const URLs = {
  base: "/profile/",
};

const postProfile = async (payload: FormData) => {
  const response = await client.post<BaseResponse<AppUser>>(
    URLs.base,
    payload,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
};

const updateProfile = async (payload: FormData) => {
  const response = await client.put<BaseResponse<AppUser>>(URLs.base, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export default {
  postProfile,
  updateProfile,
};
