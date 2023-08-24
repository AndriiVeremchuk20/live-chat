import LocalStorageKeys from "@/config/localStorageKeys";
import useAppStore from "@/store";
import { useCallback, useEffect } from "react";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import { useMutation } from "react-query";
import userActionsApi from "@/api/userActions";

const SetTheme = () => {
  const { user, currTheme, setTheme, setUserTheme } = useAppStore();

  const onChangeThemeClick = useCallback(() => {
    switch (currTheme) {
      case "LIGHT":
        setTheme("DARK");
        document.documentElement.classList.add("dark");
        break;
      case "DARK":
        setTheme("LIGHT");
        document.documentElement.classList.remove("dark");
        break;
    }
  }, [currTheme]);

  return (
    <button onClick={onChangeThemeClick} className="">
      {currTheme === "LIGHT" ? (
        <MdDarkMode size={30} />
      ) : (
        <MdOutlineLightMode size={30} />
      )}
    </button>
  );
};

export default SetTheme;
