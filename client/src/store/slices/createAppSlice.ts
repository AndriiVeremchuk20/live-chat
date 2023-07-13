import {StateCreator} from "zustand";

export type Theme="light"|"dark";
const LocalStorageKey = "@@/Theme";

export interface AppSlice {
	isAppLoading: boolean;
	setAppStartLoading: ()=>void;
	setAppEndLoading: ()=>void;

	currTheme: Theme;
	setTheme: (theme: Theme)=>void;
	
}

export const createAppSlice:  StateCreator<AppSlice> = (set, get) => ({
	isAppLoading: false,
	setAppStartLoading: () => {
		set({isAppLoading: true});
	},
	setAppEndLoading: ()=>{
		set({isAppLoading: false})
	},

	currTheme: localStorage.getItem(LocalStorageKey)?localStorage.getItem(LocalStorageKey) as Theme : "light",
	setTheme: (theme: Theme)=>{
		if(theme === get().currTheme){
			return;
		}

		localStorage.setItem(LocalStorageKey, theme);
		set({currTheme: theme});
	}
})
