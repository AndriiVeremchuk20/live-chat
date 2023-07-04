"use client";

import GoogleButton from "@/components/GoogleButton";
import routes from "@/config/appRoutes";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import {useRouter} from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, Resolver, SubmitHandler } from "react-hook-form";
import { BiShow, BiHide } from "react-icons/bi";

type FormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const auth = getAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
	
	const router = useRouter();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log(data);
    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

	  if(!auth.currentUser?.emailVerified){
			router.push(routes.info.verifyemail);
	  }
	  console.log(credential);
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeVisiblyPasswordClick = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 100,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="h-screen flex flex-row items-center justify-end bg-[url(/auth-bg.jpg)] bg-cover ">
      <div className="desktop:w-1/2 phone:w-full h-screen flex flex-col justify-center items-center bg-violet-400 bg-opacity-20">
        <form
          className="flex flex-col w-[400px] gap-3 px-2 text-xl bg-neutral-100 rounded-lg border-violet-300 border-[2px] shadow-md"
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
        >
          <span className="text-2xl font-bold text-center py-2 px-1 border-b-2 border-violet-300">
            Sign in
          </span>

          <div className="flex flex-col mb-2">
            <label htmlFor="email" className="text-lg">
              Email:
            </label>
            <input
              type="email"
              id="first_name"
              autoFocus
              placeholder="example@mail.com"
              className="w-full px-2 py-1 text-xl rounded-lg border border-neutral-300 focus:outline-none focus:ring focus:border-blue-500 focus:shadow-lg focus:duration-300"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value:
                    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
                  message: "Please enter valid email",
                },
              })}
            />
          </div>
          <div className="relative flex flex-col mb-2">
            <label htmlFor="password" className="text-lg">
              Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="passowrd"
                placeholder="Your strong password"
                className="w-full px-2 py-1 text-xl rounded-lg border border-neutral-300 focus:outline-none focus:ring focus:border-blue-500 focus:shadow-lg focus:duration-300"
                {...register("password", {
                  required: "Password required",
                  minLength: { value: 6, message: "Min length 6chr" },
                })}
              />
              <div
                className="absolute right-2 top-2"
                onClick={onChangeVisiblyPasswordClick}
              >
                {showPassword ? <BiShow /> : <BiHide />}
              </div>
            </div>
          </div>
          <button
            className=" mb-2 text-xl text-white rounded-lg border border-neutral-300 font-bold py-1 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300"
            type="submit"
          >
            Sign in
          </button>
          <div className="">
            {errors?.email ? (
              <div className="bg-red-500 flex justify-center text-neutral-200 font-bold rounded-t p-2 ">
                {errors.email.message}
              </div>
            ) : errors?.password ? (
              <div className="bg-red-500 flex justify-center text-neutral-200 font-bold rounded-t p-2 ">
                {errors.password.message}
              </div>
            ) : null}
          </div>
          <div className="flex flex-col text-lg">
            <span>You don't have an account?</span>
            <span>
              Please{" "}
              <Link
                href={routes.auth.registrations}
                className="text-blue-600 underline hover:text-blue-300"
              >
                Register
              </Link>
            </span>
          </div>
          <GoogleButton />
        </form>
      </div>
    </div>
  );
};

export default Login;
