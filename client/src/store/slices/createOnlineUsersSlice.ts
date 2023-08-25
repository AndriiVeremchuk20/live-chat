import { StateCreator } from "zustand";

export interface OnlineUsersSlice {
  onlineUsers: Array<string>;
  setOnlineUsers: (onlineUsers: Array<string>) => void;
}

export const createOnlineUsers: StateCreator<OnlineUsersSlice> = (
  set,
  get,
) => ({
  onlineUsers: [],
  setOnlineUsers: (onlineUsers: Array<string>) => {
    set({ onlineUsers });
  },
});
