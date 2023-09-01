import useAppStore from "@/store";
import { useCallback } from "react";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";

const SetTheme = () => {
  const { currTheme, setTheme, setUserTheme } = useAppStore();

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
        <MdDarkMode size={30} className="text-black" />
      ) : (
        <MdOutlineLightMode size={30} className="text-white" />
      )}
    </button>
  );
};

export default SetTheme;
