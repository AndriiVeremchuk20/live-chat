"use client";

import userActions from "@/api/userActions";
import ChatList from "@/components/Chat/ChatList";
import routes from "@/config/appRoutes";
import useAppStore from "@/store";
import AppUser from "@/types/user.type";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";

export default function Home() {
  const { user } = useAppStore();

  return (
    <div className="">
      <div>Text</div>
      <div></div>
    </div>
  );
}
