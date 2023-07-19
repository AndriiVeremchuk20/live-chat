"use client";

import "./globals.css";
import Header from "@/components/Header";
import { QueryClient, QueryClientProvider, useMutation } from "react-query";
import firebaseConfig from "@/config/firebase";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { authApi } from "@/api/auth";
import React, { useEffect, useState } from "react";
import useAppStore from "@/store";
import { useRouter } from "next/navigation";
import routes from "@/config/appRoutes";
import Loader from "@/components/Loader";
import LocalStorageKeys from "@/config/localStorageKeys";

// Initialize Firebase App
export const firebaseApp = initializeApp(firebaseConfig);
export const googleAuthProvider = new GoogleAuthProvider();

const AppWrapper = (props: any) => {
  return <QueryClientProvider client={new QueryClient()} {...props} />;
};

const AppInner = (props: any) => {
  const auth = getAuth();
  const { setUser, setTheme } = useAppStore();
  const { isAppLoading, setAppStartLoading, setAppEndLoading } = useAppStore();
  const router = useRouter();

  //const [l, setL] = useState<boolean>(true);

  const authMutation = useMutation(authApi.auth, {
    onSettled(data, errors) {
      if (data) {
        setUser(data.data);
      }
      if (errors) {
        console.log(errors);
      }
      setAppEndLoading();
    },
  });

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((mbUser) => {
      if (mbUser) {
        authMutation.mutate();
      }
    });

    setAppEndLoading();
    return unsub;
  }, []);

  useEffect(() => {
    const localStorageValue = localStorage.getItem(LocalStorageKeys.Theme);
    if (localStorageValue && localStorageValue === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
      return;
    }
    setTheme("light");
    document.documentElement.classList.remove("dark");
  }, []);

  if (isAppLoading)
    return (
      <div className="h-screen bg-red-100 dark:bg-slate-600 flex flex-col justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <Loader />
          <span className="text-2xl font-semibold">Wait...</span>
        </div>
      </div>
    );

  return <div {...props}></div>;
};

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen max-h-fit bg-gradient-to-r from-neutral-300 dark:from-neutral-900 via-white to-neutral-200 dark:to-neutral-800">
        <AppWrapper>
          <AppInner>
            <Header />
            {children}
          </AppInner>
        </AppWrapper>
      </body>
    </html>
  );
}
