"use client";

import Alert from "@/components/Alert";

const VerifyEmail = () => {
  return (
    <div className="w-full mt-10 flex justify-center">
      <div className="w-fit">
        <Alert type="info" message="Please verify Your email." />
      </div>
    </div>
  );
};

export default VerifyEmail;
