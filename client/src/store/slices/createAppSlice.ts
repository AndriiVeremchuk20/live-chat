import LocalStorageKeys from "@/config/localStorageKeys";
import Theme from "@/types/theme.type";
import { StateCreator } from "zustand";

export interface AppSlice {
  isAppLoading: boolean;
  setAppStartLoading: () => void;
  setAppEndLoading: () => void;

  currTheme: Theme;
  setTheme: (theme: Theme) => void;
}

export const createAppSlice: StateCreator<AppSlice> = (set, get) => ({
  isAppLoading: true,
  setAppStartLoading: () => {
    set({ isAppLoading: true });
  },
  setAppEndLoading: () => {
    set({ isAppLoading: false });
  },

  currTheme: "LIGHT",
  setTheme: (theme: Theme) => {
    if (theme === get().currTheme) {
      return;
    }

    localStorage.setItem(LocalStorageKeys.Theme, theme);
    set({ currTheme: theme });
  },
});
