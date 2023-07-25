import Image from "next/image";
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
  if (image) {
    return (
      <div
        className={`m-1 w-fit rounded-full border border-violet-900 bg-violet-300 p-1`}
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
    <div className="w-fit rounded-full border border-violet-900">
      <BiSolidUserCircle size={size} />
    </div>
  );
};

export default UserAvatar;
