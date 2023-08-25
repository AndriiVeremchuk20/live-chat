import { createUserSlice, UserSlice } from "./slices/createUserSlice";
import { createAppSlice, AppSlice } from "./slices/createAppSlice";
import {
  createOnlineUsers,
  OnlineUsersSlice,
} from "./slices/createOnlineUsersSlice";
import { create } from "zustand";
import {
  createReplyMessageSlice,
  ReplyMessageSlice,
} from "./slices/createReplyMessageSlice";

type StoreState = UserSlice & AppSlice & OnlineUsersSlice & ReplyMessageSlice;

const useAppStore = create<StoreState>()((...a) => ({
  ...createUserSlice(...a),
  ...createAppSlice(...a),
  ...createOnlineUsers(...a),
  ...createReplyMessageSlice(...a),
}));

export default useAppStore;
