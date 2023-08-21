import { useEffect } from "react";

interface ParamsUseOutsideClick {
  ref: any;
  onOutsideClick: () => void;
}

//https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
const useOutsideClick = ({ ref, onOutsideClick }: ParamsUseOutsideClick) => {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutsideClick();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
};

export default useOutsideClick;
