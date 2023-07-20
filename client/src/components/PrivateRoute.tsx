import routes from "@/config/appRoutes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { BiArrowBack, BiHomeAlt2 } from "react-icons/bi";

const PrivateRoute = () => {
  const router = useRouter();

  const onHomeClick = useCallback(() => {
    router.push(routes.home);
  }, []);

  const onBackClick = useCallback(() => {
    router.back();
  }, []);

  return (
    <div>
      <div>Sorry but this route is private</div>
      <div>
        <span>
          Please <Link href={routes.auth.login}>Login</Link>
        </span>
        <span>
          Or <Link href={routes.auth.registrations}>Register</Link>
        </span>
      </div>
      <div>
        <button onClick={onBackClick}>
          <BiArrowBack /> Back
        </button>
        <button onClick={onHomeClick}>
          <BiHomeAlt2 /> Home
        </button>
      </div>
    </div>
  );
};

export default PrivateRoute;
