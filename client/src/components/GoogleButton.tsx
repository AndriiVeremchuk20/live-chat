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
  const { setUser } = useAppStore();
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
    },
    onError(error) {
      console.log(error);
    },
  });

  const onSignInWithGoogle = async () => {
    await signInWithPopup(auth, googleAuthProvider)
      .then((credentials) => {
        console.log(credentials);
        googleAuthMutation.mutate();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <button
      onClick={onSignInWithGoogle}
      className="w-full py-2 my-2 flex justify-center border-y-2 border-violet-300 items-center gap-3 hover:border-violet-200 focus:border-violet-200"
      type="button"
    >
      <FcGoogle size={30} /> <span>Sign in with google</span>
    </button>
  );
};

export default GoogleButton;
