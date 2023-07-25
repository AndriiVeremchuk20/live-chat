import routes from "@/config/appRoutes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { BiArrowBack, BiHomeAlt2 } from "react-icons/bi";
import Alert from "./Alert";

const PrivateRoute = () => {
  const router = useRouter();

  const onHomeClick = useCallback(() => {
    router.push(routes.home);
  }, []);

  const onBackClick = useCallback(() => {
    router.back();
  }, []);

  return (
    <div className="flex h-96 flex-col items-center justify-center text-black dark:text-white">
      <div className="flex flex-col rounded-md border-2 border-red-600 bg-red-400 bg-opacity-60 phone:w-full tablet:w-1/2 desktop:w-1/3">
        <span className="my-1 self-center border-b-2 border-red-600 text-2xl font-semibold">
          Sorry, but this route is private!
        </span>
        <div className="mx-5 text-xl">
          <span>
            Please{" "}
            <Link
              href={routes.auth.login}
              className="text-blue-600 underline hover:text-blue-300"
            >
              Login
            </Link>{" "}
            or{" "}
            <Link
              href={routes.auth.registrations}
              className="text-blue-600 underline hover:text-blue-300"
            >
              Register
            </Link>
          </span>
        </div>
        <div className="mx-3 my-5 flex gap-5">
          <button
            onClick={onBackClick}
            className="mb-2 flex items-center justify-center rounded-lg border border-neutral-300 bg-violet-500 px-5 py-1 text-xl font-bold text-white hover:bg-violet-600 focus:outline-none focus:ring focus:ring-violet-300 active:bg-violet-700"
          >
            <BiArrowBack /> Back
          </button>
          <button
            onClick={onHomeClick}
            className="mb-2 flex items-center justify-center rounded-lg border border-neutral-300 bg-violet-500 px-5 py-1 text-xl font-bold text-white hover:bg-violet-600 focus:outline-none focus:ring focus:ring-violet-300 active:bg-violet-700"
          >
            <BiHomeAlt2 /> Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivateRoute;
