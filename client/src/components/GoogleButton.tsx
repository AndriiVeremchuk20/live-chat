import { FcGoogle } from "react-icons/fc";

const GoogleButton = () => {
  return (
    <button className="w-full py-2 my-2 flex justify-center border-y-2 border-violet-300 items-center gap-3 hover:border-violet-200 focus:border-violet-200" type="button">
      <FcGoogle size={30} /> <span>Sign in with google</span>
    </button>
  );
};

export default GoogleButton;
