import Message from "@/types/message.type";
import { useEffect, useRef } from "react";
import UserAvatar from "../UserAvatar";

const NewMessageNotification = ({ message }: { message: Message }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <>
      <div>
	  <div className="w-full flex items-center gap-3">
        <UserAvatar
          size={30}
          image={
            message.sender?.profile?.avatar_path
              ? {
                  src: message.sender.profile.avatar_path,
                  alt: message.sender.first_name,
                }
              : undefined
          }
        />
		<div>{message.sender?.first_name}</div>
		</div>
        <div className="break-all">
          <div>New messge: {`${message.text}`}</div>
        </div>
      </div>
      <audio className="hidden" autoPlay controls src="http://localhost:5000/audio/newMessage.mp3" />
    </>
  );
};

export default NewMessageNotification;
