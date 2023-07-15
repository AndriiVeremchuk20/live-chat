import LocalStorageKeys from "@/config/localStorageKeys";
import useAppStore from "@/store";
import { useCallback, useEffect } from "react";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";

const SetTheme = () => {
  const { currTheme, setTheme } = useAppStore();

  const onChangeThemeClick = useCallback(() => {
    switch (currTheme) {
      case "light":
        setTheme("dark");
        document.documentElement.classList.add("dark");
        break;
      case "dark":
        setTheme("light");
        document.documentElement.classList.remove("dark");
        break;
    }
  }, [currTheme]);

  return (
    <button onClick={onChangeThemeClick} className="">
      {currTheme === "light" ? (
        <MdDarkMode size={30} />
      ) : (
        <MdOutlineLightMode size={30} />
      )}
    </button>
  );
};

export default SetTheme;
