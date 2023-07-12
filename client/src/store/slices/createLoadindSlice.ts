import {StateCreator} from "zustand";

export interface LoadingSlice {
	isLoading: boolean;
	setStartLoading: ()=>void;
	setEndLoading: ()=>void;
}

export const createLoadingSlice:  StateCreator<LoadingSlice> = (set) => ({
	isLoading: false,
	setStartLoading: () => {
		set({isLoading: true});
	},
	setEndLoading: ()=>{
		set({isLoading: false})
	}
})
