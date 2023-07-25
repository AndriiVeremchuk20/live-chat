import { FcGoogle } from "react-icons/fc";
import React, { useCallback, useEffect, useState } from "react";
import { getAuth, signInWithPopup } from "firebase/auth";
import { googleAuthProvider } from "@/app/layout";
import useAppStore from "@/store";
import { useRouter } from "next/navigation";
import { authApi } from "@/api/auth";
import { useMutation } from "react-query";
import routes from "@/config/appRoutes";

const GoogleButton = () => {
  const auth = getAuth();
  const { setUser, setAppEndLoading, setAppStartLoading } = useAppStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //  const authMutation = useMutation(authApi.auth, {
  //   onSuccess(data) {
  //     setUser(data.data);
  //     router.replace(routes.home);
  //   },
  //   onError(error) {
  //     console.log(error);
  //   },
  // });
  //
  const googleAuthMutation = useMutation(authApi.authWithGoogle, {
    onSuccess(data) {
      console.log(data);
      router.push(routes.home);
    },
    onError(error) {
      console.log(error);
    },
  });

  const onSignInWithGoogle = async () => {
    await signInWithPopup(auth, googleAuthProvider)
      .then((credentials) => {
        //console.log(credentials);
        setAppStartLoading();
        googleAuthMutation.mutate();
        setAppEndLoading();
      })
      .catch((e) => {
        setAppEndLoading();
        console.log(e);
      });
  };

  return (
    <button
      onClick={onSignInWithGoogle}
      className="my-2 flex w-full items-center justify-center gap-3 border-y-2 border-violet-300 py-2 hover:border-violet-200 focus:border-violet-200"
      type="button"
    >
      <FcGoogle size={30} /> <span>Sign in with google</span>
    </button>
  );
};

export default GoogleButton;
