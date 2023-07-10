import React, { useEffect, useState } from "react";
import Login from "@/app/auth/login/page";
import useAppStore from "@/store";
import { useRouter } from "next/navigation";
import routes from "@/config/appRoutes";

const withAuth = (Component: any) => {
  const Auth = (props: any) => {
    const { user } = useAppStore();
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
      setIsAuthenticated(!!user);
    }, [user]);

    if (isAuthenticated) {
      return router.replace(routes.auth.login);
    }

    return <Component {...props} />;
  };

  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
};

export default withAuth;
