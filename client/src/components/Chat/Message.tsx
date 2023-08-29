import useOutsideClick from "@/hooks/useOutsideClick";
import socketApi from "@/socket/actions";
import useAppStore from "@/store";
import Message from "@/types/message.type";
import getContentDate from "@/utils/getContentDate";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { MdDone, MdDoneAll, MdDelete, MdReply } from "react-icons/md";
import ChatImage from "./Image";

interface ChatMessageProp {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProp> = ({ message }) => {
  const { user, setReplyMessage, removeReplyMessage } = useAppStore();
  const [chatMessage, setChatMessage] = useState<Message>(message);
  const [isContextMenuVisible, setIsContextMenuVisible] =
    useState<boolean>(false);

  const contextMenuRef = useRef<HTMLDivElement | null>(null);

  const lines = message.text.split("\n");

  const onContextMenuClick = useCallback((event: any) => {
    event.preventDefault();
    setIsContextMenuVisible(true);
  }, []);

  const onClickOutsideContextMenu = useCallback(() => {
    setIsContextMenuVisible(false);
  }, []);

  const onDeleteClick = useCallback(() => {
    if (user) {
      const payload = {
        message_id: message.id,
        deleter_id: user.id,
        chat_id: message.chat_id,
      };
      socketApi.onDeleteMessage(payload);
    }
  }, [chatMessage]);

  const onReplyClick = useCallback(() => {
    setReplyMessage(message);

    // hide context menu
    setIsContextMenuVisible(false);
  }, []);

  useOutsideClick({
    ref: contextMenuRef,
    onOutsideClick: onClickOutsideContextMenu,
  });

  useEffect(() => {
    if (!chatMessage.isRead && chatMessage.sender_id !== user?.id) {
      socketApi.onReadMessage({ message_id: chatMessage.id });
    }

    socketApi.onReadMessageResponse(({ id, isRead }) => {
      if (chatMessage.id === id) {
        setChatMessage((prev) => ({ ...prev, isRead }));
      }
    });

    return () => {
      removeReplyMessage();
    };
  }, []);

  return (
    <div
      className={`flex text-white drop-shadow-2xl ${
        message.sender_id === user?.id ? "justify-end" : "justify-start"
      }`}
    >
      <div
        onContextMenu={onContextMenuClick}
        className={`mx-2 flex cursor-pointer flex-col rounded-md phone:p-1 desktop:p-2 ${
          message.sender_id === user?.id
            ? "bg-purple-500 dark:bg-purple-700"
            : "bg-violet-500 dark:bg-violet-700"
        }`}
      >
        {
          // reply to message
        }
        {message.reply_to ? (
          <div
            className={`text-md mb-1 px-2 py-1 ${
              message.sender_id === user?.id ? "border-l-2" : "border-r-2"
            }
		border-neutral-200`}
          >
            {
              // if reply message has image
              message.reply_to.image_url ? (
                <ChatImage
                  width={50}
                  height={50}
                  src={message.reply_to.image_url}
                />
              ) : null
            }
            <div className="font-semibold">{message.sender?.first_name}</div>
            <div>{message.reply_to.text}</div>
          </div>
        ) : null}
        {
          // show image
        }
        {message.image_url ? (
          <ChatImage width={400} height={400} src={message.image_url} />
        ) : null}
        <div className="flex min-w-fit max-w-xs flex-col text-lg">
          {lines.map((line, index) => (
            <p className="break-all" key={index}>
              {line}
            </p>
          ))}
        </div>
        <div
          className={`flex ${
            message.sender_id === user?.id ? "flex-row" : "flex-row-reverse"
          } justify-between gap-2 text-sm font-bold text-neutral-300 text-opacity-70`}
        >
          <div>
            {chatMessage.isRead ? (
              <MdDoneAll size={15} />
            ) : (
              <MdDone size={15} />
            )}
          </div>
          <span>{getContentDate(message.created_at)}</span>
        </div>
      </div>
      {/*context menu*/}
      {isContextMenuVisible ? (
        <div
          ref={contextMenuRef}
          className="m-1 h-fit w-fit animate-slow-slide rounded-md border border-purple-700 bg-neutral-600 bg-opacity-50 p-2"
        >
          <>
            <div
              className="flex cursor-pointer items-center hover:text-violet-600"
              onClick={onReplyClick}
            >
              <MdReply size={20} /> Repty
            </div>

            {message.sender_id === user?.id ? (
              <div
                className="flex cursor-pointer items-center hover:text-violet-600"
                onClick={onDeleteClick}
              >
                <MdDelete size={20} /> Delete
              </div>
            ) : null}
          </>
        </div>
      ) : null}
    </div>
  );
};
