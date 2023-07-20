import React from "react";
import useAppStore from "@/store";
import PrivateRoute from "@/components/PrivateRoute";

const withAuth = (Component: any) => {
  const Auth = (props: any) => {
    const { user } = useAppStore();

    if (!user)
      return <PrivateRoute/>;

    return <Component {...props} />;
  };

  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
};

export default withAuth;
