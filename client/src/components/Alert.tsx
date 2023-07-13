import React from "react";
import { BiInfoCircle, BiErrorCircle } from "react-icons/bi";
import {AiOutlineWarning} from "react-icons/ai";

type AlertType = "info" | "warning" | "error";

interface PropAlert {
  type: AlertType;
  message: string;
}

const Alert: React.FC<PropAlert> = ({ type, message }) => {
  if (type === "info") {
    return (
      <div className="w-full m-1 flex justify-start items-center border-2 border-blue-800 rounded-lg bg-blue-100 text-blue-800 p-1">
        <BiInfoCircle size={25} className="mx-1"/> <span className="text-lg">{message}</span>
      </div>
    );
  }
  
  else if (type === "error") {
    return (
      <div className="w-full m-1 flex justify-start items-center border-2 border-red-800 rounded-lg bg-red-100 text-red-800 p-1">
        <BiErrorCircle size={25} className="mx-1"/> <span className="text-lg">{message}</span>
      </div>
    );
  }

  else {
    return (
      <div className="w-full m-1 flex justify-start items-center border-2 border-yellow-800 rounded-lg bg-yellow-100 text-yellow-800 p-1">
        <AiOutlineWarning size={25} className="mx-1"/> <span className="text-lg">{message}</span>
      </div>
    );
  }
};

export default Alert;
