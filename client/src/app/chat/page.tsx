import ChatsList from "@/components/Chat/ChatsList";

const ChatPage = () => {
  return (
    <div className="flex h-screen justify-center mt-10">
      <div className=" desktop:w-3/4 tablet:w-2/3 phone:w-full">
        <ChatsList />
      </div>
    </div>
  );
};

export default ChatPage;
