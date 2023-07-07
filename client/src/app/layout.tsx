"use client";

import "./globals.css";
import Header from "@/components/Header";
import { QueryClient, QueryClientProvider, useMutation } from "react-query";
import firebaseConfig from "@/config/firebase";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { authApi } from "@/api/auth";
import { useEffect } from "react";
import useAppStore  from "@/store";
import AppUser from "@/types/user.type";
//import { createContext } from "vm";
// Initialize Firebase App
export const firebaseApp = initializeApp(firebaseConfig);
export const googleAuthProvider = new GoogleAuthProvider();

// initialize zustand context
//const StoreContext = createContext();

const AppWrapper = (props: any) => {
  return <QueryClientProvider client={new QueryClient()} {...props} />
  //</StoreContext.Provider>
};

const AppInner = (props: any) => {
  const auth = getAuth();
  const { setUser } = useAppStore();

  const authMutation = useMutation(authApi.auth, {
    onSuccess(data) {
      console.log(data);
      setUser(data.data.data as AppUser);
    },
    onError(err) {
      console.log(err);
    },
  });

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((mbUser) => {
      if (mbUser) {
        console.log(mbUser);
        return authMutation.mutate();
      }
    });

    return unsub;
  }, []);

  return (
      <body
        className="min-h-screen max-h-fit bg-gradient-to-r from-indigo-700 via-purple-900 to-pink-700"
        {...props}
      ></body>
  );
};

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <AppWrapper>
      <html lang="en">
        <AppInner>
          <Header />
          {children}
        </AppInner>
      </html>
    </AppWrapper>
  );
}
