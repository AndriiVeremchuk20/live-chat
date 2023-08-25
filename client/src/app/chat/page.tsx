import ChatList from "@/components/Chat/ChatList";

const ChatPage = () => {
  return (
    <div className="flex h-screen justify-center">
      <div className=" phone:w-full tablet:w-2/3 desktop:w-3/4">
        <ChatList />
      </div>
    </div>
  );
};

export default ChatPage;
