import client from "@/api";
import RegistrationsPayload from "@/types/api/auth/registrations.type";
import BaseResponse from "@/types/api/response.type";
import AppUser from "@/types/user.type";

const URLs = {
  registrations: "/auth/registration",
  auth: "/auth/auth",
  googleAuth: "/auth/google-auth",
};

const registrations = async (payload: RegistrationsPayload) => {
  const response = await client.post<BaseResponse>(URLs.registrations, payload);
  return response.data;
};

const auth = async () => {
  const response = await client.get<BaseResponse<AppUser>>(URLs.auth);
  return response.data;
};

const authWithGoogle = async () => {
  const response = await client.get<BaseResponse<AppUser>>(URLs.googleAuth);
  return response.data;
};

export const authApi = {
  registrations,
  auth,
  authWithGoogle,
};
