import Image from "next/image";
import React from "react";

interface PropChatImage {
  src: string;
  width: number;
  height: number;
}

const ChatImage: React.FC<PropChatImage> = ({ src, width, height }) => {
  return (
    <div>
      <Image width={width} height={height} src={src} alt="Image" />
    </div>
  );
};

export default ChatImage;
