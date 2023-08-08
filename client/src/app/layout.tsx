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
import socket from "@/socket";

// Initialize Firebase App
export const firebaseApp = initializeApp(firebaseConfig);
export const googleAuthProvider = new GoogleAuthProvider();

const AppWrapper = (props: any) => {
  return <QueryClientProvider client={new QueryClient()} {...props} />;
};

const AppInner = (props: any) => {
  const auth = getAuth();
  const { user, setUser, setTheme } = useAppStore();
  const { isAppLoading, setAppStartLoading, setAppEndLoading } = useAppStore();
  const router = useRouter();

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

  useEffect(() => {
    if (user) {
      socket.connect();
      
	  socket.emit("online", user.id);
      socket.on("online_users", (data)=>{console.log(data)});
	  socket.on("socket_error", (data)=>{alert(data.message)})
    }
    return () => {
      if (user) {
        socket.emit("offline", user.id);
        socket.disconnect();
      }
    };
  }, [user]);

  if (isAppLoading)
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-neutral-500">
        <div className="flex flex-col items-center gap-3">
          <Loader />
          <span className="text-2xl font-semibold dark:text-white">Wait...</span>
        </div>
      </div>
    );

  return <div {...props}></div>;
};

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="max-h-fit min-h-screen bg-gradient-to-r from-neutral-300 via-white to-neutral-200 dark:from-neutral-900 dark:to-neutral-800">
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
