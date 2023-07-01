import routes from "@/config/appRoutes";
import Link from "next/link";
import { TbMessages } from "react-icons/tb";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <div className="flex flex-col h-[100px] justify-between bg-neutral-200">
      <div className="w-full flex justify-between">
        <Link className="text-4xl mx-4 flex gap-1" href={routes.home}>
          {" "}
          <span>100</span> <TbMessages />
        </Link>
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
      </div>
      <Navbar />
    </div>
  );
};

export default Header;
