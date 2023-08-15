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
        <div>
          <div>New messge:</div>
          <div>{message.text}</div>
        </div>
      </div>
      <audio className="hidden" autoPlay controls src="http://localhost:5000/audio/newMessage.mp3" />
    </>
  );
};

export default NewMessageNotification;
