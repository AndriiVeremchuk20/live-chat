import routes from "@/config/appRoutes";
import useAppStore from "@/store";
import Link from "next/link";
import { useEffect } from "react";
import { TbMessages } from "react-icons/tb";
import Navbar from "./Navbar";
import SetTheme from "./SetTheme";
import { SignOutButton } from "./SignOutButton";
import UserAvatar from "./UserAvatar";

const Header = () => {
  const { user } = useAppStore();

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div className="flex h-[120px] flex-col content-center justify-between bg-violet-400 dark:bg-violet-700">
      <div className="flex h-full w-full items-center justify-between">
        <Link
          className="mx-4 flex gap-1 text-4xl text-white"
          href={routes.home}
        >
          <span className="font-sans font-bold">100</span> <TbMessages />
        </Link>
        <SetTheme />
        {user ? (
          <div className="flex">
            {user.profile?.avatar_path ? (
              <UserAvatar
                size={50}
				user_id={user.id}
                image={{ src: user.profile.avatar_path, alt: user.first_name }}
              />
            ) : (
              <UserAvatar size={50} user_id={user.id}/>
            )}
            <span>{user.first_name}</span> <SignOutButton />
          </div>
        ) : (
          <div className="mx-3 text-xl">
            <Link
              href={routes.auth.login}
              className="text-blue-600 underline hover:text-blue-300"
            >
              Login
            </Link>
            <span className="mx-1">or</span>
            <Link
              href={routes.auth.registrations}
              className="text-blue-600 underline hover:text-blue-300"
            >
              Registration
            </Link>
          </div>
        )}
      </div>
      <Navbar />
    </div>
  );
};

export default Header;
