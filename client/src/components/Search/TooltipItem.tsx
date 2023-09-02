import AppRoutes from "@/config/appRoutes";
import AppUser from "@/types/user.type";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import UserAvatar from "../UserAvatar";

interface propToolipItem {
  user: AppUser;
}

const TooltipItem: React.FC<propToolipItem> = ({ user }) => {
  const avatar = user.avatar_path;
  const router = useRouter();

  const onClick = useCallback(() => {
    router.push(AppRoutes.profile.userProfile(user.id));
  }, []);

  return (
    <div
      className="flex w-full cursor-pointer items-center bg-neutral-200 p-3 duration-100 first:rounded-t-xl last:rounded-b-xl hover:bg-neutral-400 hover:bg-opacity-30"
      onClick={onClick}
    >
      <UserAvatar
        size={50}
        image={avatar ? { src: avatar, alt: "image" } : undefined}
      />
      <div className="flex flex-col">
        <span className="font-semibold">{`${user.first_name} ${user.last_name}`}</span>
        <span className="text-sm">{user.email.split("@")[0]}</span>
      </div>
    </div>
  );
};

export default TooltipItem;
