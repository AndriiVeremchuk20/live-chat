import React from "react";
import { BiInfoCircle, BiErrorCircle } from "react-icons/bi";
import { AiOutlineWarning } from "react-icons/ai";

type AlertType = "info" | "warning" | "error";

interface PropAlert {
  type: AlertType;
  message: string;
}

const Alert: React.FC<PropAlert> = ({ type, message }) => {
  if (type === "info") {
    return (
      <div className="m-1 flex w-full items-center justify-start rounded-lg border-2 border-blue-800 bg-blue-100 p-1 text-blue-800">
        <BiInfoCircle size={25} className="mx-1" />{" "}
        <span className="text-lg">{message}</span>
      </div>
    );
  } else if (type === "error") {
    return (
      <div className="m-1 flex w-full items-center justify-start rounded-lg border-2 border-red-800 bg-red-100 p-1 text-red-800 dark:bg-inherit">
        <BiErrorCircle size={25} className="mx-1" />{" "}
        <span className="text-lg">{message}</span>
      </div>
    );
  } else {
    return (
      <div className="m-1 flex w-full items-center justify-start rounded-lg border-2 border-yellow-800 bg-yellow-100 p-1 text-yellow-800">
        <AiOutlineWarning size={25} className="mx-1" />{" "}
        <span className="text-lg">{message}</span>
      </div>
    );
  }
};

export default Alert;
