import client from "..";

const URLs = {
  base: "/user-actions/post",
};

const addPost = async (payload: FormData) => {
  const response = await client.post<any>(URLs.base, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response;
};

const getPosts = async () => {
  const response = await client.get(URLs.base);
  return response;
};

const postsApi = { addPost, getPosts };

export default postsApi;
