"use client";

import Alert from "@/components/Alert";
import useAppStore from "@/store";
import { getAuth, sendEmailVerification } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { RiMailSendLine } from "react-icons/ri";

const VerifyEmail = () => {
  const { user } = useAppStore();
  const auth = getAuth();
  const router = useRouter();
  const [messageSended, setMessageSended] = useState<boolean>(false);

  const onSendMessageToEmailNow = useCallback(async () => {
    if (auth.currentUser) {
      if (!auth.currentUser.emailVerified) {
        await sendEmailVerification(auth.currentUser);
        setMessageSended(true);
      } else {
      }
    }
  }, [auth.currentUser]);

  const onBackClick = useCallback(() => {
    router.back();
  }, []);

  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center gap-4">
      <div className="w-fit">
        <Alert
          type="info"
          message={`Please verify Your email: ${user?.email}`}
        />
      </div>
      <div className="flex flex-col-reverse">
        <button
          onClick={onBackClick}
          className="mb-2 flex items-center justify-center rounded-lg border border-neutral-300 bg-violet-500 px-2 py-1 text-xl font-bold text-white hover:bg-violet-600 focus:outline-none focus:ring focus:ring-violet-300 active:bg-violet-700"
        >
          <IoMdArrowBack className="mx-1" /> <span>Back</span>
        </button>
        <button
          onClick={onSendMessageToEmailNow}
          className="mb-2 flex items-center rounded-lg border border-neutral-300 bg-violet-500 px-2 py-1 text-xl font-bold text-white hover:bg-violet-600 focus:outline-none focus:ring focus:ring-violet-300 active:bg-violet-700"
        >
          <RiMailSendLine className="mx-1" />{" "}
          <span>Send verification message</span>
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
