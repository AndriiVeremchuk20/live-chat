"use client";

import "./globals.css";
import Header from "@/components/Header";
import { QueryClient, QueryClientProvider, useMutation } from "react-query";
import firebaseConfig from "@/config/firebase";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { authApi } from "@/api/auth";
import { useEffect, useState } from "react";
import useAppStore from "@/store";
import { useRouter } from "next/navigation";
import routes from "@/config/appRoutes";
import Loader from "@/components/Loader";

// Initialize Firebase App
export const firebaseApp = initializeApp(firebaseConfig);
export const googleAuthProvider = new GoogleAuthProvider();

// initialize zustand context
//const StoreContext = createContext();

const AppWrapper = (props: any) => {
  return <QueryClientProvider client={new QueryClient()} {...props} />;
  //</StoreContext.Provider>
};

const AppInner = (props: any) => {
  const auth = getAuth();
  const { setUser } = useAppStore();
  const router = useRouter();
  const { setAppStartLoading, setAppEndLoading } = useAppStore();

  const authMutation = useMutation(authApi.auth, {
    onSuccess(responseData) {
      console.log(responseData);
      setUser(responseData.data);
      //router.replace(routes.home);
    },
    onError(err) {
      console.log(err);
    },
  });

  useEffect(() => {
    setAppStartLoading();
    const unsub = auth.onAuthStateChanged((mbUser) => {
      if (mbUser) {
        //console.log(mbUser);
        if (!mbUser.emailVerified) {
          return router.push(routes.info.verifyemail);
        }
        authMutation.mutate();
      }
      setAppEndLoading();
    });

    return unsub;
  }, []);

  return (
    <body
      className="min-h-screen max-h-fit bg-gradient-to-r from-neutral-300 dark:from-neutral-900 via-white to-neutral-200 dark:to-neutral-800"
      {...props}
    ></body>
  );
};

export default function App({ children }: { children: React.ReactNode }) {
  const { isAppLoading } = useAppStore();

  return (
    <AppWrapper>
      <html lang="en">
        <AppInner>
          {isAppLoading ? (
            <div className="w-full h-screen bg-red-100 flex flex-col items-center justify-center">
              <div className="w-[150px]">
                <Loader />
              </div>
              <span className="my-2 text-2xl font-semibold tracking-wider">Loading..</span>
            </div>
          ) : (
            <>
              <Header />
              {children}
            </>
          )}
        </AppInner>
      </html>
    </AppWrapper>
  );
}
