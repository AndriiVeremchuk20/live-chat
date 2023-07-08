"use client";

import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, User } from "firebase/auth";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, Resolver, SubmitHandler } from "react-hook-form";
import {BiErrorCircle} from "react-icons/bi";

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
	try{
		await sendPasswordResetEmail(auth, formData.email);
		setSendedToEmail(true);

	}catch(e){
	console.log(e);
	}
  };

  return (
    <div className="h-screen flex flex-row items-center justify-end bg-[url(/auth-bg.jpg)] bg-cover ">
      <div className="desktop:w-1/2 phone:w-full h-screen flex flex-col justify-center items-center bg-violet-400 bg-opacity-20">
        <form
          className="flex flex-col w-[400px] gap-3 px-2 text-xl bg-neutral-100 rounded-lg border-violet-300 border-[2px] shadow-md"
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
        >
          <span className="text-2xl font-bold text-center py-2 px-1 border-b-2 border-violet-300">
            Forgot password
          </span>
		{sendedToEmail? <div>
			<span>Please check your email</span>
		</div> :
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
                required: "Email required",
                pattern: {
                  value:
                    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
                  message: "Please enter valid email",
                },
              })}
            />
          </div>}
          <button
            className=" mb-2 text-xl text-white rounded-lg border border-neutral-300 font-bold py-1 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300"
            type="submit"
          >
            Send
          </button>

          {errors?.email ? (
            <div className="bg-red-200 flex justify-center items-center text-neutral-200 rounded-t p-2 border-t border-x border-red-600">
              <BiErrorCircle className="text-red-600" /> <span className="text-red-600">{errors.email.message}</span>
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
