import { createUserSlice, UserSlice } from "./slices/createUserSlice";
import { createLoadingSlice, LoadingSlice } from "./slices/createLoadindSlice";
import { create } from "zustand";

type StoreState = UserSlice & LoadingSlice;

const useAppStore = create<StoreState>()((...a) => ({
  ...createUserSlice(...a),
  ...createLoadingSlice(...a),
}));

export default useAppStore;
