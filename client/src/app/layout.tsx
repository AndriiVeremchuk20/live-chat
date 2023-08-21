"use client";

import "./globals.css";
import Header from "@/components/Header";
import { QueryClient, QueryClientProvider, useMutation } from "react-query";
import firebaseConfig from "@/config/firebase";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { authApi } from "@/api/auth";
import React, { useEffect } from "react";
import useAppStore from "@/store";
import Loader from "@/components/Loader";
import LocalStorageKeys from "@/config/localStorageKeys";
import socket from "@/socket";
import socketApi from "@/socket/actions";
import SocketEvents from "@/socket/events";
import SocketError from "@/types/socket/socketError.type";
import { toast, ToastContainer } from "react-toastify";

// toast notification styles
import "react-toastify/dist/ReactToastify.css";
import NewMessageNotification from "@/components/toast/NewMessageNotification";
import { usePathname } from "next/navigation";

// Initialize Firebase App
export const firebaseApp = initializeApp(firebaseConfig);
export const googleAuthProvider = new GoogleAuthProvider();

const AppWrapper = (props: any) => {
  return <QueryClientProvider client={new QueryClient()} {...props} />;
};

const AppInner = (props: any) => {
  const auth = getAuth();
  const pathname = usePathname();
  const { user, setUser, currTheme, setTheme } = useAppStore();
  const { isAppLoading, setAppEndLoading, setOnlineUsers } = useAppStore();

  const authMutation = useMutation(authApi.auth, {
    onSettled(data, errors) {
      if (data) {
        console.log(data);
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
    if (localStorageValue && localStorageValue === "DARK") {
      setTheme("DARK");
      document.documentElement.classList.add("dark");
      return;
    }
    setTheme("LIGHT");
    document.documentElement.classList.remove("dark");
  }, []);

  useEffect(() => {
    let pingInterval: any = null;
    if (user) {
      socket.connect();

      user.chats.forEach((chat) => {
        socketApi.onJoinChat({ chat_id: chat, user_id: user.id });
      });

      // show notifications to new messages
      socketApi.onReseiveMessage((message) => {
        // if the current user is not the sender and the current user is not in a chat with the sender
        if (
          message.sender_id !== user.id &&
          !pathname.includes(message.sender_id)
        ) {
          toast(<NewMessageNotification message={message} />, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: currTheme === "DARK" ? "dark" : "light",
          });
        }
        //console.log(message);
      });

      socketApi.auth({ user_id: user.id });

      pingInterval = setInterval(() => {
        socketApi.userPing({ user_id: user.id });
      }, 30 * 1000);

      socketApi.onlineUsers((data: Array<string>) => {
        //console.log(data);
        setOnlineUsers(data);
      });

      socket.on(SocketEvents.error, (err: SocketError) => {
        alert(err.message);
      });
    }
    return () => {
      if (user) {
        user.chats.forEach((chat) => {
          socketApi.onLeaveChat({ chat_id: chat });
        });
        clearInterval(pingInterval);
        console.log("emit disconnected user");
        socket.emit("disconnect_event", { user_id: user.id });
      }
    };
  }, [user]);

  if (isAppLoading)
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-neutral-500">
        <div className="flex flex-col items-center gap-3">
          <Loader />
          <span className="text-2xl font-semibold dark:text-white">
            Wait...
          </span>
        </div>
      </div>
    );

  return <div {...props}></div>;
};

export default function App({ children }: { children: React.ReactNode }) {
  const { currTheme } = useAppStore();
  return (
    <html lang="en">
      <body
        className={`max-h-fit min-h-screen bg-cover bg-no-repeat ${
          currTheme === "LIGHT" ? "bg-image-light" : "bg-image-dark"
        }`}
      >
        <AppWrapper>
          <AppInner>
            <Header />
            <ToastContainer draggablePercent={60} />
            {children}
          </AppInner>
        </AppWrapper>
      </body>
    </html>
  );
}
