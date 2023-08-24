import AppUser from "./user.type";

interface Message {
  id: string;
  text: string;
  chat_id: string;
  isRead: boolean;
  sender_id: string;
  sender?: AppUser;
  reciver_id: string;
  receiver?: AppUser;
  created_at: string;
  reply_to: Message|null;
}

export default Message;

