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
import SearchBar from "./SearchBar";

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

  if (shouldHideHeader) {
    return null;
  }

  useOutsideClick({ ref: navbarRef, onOutsideClick });

  return (
    <div className="flex max-h-fit min-h-[100px] flex-col content-center justify-between bg-violet-400 dark:bg-violet-700">
      <div className="flex h-full w-full items-center justify-between">
        <Link
          className="mx-4 flex gap-1 text-4xl text-white"
          href={routes.home}
        >
          <span className="font-sans font-bold">100</span> <TbMessages />
        </Link>
        <SetTheme />
        <div className="w-2/4">
          <SearchBar />
        </div>
        {user ? (
          <div className="flex items-center gap-2">
            <Link
              href={AppRoutes.profile.profile}
              className="flex items-center"
            >
              <span className="font-semibold">{user.first_name}</span>
              {user.profile?.avatar_path ? (
                <UserAvatar
                  size={50}
                  user_id={user.id}
                  image={{
                    src: user.profile.avatar_path,
                    alt: user.first_name,
                  }}
                />
              ) : (
                <UserAvatar size={50} user_id={user.id} />
              )}
            </Link>
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
