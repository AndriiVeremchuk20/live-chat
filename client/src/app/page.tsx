"use client";

import userActions from "@/api/userActions";
import postsApi from "@/api/userActions/post";
import ChatList from "@/components/Chat/ChatList";
import routes from "@/config/appRoutes";
import useAppStore from "@/store";
import AppUser from "@/types/user.type";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";

const Home = () =>  {
  const { user } = useAppStore();
	
 const getPostsMutation = useMutation(postsApi.getPosts, {
	onSuccess: (data) => {
		console.log(data);
	},
	onError: (error) => {
		console.log(error)
	}
 });

 useEffect(()=>{
	if(user){
		getPostsMutation.mutate();
	}
 },[]);

  return (
    <div className="">
      <div>Text</div>
      <div></div>
    </div>
  );
}

export default Home;
