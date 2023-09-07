"use client";

import { authApi } from "@/api/auth";
import Alert from "@/components/Alert";
import GoogleButton from "@/components/GoogleButton";
import routes from "@/config/appRoutes";
import useAppStore from "@/store";
import { FirebaseError } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  deleteUser,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BiShow, BiHide } from "react-icons/bi";
import { useMutation } from "react-query";

type FormValues = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
};

const Registrations = () => {
  const auth = getAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { setAppEndLoading, setAppStartLoading } = useAppStore();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>();
  const router = useRouter();

  const registrationsMutation = useMutation(authApi.registrations, {
    onSuccess: (data) => {
      console.log(data);
      setAppEndLoading();
      router.push(routes.info.verifyemail);
    },
    onError: (err) => {
      setAppEndLoading();
      console.error(err);
      setError("root.serverError", {
        type: "ServerError",
        message: "Somethint wrong try again.",
      });

      // delete user accoutn if mutation throw error
      if (auth.currentUser) {
        deleteUser(auth.currentUser);
      }
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    //console.log(data);
    if (formData.password !== formData.confirm_password) {
      return setError("confirm_password", {
        message: "Passwords did not match",
      });
    }

    try {
      const credentials = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );

      if (credentials && auth.currentUser) {
        // virification user email
        await sendEmailVerification(auth.currentUser);
        //alert("Check your email");

        //send user data to the server
        setAppStartLoading();
        registrationsMutation.mutate({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          uid: auth.currentUser.uid,
        });
      }
    } catch (error) {
      setAppEndLoading();
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/email-already-in-use":
            setError("root.firebaseError", {
              type: "FirebaseError",
              message: `Email ${formData.email} alredy exists.`,
            });
        }
      } else {
        console.log(error);
      }
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

  return (
    <div className="flex h-screen flex-row items-center justify-end bg-[url(/auth-bg.jpg)] bg-cover ">
      <div className="flex h-screen flex-col items-center justify-center bg-violet-700 bg-opacity-50 phone:w-full desktop:w-1/2">
        <form
          className="flex w-[400px] flex-col gap-3 rounded-lg border-[2px] border-violet-300 bg-neutral-100 px-2 text-xl shadow-md"
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
        >
          <span className="border-b-2 border-violet-300 px-1 py-2 text-center text-2xl font-bold">
            Create your Account
          </span>
          <div className="mb-2 flex flex-col">
            <label htmlFor="first_name" className="text-lg">
              First name:
            </label>
            <input
              type="text"
              id="first_name"
              placeholder="John"
              autoFocus
              className="w-full rounded-lg border border-neutral-300 px-2 py-1 text-xl focus:border-blue-500 focus:shadow-lg focus:outline-none focus:ring focus:duration-300"
              {...register("first_name", {
                required: "first name is required",
              })}
            />
          </div>

          <div className="mb-2 flex flex-col">
            <label htmlFor="last_name" className="text-lg">
              Last name:
            </label>
            <input
              type="text"
              id="last_name"
              placeholder="Doe"
              className="w-full rounded-lg border border-neutral-300 px-2 py-1 text-xl focus:border-blue-500 focus:shadow-lg focus:outline-none focus:ring focus:duration-300"
              {...register("last_name", { required: "last name is required" })}
            />
          </div>

          <div className="mb-2 flex flex-col">
            <label htmlFor="email" className="text-lg">
              Email:
            </label>
            <input
              type="email"
              id="email"
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
          <div className="mb-2 flex flex-col">
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
            Create account
          </button>
          <div className="">
            {errors?.first_name?.message ? (
              <Alert type="error" message={errors.first_name.message} />
            ) : errors?.last_name?.message ? (
              <Alert type="error" message={errors.last_name.message} />
            ) : errors?.email?.message ? (
              <Alert type="error" message={errors.email.message} />
            ) : errors?.password?.message ? (
              <Alert type="error" message={errors.password.message} />
            ) : errors.confirm_password?.message ? (
              <Alert type="error" message={errors.confirm_password.message} />
            ) : errors?.root?.serverError?.message ? (
              <Alert type="error" message={errors.root.serverError.message} />
            ) : errors?.root?.firebaseError?.message ? (
              <Alert type="error" message={errors.root.firebaseError.message} />
            ) : null}
          </div>
          <div className="flex flex-col text-lg">
            <span>Do you have account?</span>
            <span>
              Please{" "}
              <Link
                href={routes.auth.login}
                className="text-blue-600 underline hover:text-blue-300"
              >
                Login
              </Link>
            </span>
          </div>
          <GoogleButton />
        </form>
      </div>
    </div>
  );
};

export default Registrations;
