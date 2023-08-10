import { createUserSlice, UserSlice } from "./slices/createUserSlice";
import { createAppSlice, AppSlice } from "./slices/createAppSlice";
import { createOnlineUsers, OnlineUsersSlice } from "./slices/createOnlineUsersSlice";
import { create } from "zustand";

type StoreState = UserSlice & AppSlice & OnlineUsersSlice;

const useAppStore = create<StoreState>()((...a) => ({
  ...createUserSlice(...a),
  ...createAppSlice(...a),
  ...createOnlineUsers(...a),
}));

export default useAppStore;
