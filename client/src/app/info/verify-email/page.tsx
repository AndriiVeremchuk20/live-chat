"use client";

import Alert from "@/components/Alert";
import useAppStore from "@/store";
import { getAuth, sendEmailVerification } from "firebase/auth";
import {useRouter} from "next/navigation";
import { useCallback, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { RiMailSendLine } from "react-icons/ri";

const VerifyEmail = () => {
  const { user } = useAppStore();
  const auth = getAuth();
  const router = useRouter();
  const [messageSended, setMessageSended] = useState<boolean>(false);

  const onSendMessageToEmailNow = useCallback(async() => {
    if (auth.currentUser) {
      if (!auth.currentUser.emailVerified) {
        await sendEmailVerification(auth.currentUser);
		setMessageSended(true)
      } else {
		
      }
    }
  }, [auth.currentUser]);

  const onBackClick = useCallback(()=>{
	router.back();
  },[]) 

  return (
    <div className="w-full mt-10 flex flex-col items-center justify-center gap-4">
      <div className="w-fit">
        <Alert type="info" message={`Please verify Your email: ${user?.email}`} />
      </div>
      <div className="flex flex-col-reverse">
        <button onClick={onBackClick} className="flex justify-center items-center mb-2 px-2 text-xl text-white rounded-lg border border-neutral-300 font-bold py-1 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300">
          <IoMdArrowBack className="mx-1" /> <span>Back</span>
        </button>
        <button onClick={onSendMessageToEmailNow} className="flex items-center mb-2 px-2 text-xl text-white rounded-lg border border-neutral-300 font-bold py-1 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300">
          <RiMailSendLine className="mx-1" />{" "}
          <span>Send verification message</span>
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
