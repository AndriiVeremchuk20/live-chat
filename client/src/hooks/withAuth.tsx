import React, { useEffect, useState } from "react";
import Login from "@/app/auth/login/page";
import useAppStore from "@/store";
import { useRouter } from "next/navigation";
import routes from "@/config/appRoutes";
import { getAuth, getIdToken } from "firebase/auth";
import Link from "next/link";

const withAuth = (Component: any) => {
  const Auth = (props: any) => {
    const { user, isAppLoading } = useAppStore();
    const router = useRouter();
    const token = localStorage.getItem("firebaseToken");

    if (!user)
      return (
        <div>
          <div>
            <Link href={routes.auth.login}>Login</Link>
            <Link href={routes.auth.registrations}>Registrations</Link>
          </div>
        </div>
      );

    return <Component {...props} />;
  };

  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
};

export default withAuth;
