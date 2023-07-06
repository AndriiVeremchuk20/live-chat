import client from "@/api";
import RegistrationsRequestBody from "./registrations.type";

const URLs = { registrations: "/auth/registration", auth: "/auth/auth" };

const registrations = async (payload: RegistrationsRequestBody) => {
  const response = await client.post(URLs.registrations, payload);
  return response;
};

const auth = async () => {
  const response = await client.get(URLs.auth);
  return response;
};

export const authApi = {
  registrations,
  auth,
};
