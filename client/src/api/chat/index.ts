import BaseResponse from "@/types/api/response.type";
import Message from "@/types/message.type";
import client from "..";

const URLs = {
  base: "/chat/", 
 getChat: (reseiverId: string) =>
    `/chat/${reseiverId}`,
 getChatMessages: (reseiverId: string, limit?: number) =>
    `/chat/messages/${reseiverId}${limit ? `?limit=${limit}` : ""}`,
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

const getChat = async (payload: {receiverId: string}) =>{
	const response = await client.get<BaseResponse<any>>(URLs.getChat(payload.receiverId));
	return response.data;
}

export default { getChatMessages, getChat };
