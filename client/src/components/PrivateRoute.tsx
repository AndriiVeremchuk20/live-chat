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
    <div className="h-96 flex flex-col items-center justify-center text-black dark:text-white">
      <div className="desktop:w-1/3 tablet:w-1/2 phone:w-full bg-red-400 bg-opacity-60 flex flex-col rounded-md border-2 border-red-600">
        <span className="my-1 self-center font-semibold text-2xl border-b-2 border-red-600">
          Sorry, but this route is private!
        </span>
        <div className="text-xl mx-5">
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
        <div className="flex gap-5 my-5 mx-3">
          <button
            onClick={onBackClick}
            className="flex justify-center items-center mb-2 px-5 text-xl text-white rounded-lg border border-neutral-300 font-bold py-1 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300"
          >
            <BiArrowBack /> Back
          </button>
          <button
            onClick={onHomeClick}
            className="flex justify-center items-center mb-2 px-5 text-xl text-white rounded-lg border border-neutral-300 font-bold py-1 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300"
          >
            <BiHomeAlt2 /> Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivateRoute;
