import Message from "./message.type";
import AppUser from "./user.type";

interface Chat {
  chat_id: string;
  receiver: AppUser;
  messages: Array<Message>;
}

export default Chat;
