import BaseResponse from "@/types/api/response.type";
import Message from "@/types/message.type";
import AppUser from "@/types/user.type";
import client from "..";

const URLs = {
  base: "/chat/",
  craeteChat: `/chat/create_chat/`,
  getChatMetadata: (chat_id: string, limit?: number) =>
    `/chat/metadata/${chat_id}${limit ? `?limit=${limit}` : ""}`,
};

//const getChatMessages = async (payload: {
//  receiverId: string;
//  limit?: number;
//}) => {
//  const response = await client.get<BaseResponse<Array<Message>>>(
//    URLs.getChatMessages(payload.receiverId, payload.limit),
//  );
//  return response.data;
//};

const getChat = async (payload: { receiverId: string }) => {
  const response = await client.post<BaseResponse<{ chat_id: string }>>(URLs.craeteChat, {...payload});
  return response.data;
};

const getChatMetadata = async (payload: {
  chat_id: string;
  limit?: number;
}) => {
  const response = await client.get<
    BaseResponse<{
      id: string;
      receiver: AppUser,
      messages: Array<Message>;
    }>
  >(URLs.getChatMetadata(payload.chat_id, payload.limit));

  return response.data;
};

export default { getChat, getChatMetadata };
