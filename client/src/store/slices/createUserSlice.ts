import AppUser from "@/types/user.type";
import {StateCreator} from "zustand";

export interface UserSlice {
user: AppUser|null;
setUser: (user: AppUser)=>void;
deleteUser: ()=>void;
}

export const createUserSlice:  StateCreator<UserSlice> = (set) => ({
	user: null,
	setUser: (user: AppUser) => {
		set({user});
	},
	deleteUser: ()=>{
		set({user: null})
	}
})
