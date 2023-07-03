import { FcGoogle } from "react-icons/fc";
import React, { useCallback, useEffect, useState } from "react";
import {
  getAuth,
  signInWithPopup,
} from "firebase/auth";
import { googleAuthProvider } from "@/app/layout";

const GoogleButton = () => {
  const auth = getAuth();
  //const [, setUser] = useAtom(userAtom);
  //const router = useRouter();

  //const registrationMutation = useMutation(userAuth.authWithGoogle, {
  //  onSuccess(data) {
  //    console.log(data);
  //    router.replace(AppRoutes.home);
  //  },
  //  onError(error) {
  //   console.log(error);
  //  },
  //});

  // const authMutation = useMutation(userAuth.auth, {
  //  onSuccess(data) {
  //    setUser(data.user);
  //   router.replace(AppRoutes.home);
  //  },
  //  onError(error) {
  //    console.log(error);
  //  },
  // });

  const onSignInWithGoogle = async () => {
    await signInWithPopup(auth, googleAuthProvider)
      .then((credentials) => {
        if (credentials.user.displayName || credentials.user.email) {
          console.log(credentials.user)

        //  authMutation.mutate({ type: "Auth", uid: credentials.user.uid });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <button onClick={onSignInWithGoogle} className="w-full py-2 my-2 flex justify-center border-y-2 border-violet-300 items-center gap-3 hover:border-violet-200 focus:border-violet-200" type="button">
      <FcGoogle size={30} /> <span>Sign in with google</span>
    </button>
  );
};

export default GoogleButton;
