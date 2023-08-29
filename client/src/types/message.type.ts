import AppUser from "./user.type";

interface Message {
  id: string;
  text: string;
  image_url: string | null;
  chat_id: string;
  isRead: boolean;
  sender_id: string;
  sender: AppUser | null;
  reciver_id: string;
  receiver: AppUser | null;
  created_at: string;
  reply_to: Message | null;
}

export default Message;
