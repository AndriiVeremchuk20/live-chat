import { createUserSlice, UserSlice } from "./slices/createUserSlice";
import { create } from "zustand";

type StoreState = UserSlice;

const useAppStore = create<StoreState>()((...a) => ({
  ...createUserSlice(...a),
}));

export default useAppStore;
