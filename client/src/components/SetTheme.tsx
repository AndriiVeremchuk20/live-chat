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

  useEffect(() => {
    const localStorageValue = localStorage.getItem(LocalStorageKeys.Theme);

    console.log(localStorageValue);

    if (localStorageValue && localStorageValue === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
      return;
    }

    setTheme("light");
    document.documentElement.classList.remove("dark");
  }, []);

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
