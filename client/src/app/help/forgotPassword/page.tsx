"use client";

import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, Resolver, SubmitHandler } from "react-hook-form";
import { BiErrorCircle } from "react-icons/bi";

type FormValues = {
  email: string;
};

const ForgotPassword = () => {
  const auth = getAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [sendedToEmail, setSendedToEmail] = useState<boolean>(false);

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    try {
      await sendPasswordResetEmail(auth, formData.email);
      setSendedToEmail(true);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex h-screen flex-row items-center justify-end bg-[url(/auth-bg.jpg)] bg-cover ">
      <div className="flex h-screen flex-col items-center justify-center bg-violet-400 bg-opacity-20 phone:w-full desktop:w-1/2">
        <form
          className="flex w-[400px] flex-col gap-3 rounded-lg border-[2px] border-violet-300 bg-neutral-100 px-2 text-xl shadow-md"
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
        >
          <span className="border-b-2 border-violet-300 px-1 py-2 text-center text-2xl font-bold">
            Forgot password
          </span>
          {sendedToEmail ? (
            <div>
              <span>Please check your email</span>
            </div>
          ) : (
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
                  required: "Email required",
                  pattern: {
                    value:
                      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
                    message: "Please enter valid email",
                  },
                })}
              />
            </div>
          )}
          <button
            className=" mb-2 rounded-lg border border-neutral-300 bg-violet-500 py-1 text-xl font-bold text-white hover:bg-violet-600 focus:outline-none focus:ring focus:ring-violet-300 active:bg-violet-700"
            type="submit"
          >
            Send
          </button>

          {errors?.email ? (
            <div className="flex items-center justify-center rounded-t border-x border-t border-red-600 bg-red-200 p-2 text-neutral-200">
              <BiErrorCircle className="text-red-600" />{" "}
              <span className="text-red-600">{errors.email.message}</span>
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
