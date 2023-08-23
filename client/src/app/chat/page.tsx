import ChatList from "@/components/Chat/ChatList";

const ChatPage = () => {
  return (
    <div className="flex h-screen justify-center">
      <div className=" desktop:w-3/4 tablet:w-2/3 phone:w-full">
        <ChatList />
      </div>
    </div>
  );
};

export default ChatPage;
