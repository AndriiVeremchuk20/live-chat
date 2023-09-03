import routes from "@/config/appRoutes";
import useAppStore from "@/store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { TbMessages } from "react-icons/tb";
import Navbar from "./Navbar";
import SetTheme from "./SetTheme";
import UserAvatar from "./UserAvatar";
import { RxHamburgerMenu } from "react-icons/rx";
import { GrClose } from "react-icons/gr";
import AppRoutes from "@/config/appRoutes";
import useOutsideClick from "@/hooks/useOutsideClick";
import SearchBar from "./Search/SearchBar";
import Image from "next/image";
import logo from "../../public/icon.png";

const Header = () => {
  const { user } = useAppStore();
  const pathname = usePathname();
  const [showNavbar, setShowNavbar] = useState<boolean>(false);
  const navbarRef = useRef<HTMLDivElement | null>(null);

  const hideHeaderRoutes = ["/chat/"];

  const shouldHideHeader = hideHeaderRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const onShowNavbarClick = useCallback(() => {
    setShowNavbar(true);
  }, []);

  const onHideNavbarClick = useCallback(() => {
    setShowNavbar(false);
  }, []);

  const onOutsideClick = () => {
    setShowNavbar(false);
  };

  useOutsideClick({ ref: navbarRef, onOutsideClick });
  
  if (shouldHideHeader) {
    return null;
  }

  return (
    <div className="w-full flex h-[100px] flex-col items-center justify-between bg-violet-600 dark:bg-neutral-700">
      <div className="flex h-full w-full items-center justify-between">
        <Link
          className="mx-4 flex items-center gap-1 text-xl text-white drop-shadow-2xl hover:drop-shadow-none phone:hidden tablet:hidden desktop:flex"
          href={routes.home}
        >
          <Image src={logo} width={50} height={50} alt="logo" />
          <span className="font-semibold">Write Me</span>
        </Link>
        <div className=" phone:mx-4  phone:w-full tablet:w-full  desktop:w-2/4">
          <SearchBar />
        </div>

        <div className="flex items-center">
          <SetTheme />
          {user ? (
            <div className="text-dark flex items-center gap-2 dark:text-white">
              {!showNavbar ? (
                <RxHamburgerMenu
                  size={40}
                  className="mx-5 rounded-full bg-neutral-200 bg-opacity-20 p-2 hover:bg-opacity-50"
                  onClick={onShowNavbarClick}
                />
              ) : (
                <GrClose
                  size={40}
                  className="mx-5 rounded-full bg-neutral-200 bg-opacity-20 p-2 hover:bg-opacity-50"
                  onClick={onHideNavbarClick}
                />
              )}
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
      </div>
      {showNavbar ? (
        <div
          className="h-11/12 absolute right-0 top-[100px] z-10 w-[300px]"
          ref={navbarRef}
        >
          <Navbar />
        </div>
      ) : null}
    </div>
  );
};

export default Header;
