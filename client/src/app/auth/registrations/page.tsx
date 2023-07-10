"use client";

import { authApi } from "@/api/auth";
import Alert from "@/components/Alert";
import GoogleButton from "@/components/GoogleButton";
import routes from "@/config/appRoutes";
import { FirebaseError } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  deleteUser,
} from "firebase/auth";
import Link from "next/link";
import {useRouter} from "next/navigation";
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
	  router.push(routes.info.verifyemail)
    },
    onError: (err) => {
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
        formData.password
      );

      if (credentials && auth.currentUser) {
        // virification user email
        await sendEmailVerification(auth.currentUser);
        //alert("Check your email");

        //send user data to the server
        registrationsMutation.mutate({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          uid: auth.currentUser.uid,
        });
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/email-already-in-use":
            setError("root.firebaseErrror", {
              type: "FirebaseError",
              message: `Email ${formData} alredy exists.`,
            });
        }
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
    <div className="h-screen flex flex-row items-center justify-end bg-[url(/auth-bg.jpg)] bg-cover ">
      <div className="desktop:w-1/2 phone:w-full h-screen flex flex-col justify-center items-center bg-violet-400 bg-opacity-20">
        <form
          className="flex flex-col w-[400px] gap-3 px-2 text-xl bg-neutral-100 rounded-lg border-violet-300 border-[2px] shadow-md"
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
        >
          <span className="text-2xl font-bold text-center py-2 px-1 border-b-2 border-violet-300">
            Create your Account
          </span>
          <div className="flex flex-col mb-2">
            <label htmlFor="first_name" className="text-lg">
              First name:
            </label>
            <input
              type="text"
              id="first_name"
              placeholder="John"
              autoFocus
              className="w-full px-2 py-1 text-xl rounded-lg focus:outline-none border border-neutral-300 focus:ring focus:border-blue-500 focus:shadow-lg focus:duration-300"
              {...register("first_name", {
                required: "first name is required",
              })}
            />
          </div>

          <div className="flex flex-col mb-2">
            <label htmlFor="last_name" className="text-lg">
              Last name:
            </label>
            <input
              type="text"
              id="last_name"
              placeholder="Doe"
              className="w-full px-2 py-1 text-xl rounded-lg border border-neutral-300 focus:outline-none focus:ring focus:border-blue-500 focus:shadow-lg focus:duration-300"
              {...register("last_name", { required: "last name is required" })}
            />
          </div>

          <div className="flex flex-col mb-2">
            <label htmlFor="email" className="text-lg">
              Email:
            </label>
            <input
              type="email"
              id="email"
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
          <div className="flex flex-col mb-2">
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
