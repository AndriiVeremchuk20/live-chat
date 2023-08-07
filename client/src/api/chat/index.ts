import BaseResponse from "@/types/api/response.type";
import client from "..";

const URLs = {
  base: "/chat",
};

const getChat = async (payload: { receiverId: string }) => {
  const response = await client.post<BaseResponse<{ chat_id: string }>>(
    URLs.base,
    { ...payload },
  );
  return response.data;
};

export default { getChat };
