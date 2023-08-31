import BaseResponse from "@/types/api/response.type";
import AppUser from "@/types/user.type";
import client from "..";

const URLs = {
  getById: (id: string) => `/user-actions/${id}`,
  getUserRecommendations: "/user-actions/",
  searchUsers: (query: string) => `/user-actions/search/?query=${query}`,
};

const getUserRecommendations = async () => {
  const response = await client.get<BaseResponse<AppUser[]>>(
    URLs.getUserRecommendations,
  );
  return response.data;
};

const getProfileById = async (id: string) => {
  const response = await client.get<BaseResponse<AppUser>>(URLs.getById(id));
  return response.data;
};

const searchUsers = async ({ query }: { query: string }) => {
  const response = await client.get<BaseResponse<AppUser[]>>(
    URLs.searchUsers(query),
  );
  return response.data;
};

export default { getUserRecommendations, getProfileById, searchUsers };
