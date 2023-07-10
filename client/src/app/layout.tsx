"use client";

import "./globals.css";
import Header from "@/components/Header";
import { QueryClient, QueryClientProvider, useMutation } from "react-query";
import firebaseConfig from "@/config/firebase";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { authApi } from "@/api/auth";
import { useEffect } from "react";
import useAppStore from "@/store";
import { useRouter } from "next/navigation";
import routes from "@/config/appRoutes";

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
    const unsub = auth.onAuthStateChanged((mbUser) => {
      if (mbUser) {
        //console.log(mbUser);
        if (!mbUser.emailVerified) {
          return router.push(routes.info.verifyemail);
        }
      return authMutation.mutate();
      }
    });

    return unsub;
  }, []);

  return (
    <body
      className="min-h-screen max-h-fit bg-gradient-to-r from-neutral-200 via-white to-neutral-200"
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
