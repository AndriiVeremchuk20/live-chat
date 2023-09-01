import { SignOutButton } from "./SignOutButton";
import {
  BiSolidUserCircle,
  BiAddToQueue,
  BiChat,
  BiSolidExit,
  BiHomeAlt2,
} from "react-icons/bi";
import Link from "next/link";
import AppRoutes from "@/config/appRoutes";

const Navbar = () => {
  return (
    <nav className="flex h-full w-full flex-col gap-2 bg-purple-600 p-5 text-lg text-black dark:bg-neutral-800 dark:text-neutral-300">
      <Link
        href={AppRoutes.home}
        className="flex w-full gap-1 p-3 hover:rounded-xl hover:bg-neutral-400"
      >
        <BiHomeAlt2 size={30} /> Home
      </Link>

      <Link
        href={AppRoutes.profile.profile}
        className="flex w-full gap-1 p-3 hover:rounded-xl hover:bg-neutral-400"
      >
        <BiSolidUserCircle size={30} /> Profile
      </Link>
      <Link
        href="#"
        className="flex w-full gap-1 p-3 hover:rounded-xl hover:bg-neutral-400"
      >
        <BiAddToQueue size={30} /> App Post
      </Link>
      <Link
        href={AppRoutes.chat.base}
        className="flex w-full gap-1 p-3 hover:rounded-xl hover:bg-neutral-400"
      >
        <BiChat size={30} /> Chats
      </Link>
      <div className="flex w-full gap-1 p-3 hover:rounded-xl hover:bg-neutral-400">
        <BiSolidExit size={30} />
        <SignOutButton />
      </div>
    </nav>
  );
};

export default Navbar;
