import BaseResponse from "@/types/api/response.type";
import Theme from "@/types/theme.type";
import AppUser from "@/types/user.type";
import client from "..";

const URLs = {
  getById: (id: string) => `/user-actions/${id}`,
  getUserRecommendations: "/user-actions/",
  setUserTheme: "/user-actions/theme",
};

const getUserRecommendations = async () => {
  const response = await client.get<BaseResponse<Array<AppUser>>>(
    URLs.getUserRecommendations,
  );
  return response.data;
};

const getProfileById = async (id: string) => {
  const response = await client.get<BaseResponse<AppUser>>(URLs.getById(id));
  return response.data;
};

export default { getUserRecommendations, getProfileById };
