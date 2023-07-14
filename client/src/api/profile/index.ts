import client from "..";

const URLs = {
  base: "/profile/",
};

const postProfile = async (payload: FormData) => {
  const response = await client.post(URLs.base, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export default {
  postProfile,
};
