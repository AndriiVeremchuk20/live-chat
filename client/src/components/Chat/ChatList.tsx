"use client";

import useAppStore from "@/store";
import { useCallback, useEffect, useState } from "react";
import { useMutation } from "react-query";
import ChatApi from "@/api/chat";
import ChatListItem from "./ChatListItem";
import socketApi from "@/socket/actions";
import Message from "@/types/message.type";
import { MdOutlineSearch } from "react-icons/md";

const ChatList = () => {
  const { user } = useAppStore();
  const [lastMessages, setLastMessages] = useState<Array<Message>>([]);
  const [searchText, setSearchText] = useState<string>("");

  const getChatsMutation = useMutation(ChatApi.getUserChats, {
    onSuccess: (data) => {
      setLastMessages(data.data);
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onSearchInput = useCallback(
    (event: any) => {
      setSearchText(event.target.value);
    },
    [searchText],
  );

  useEffect(() => {
    if (user) {
      getChatsMutation.mutate();
    }
  }, [user]);

  useEffect(() => {
    socketApi.onReseiveMessage((newMessage) => {
      setLastMessages((prevLastMessages) => {
        // filter messages to remove old messages
        const updatedMessages = prevLastMessages.filter(
          (message) => message.chat_id !== newMessage.chat_id,
        );
        //add new message to the beginning
        updatedMessages.unshift(newMessage);

        return updatedMessages;
      });
    });
  }, [lastMessages]);

  if (lastMessages.length <= 0) {
    return (
      <div className=" w-full border-2 border-violet-500">Chats not found</div>
    );
  }

  // add search bar
  return (
    <div className="h-full w-full border-2 border-violet-500 bg-indigo-950 bg-opacity-50">
      <div className="my-5 flex justify-center gap-2 text-black dark:text-white">
        <label
          htmlFor="search-chat"
          className="flex w-11/12 items-center justify-between rounded-2xl bg-neutral-400  p-2 px-6 dark:bg-neutral-600"
        >
          <input
            autoComplete="off"
            onChange={onSearchInput}
            value={searchText}
            type="text"
            id="search-chat"
            placeholder="Search.."
            className="w-full bg-inherit text-xl outline-none placeholder:italic placeholder:text-neutral-300"
          />
          <MdOutlineSearch size={25} />
        </label>
      </div>
      <div className="overflow-y-auto">
        {lastMessages
          .filter((message: Message) => message.text.includes(searchText))
          .map((message) => (
            <ChatListItem key={message.id} lastChatMessage={message} />
          ))}
      </div>
    </div>
  );
};

export default ChatList;
