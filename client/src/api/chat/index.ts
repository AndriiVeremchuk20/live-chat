import BaseResponse from "@/types/api/response.type";
import Chat from "@/types/chat.type";
import Message from "@/types/message.type";
import client from "..";

const URLs = {
  base: "/chat",
	getChatMetadata: (id: string)=>`/chat/${id}`,
};

const getUserChats = async() => {
	const response = await client.get<BaseResponse<Array<Message>>>(URLs.base);
	return response.data;
}

const getChat = async (payload: { receiverId: string }) => {
  const response = await client.post<BaseResponse<{ chat_id: string }>>(
    URLs.base,
    { ...payload },
  );
  return response.data;
};

const getChatMetadata = async (payload: {chat_id: string})=>{
 const response = await client.get<BaseResponse<Chat>>(
    URLs.getChatMetadata(payload.chat_id),
  );
  return response.data;

}

export default { getChat, getUserChats, getChatMetadata };
