import React, { useEffect, useState } from "react";
import Login from "@/app/auth/login/page";
import useAppStore from "@/store";
import { useRouter } from "next/navigation";
import routes from "@/config/appRoutes";
import { getAuth, getIdToken } from "firebase/auth";

const withAuth = (Component: any) => {
  const Auth = (props: any) => {
    const { user, isAppLoading } = useAppStore();
    const auth = getAuth();
	const router = useRouter();
    const token = localStorage.getItem('firebaseToken'); 
	useEffect(() => {
      if (!user && !isAppLoading && !auth.currentUser) {
        router.replace(routes.auth.login);
      }
    }, []);

    return <Component {...props} />;
  };

  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
};

export default withAuth;
