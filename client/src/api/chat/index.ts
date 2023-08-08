import BaseResponse from "@/types/api/response.type";
import Chat from "@/types/chat.type";
import client from "..";

const URLs = {
  base: "/chat",
};

const getUserChats = async() => {
	const response = await client.get<BaseResponse<Array<Omit<Chat, "users">>>>(URLs.base);
	return response.data;
}

const getChat = async (payload: { receiverId: string }) => {
  const response = await client.post<BaseResponse<{ chat_id: string }>>(
    URLs.base,
    { ...payload },
  );
  return response.data;
};

export default { getChat, getUserChats };
