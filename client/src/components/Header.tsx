import routes from "@/config/appRoutes";
import useAppStore from "@/store";
import Link from "next/link";
import { useEffect } from "react";
import { TbMessages } from "react-icons/tb";
import Navbar from "./Navbar";
import { SignOutButton } from "./SignOutButton";

const Header = () => {
  const { user } = useAppStore();

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div className="flex flex-col h-[120px] justify-between content-center bg-violet-400">
      <div className="w-full h-full flex justify-between items-center">
        <Link
          className="text-4xl text-white mx-4 flex gap-1"
          href={routes.home}
        >
          <span className="font-bold font-sans">100</span> <TbMessages />
        </Link>
        {user ? (
          <div>
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
