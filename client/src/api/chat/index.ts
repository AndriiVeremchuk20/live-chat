import BaseResponse from "@/types/api/response.type";
import Message from "@/types/message.type";
import client from "..";

const URLs = {
  base: "/chat/",
  getChatMessages: (reseiverId: string, limit?: number) =>
    `/chat/${reseiverId}${limit ? `?limit=${limit}` : ""}`,
};

const getChatMessages = async (payload: {
  receiverId: string;
  limit?: number;
}) => {
  const response = await client.get<BaseResponse<Array<Message>>>(
    URLs.getChatMessages(payload.receiverId, payload.limit),
  );
  return response.data;
};

export default { getChatMessages };
