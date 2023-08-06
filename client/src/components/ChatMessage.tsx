import useAppStore from "@/store";
import Message from "@/types/message.type";
import getContentDate from "@/utils/getContentDate";

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
        className={`min-w-fit flex flex-col rounded-md phone:p-1 desktop:p-2 mx-2 ${
          message.sender_id === user?.id ? "bg-violet-200" : "bg-violet-400"
        }`}
      >
        <div className="flex flex-col text-lg">
          {message.text.split("\n").map((str) => (
            <span key={str} className="break-all">{str}</span>
          ))}
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
