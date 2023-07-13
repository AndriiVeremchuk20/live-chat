import { createUserSlice, UserSlice } from "./slices/createUserSlice";
import { createAppSlice, AppSlice } from "./slices/createAppSlice";
import { create } from "zustand";

type StoreState = UserSlice & AppSlice;

const useAppStore = create<StoreState>()((...a) => ({
  ...createUserSlice(...a),
  ...createAppSlice(...a),
}));

export default useAppStore;
