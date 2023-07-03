"use client";

import "./globals.css";
import Header from "@/components/Header";
import { QueryClient, QueryClientProvider } from "react-query";
import firebaseConfig from "@/firebase";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Initialize Firebase App
export const firebaseApp = initializeApp(firebaseConfig);
export const googleAuthProvider = new GoogleAuthProvider();

const AppWrapper = (props: any) => {
  return <QueryClientProvider client={new QueryClient()} {...props} />;
};

const AppInner = (props: any) => {
  //const auth = getAuth();
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
