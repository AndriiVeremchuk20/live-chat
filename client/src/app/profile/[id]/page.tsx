"use client"

import UserAvatar from "@/components/UserAvatar";
import {useEffect} from "react";

const ProfilePage = ({params}: {params: {id: string}}) => {
	return <div className=" flex flex-col">
		
		<div>
			<UserAvatar size={200}/>
		</div>
		{params.id? "Text" : "ddd"}
	</div>
}

export default ProfilePage;
