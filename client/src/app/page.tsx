"use client";

import userActions from "@/api/userActions";
import Header from "@/components/Header";
import routes from "@/config/appRoutes";
import useAppStore from "@/store";
import AppUser from "@/types/user.type";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";

export default function Home() {
  const { user } = useAppStore();
  const [userRecommendations, setUserRecommendations] = useState<
    Array<AppUser>
  >([]);

  const getUserRecommendatinosMutation = useMutation(
    userActions.getUserRecommendations,
    {
      onSuccess(data) {
        setUserRecommendations(data.data);
      },
      onError(error) {
        console.log(error);
      },
    },
  );

  useEffect(() => {
    if (user) {
      getUserRecommendatinosMutation.mutate();
    }
  }, [user]);

  if (!user) {
    return <div>Text for guest</div>;
  }

  return (
    <div className="">
      <div>Text</div>
      <div>
        {userRecommendations.map((item) => (
          <Link key={item.id} href={routes.profile.userProfile(item.id)}>
            {item.first_name}
          </Link>
        ))}
      </div>
    </div>
  );
}
