import useAppStore from "@/store";
import Message from "@/types/message.type";
import getContentDate from "@/utils/getContentDate";
import { v4 as uuidv4 } from "uuid";

interface ChatMessageProp {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProp> = ({ message }) => {
  const { user } = useAppStore();

  return (
    <div
      className={`flex ${
        message.sender_id === user?.id ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`mx-2 flex min-w-fit flex-col rounded-md phone:p-1 desktop:p-2 ${
          message.sender_id === user?.id ? "bg-violet-200" : "bg-violet-400"
        }`}
      >
        <div className="flex flex-col text-lg">
          <span className="break-all">{message.text}</span>        
		</div>
        <span
          className={`text-sm text-neutral-500 text-opacity-70 ${
            message.sender_id === user?.id ? "self-end" : "self-start"
          }`}
        >
          {getContentDate(message.created_at)}
        </span>
      </div>
    </div>
  );
};
