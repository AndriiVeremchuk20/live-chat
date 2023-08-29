import Image from "next/image";
import React, { useCallback, useState } from "react";

interface PropChatImage {
  src: string;
  width: number;
  height: number;
}

const ChatImage: React.FC<PropChatImage> = ({ src, width, height }) => {
  const [showImageLarge, setShowImageLagge] = useState<boolean>(false);

  const onImageClick = useCallback(() => {
    setShowImageLagge((prev) => !prev);
  }, []);

  return (
  <div className={`${!showImageLarge? `w-[${width}px] h-[${height}]`:"w-full h-full"}`}>
    <Image
      width={800}
      height={800}
      src={src}
      alt="Image"
	  onClick={onImageClick}
    />
	</div>
  );
};

export default ChatImage;
