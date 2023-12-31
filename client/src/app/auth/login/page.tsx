"use client";

import { authApi } from "@/api/auth";
import Alert from "@/components/Alert";
import GoogleButton from "@/components/GoogleButton";
import routes from "@/config/appRoutes";
import useAppStore from "@/store";
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
  const { setAppStartLoading, setAppEndLoading } = useAppStore();

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
      setAppEndLoading();
      router.push(routes.home);
    },
    onError(error) {
      console.log(error);
      setAppEndLoading();
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
        data.password,
      );
      if (!auth.currentUser?.emailVerified) {
        router.push(routes.info.verifyemail);
      } else {
        setAppStartLoading();
        authMutation.mutate();
      }
      console.log(credential);
    } catch (error) {
      setAppEndLoading();
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/user-not-found":
            setError("root.firebaseError", {
              type: "firebase",
              message: `User with email ${data.email} not found`,
            });
            break;
          case "auth/wrong-password":
            setError("root.firebaseError", {
              type: "firebase",
              message: `Wrong password`,
            });
            break;
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
    <div className="flex h-screen flex-row items-center justify-end bg-[url(/auth-bg.jpg)] bg-cover ">
      <div className="flex h-screen flex-col items-center justify-center bg-violet-400 bg-opacity-20 phone:w-full desktop:w-1/2">
        <form
          className="flex w-[400px] flex-col gap-3 rounded-lg border-[2px] border-violet-300 bg-neutral-100 px-2 text-xl shadow-md"
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
        >
          <span className="border-b-2 border-violet-300 px-1 py-2 text-center text-2xl font-bold">
            Sign in
          </span>

          <div className="mb-2 flex flex-col">
            <label htmlFor="email" className="text-lg">
              Email:
            </label>
            <input
              type="email"
              id="first_name"
              autoFocus
              placeholder="example@mail.com"
              className="w-full rounded-lg border border-neutral-300 px-2 py-1 text-xl focus:border-blue-500 focus:shadow-lg focus:outline-none focus:ring focus:duration-300"
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
          <div className="relative mb-2 flex flex-col">
            <label htmlFor="password" className="text-lg">
              Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="passowrd"
                placeholder="Your strong password"
                className="w-full rounded-lg border border-neutral-300 px-2 py-1 text-xl focus:border-blue-500 focus:shadow-lg focus:outline-none focus:ring focus:duration-300"
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
            className=" mb-2 rounded-lg border border-neutral-300 bg-violet-500 py-1 text-xl font-bold text-white hover:bg-violet-600 focus:outline-none focus:ring focus:ring-violet-300 active:bg-violet-700"
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
          <div className="my-2 flex justify-center">
            <Link
              href={routes.help.forgotPassword}
              className=" text-blue-600 underline hover:text-blue-300 "
            >
              Forgot password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
