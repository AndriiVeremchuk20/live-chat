"use client";

import { authApi } from "@/api/auth";
import GoogleButton from "@/components/GoogleButton";
import routes from "@/config/appRoutes";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  confirmPasswordReset,
} from "firebase/auth";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BiShow, BiHide } from "react-icons/bi";
import { useMutation } from "react-query";

type FormValues = {
  password: string;
  confirm_password: string;
};

const ResetPassword = () => {
  const auth = getAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  let oobCode = useSearchParams().get("oobCode");

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    if (formData.password !== formData.confirm_password) {
      return alert("passwords did not match.");
    }

    try {
      if (oobCode) {
        await confirmPasswordReset(auth, oobCode, formData.confirm_password);
        alert("Password Changed");
      } else {
        alert("Something is wrong: Try again later");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onChangePassvordVisibly = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 100,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    console.log(oobCode);
  }, [oobCode]);

  return (
    <div className="flex h-screen flex-row items-center justify-end bg-[url(/auth-bg.jpg)] bg-cover ">
      <div className="flex h-screen flex-col items-center justify-center bg-violet-400 bg-opacity-20 phone:w-full desktop:w-1/2">
        <form
          className="flex w-[400px] flex-col gap-3 rounded-lg border-[2px] border-violet-300 bg-neutral-100 px-2 text-xl shadow-md"
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
        >
          <span className="border-b-2 border-violet-300 px-1 py-2 text-center text-2xl font-bold">
            Reset Password
          </span>

          <div className="mb-2 flex flex-col">
            <label htmlFor="password" className="text-lg">
              New Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="passowrd"
                placeholder="Your new password"
                className="w-full rounded-lg border border-neutral-300 px-2 py-1 text-xl focus:border-blue-500 focus:shadow-lg focus:outline-none focus:ring focus:duration-300"
                {...register("password", {
                  required: "Password required",
                  minLength: { value: 6, message: "Min length password 6chr" },
                })}
              />
              <div
                onClick={onChangePassvordVisibly}
                className="absolute right-2 top-2"
              >
                {showPassword ? <BiShow /> : <BiHide />}
              </div>
            </div>
          </div>
          <div className="relative mb-2 flex flex-col">
            <label htmlFor="rep_password" className="text-lg">
              Comfirm password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="rep_password"
                placeholder="Confirm passowrd"
                className="w-full rounded-lg border border-neutral-300 px-2 py-1 text-xl focus:border-blue-500 focus:shadow-lg focus:outline-none focus:ring focus:duration-300"
                {...register("confirm_password", {
                  required: "Password required",
                  minLength: { value: 6, message: "Min length password 6chr" },
                })}
              />
              <div
                className="absolute right-2 top-2"
                onClick={onChangePassvordVisibly}
              >
                {showPassword ? <BiShow /> : <BiHide />}
              </div>
            </div>
          </div>
          <button
            className=" mb-2 rounded-lg border border-neutral-300 bg-violet-500 py-1 text-xl font-bold text-white hover:bg-violet-600 focus:outline-none focus:ring focus:ring-violet-300 active:bg-violet-700"
            type="submit"
          >
            Reset password
          </button>
          <div className="">
            {errors?.password ? (
              <div className="flex justify-center rounded-t bg-red-500 p-2 font-bold text-neutral-200 ">
                {errors.password.message}
              </div>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
