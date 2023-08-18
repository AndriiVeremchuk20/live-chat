import ChatsList from "@/components/Chat/ChatsList";

const ChatPage = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex justify-between border-violet-600 bg-neutral-300 bg-opacity-80 dark:bg-gray-800 phone:h-full phone:w-full tablet:w-full desktop:m-1 desktop:my-5 desktop:h-[90%] desktop:w-5/6 desktop:rounded-lg desktop:border-2">
        <div className="phone:w-full tablet:w-1/2 desktop:w-1/6">
		<ChatsList />
		</div>
        <div className="flex w-2/3 flex-col bg-red-400"></div>
      </div>
    </div>
  );
};

export default ChatPage;
