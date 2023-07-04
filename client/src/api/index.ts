import axios, { AxiosHeaders } from "axios";
import { getAuth } from "firebase/auth";

const BASE_URL = "http://localhost:5000/";

const createToken = async () => {
  const user = getAuth().currentUser;
  const token = user ? await user.getIdToken() : null;
  return token;
};

const client = axios.create({
  baseURL: BASE_URL,
});

client.interceptors.request.use(async (config) => {
  const token = await createToken();
  if (token) {
    config.headers.Authorization = token ? `Bearer ${token}` : null;
  }
  return config;
});

export default client;
