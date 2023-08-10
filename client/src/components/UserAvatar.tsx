import useAppStore from "@/store";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BiSolidUserCircle } from "react-icons/bi";

type ImageType = {
  src: string;
  alt: string;
};

interface propUserAvatar {
  image?: ImageType;
  size: number;
  user_id?: string;
}

const UserAvatar: React.FC<propUserAvatar> = ({ image, size, user_id }) => {
  const { user, onlineUsers } = useAppStore();
  const [isOnline, setIsOnline] = useState<boolean>(onlineUsers.some(id=>user_id === id));

  if (image) {
    return (
      <div
        className={`m-1 w-fit rounded-full border border-violet-900 p-1 ${
          isOnline ? "bg-green-600" : "bg-violet-900"
        }`}
      >
        <Image
          width={size}
          height={size}
          src={image.src}
          alt={image.alt}
          className={`rounded-full`}
          style={{ width: `${size}px`, height: `${size}px` }}
        />
      </div>
    );
  }

  return (
    <div
      className={`w-fit rounded-full border ${
        isOnline ? "border-green-900" : "border-violet-900"
      }`}
    >
      <BiSolidUserCircle size={size} />
    </div>
  );
};

export default UserAvatar;
