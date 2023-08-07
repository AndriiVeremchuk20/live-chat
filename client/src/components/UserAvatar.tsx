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
}

const UserAvatar: React.FC<propUserAvatar> = ({ image, size }) => {
  const { user } = useAppStore();
  const [isOnline, setIsOnline] = useState<boolean>(false);

  //useEffect(()=>{

  //},[])

  if (image) {
    return (
      <div
        className={`m-1 w-fit rounded-full border border-violet-900 p-1 ${
          user?.isOnline ? "bg-green-600" : "bg-violet-900"
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
        user?.isOnline ? "border-green-900" : "border-violet-900"
      }`}
    >
      <BiSolidUserCircle size={size} />
    </div>
  );
};

export default UserAvatar;
