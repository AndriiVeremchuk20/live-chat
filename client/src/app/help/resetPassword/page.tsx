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
import {useSearchParams} from "next/navigation";
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
  
let oobCode = useSearchParams().get('oobCode'); 

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
		if(formData.password !== formData.confirm_password){
			return alert("passwords did not match.")
		}

		try{
		if(oobCode){
			await confirmPasswordReset(auth, oobCode, formData.confirm_password);
			alert("Password Changed")
		}
		else{
		alert("Something is wrong: Try again later");
		}
		}catch(e){console.log(e)}
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

useEffect(()=>{
	console.log(oobCode)
},[oobCode])

  return (
    <div className="h-screen flex flex-row items-center justify-end bg-[url(/auth-bg.jpg)] bg-cover ">
      <div className="desktop:w-1/2 phone:w-full h-screen flex flex-col justify-center items-center bg-violet-400 bg-opacity-20">
        <form
          className="flex flex-col w-[400px] gap-3 px-2 text-xl bg-neutral-100 rounded-lg border-violet-300 border-[2px] shadow-md"
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
        >
          <span className="text-2xl font-bold text-center py-2 px-1 border-b-2 border-violet-300">
            Reset Password
          </span>


          <div className="flex flex-col mb-2">
            <label htmlFor="password" className="text-lg">
              New Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="passowrd"
                placeholder="Your new password"
                className="w-full px-2 py-1 text-xl rounded-lg border border-neutral-300 focus:outline-none focus:ring focus:border-blue-500 focus:shadow-lg focus:duration-300"
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
          <div className="relative flex flex-col mb-2">
            <label htmlFor="rep_password" className="text-lg">
              Comfirm password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="rep_password"
                placeholder="Confirm passowrd"
                className="w-full px-2 py-1 text-xl rounded-lg border border-neutral-300 focus:outline-none focus:ring focus:border-blue-500 focus:shadow-lg focus:duration-300"
                {...register("confirm_password", {
                  required: "Password required",
                  minLength: { value: 6, message: "Min length password 6chr" },
                })}
              />
              <div
                className="absolute top-2 right-2"
                onClick={onChangePassvordVisibly}
              >
                {showPassword ? <BiShow /> : <BiHide />}
              </div>
            </div>
          </div>
          <button
            className=" mb-2 text-xl text-white rounded-lg border border-neutral-300 font-bold py-1 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300"
            type="submit"
          >
            Reset password
          </button>
          <div className="">
            { errors?.password ? (
              <div className="bg-red-500 flex justify-center text-neutral-200 font-bold rounded-t p-2 ">
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
