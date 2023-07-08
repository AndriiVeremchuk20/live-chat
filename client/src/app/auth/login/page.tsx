"use client";

import { authApi } from "@/api/auth";
import Alert from "@/components/Alert";
import GoogleButton from "@/components/GoogleButton";
import routes from "@/config/appRoutes";
import useAppStore from "@/store";
import AppUser from "@/types/user.type";
import { FirebaseError } from "firebase/app";

import { getAuth, signInWithEmailAndPassword, User } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, Resolver, SubmitHandler } from "react-hook-form";
import { BiShow, BiHide } from "react-icons/bi";
import { useMutation } from "react-query";

type FormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const auth = getAuth();
  const { setUser } = useAppStore();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const {
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const router = useRouter();

  const authMutation = useMutation(authApi.auth, {
    onSuccess(responseData) {
      console.log(responseData);
      setUser(responseData.data);
    },
    onError(error) {
      console.log(error);
      setError("root.serverError", {
        type: "server",
        message: "Something wrong, try again.",
      });
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log(data);
    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      if (!auth.currentUser?.emailVerified) {
        router.push(routes.info.verifyemail);
      } else {
        authMutation.mutate();
        router.push(routes.home);
      }
      console.log(credential);
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/user-not-found")
          setError("root.firebaseError", {
            type: "firebase",
            message: `User with email ${data.email} not found`,
          });

		else if(error.code === "auth/wrong-password"){
          setError("root.firebaseError", {
            type: "firebase",
            message: `Wrong password`,
          });
		}
      }

      console.error(error);
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
            {errors?.email?.message ? (
              <Alert type="error" message={errors.email.message} />
            ) : errors?.password?.message ? (
              <Alert type="error" message={errors.password.message} />
            ) : errors.root?.serverError?.message ? (
              <Alert type="error" message={errors.root.serverError.message} />
            ) : errors.root?.firebaseError?.message ? (
              <Alert type="error" message={errors.root.firebaseError.message} />
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
