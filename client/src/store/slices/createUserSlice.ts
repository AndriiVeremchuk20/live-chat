import Profile from "@/types/profile.type";
import Theme from "@/types/theme.type";
import AppUser from "@/types/user.type";
import { StateCreator } from "zustand";

export interface UserSlice {
  user: AppUser | null;
  setUser: (user: AppUser) => void;
  setIsOnline: (isOnline: boolean) => void;
  deleteUser: () => void;
}

export const createUserSlice: StateCreator<UserSlice> = (set, get) => ({
  user: null,
  setUser: (user: AppUser) => {
    set({ user });
  },
  setIsOnline: (isOnline: boolean) => {
    const user = get().user;
    if (user) {
      set({ user: { ...user, isOnline } });
    }
  },
  deleteUser: () => {
    set({ user: null });
  },
});
