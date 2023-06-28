"use client"

import React, {useEffect} from "react";

const Registrations = () => {
  
  useEffect(() => {
    window.scrollTo({
      top: 100,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="h-screen flex flex-row items-center justify-end bg-[url(/auth-bg.jpg)] bg-cover ">
      <div className="w-1/2 h-screen flex flex-col justify-center items-center bg-violet-400 bg-opacity-20">
        <form
          className="flex flex-col w-[400px] gap-3 px-2 text-xl bg-neutral-100 rounded-lg border-violet-300 border-[2px] shadow-md"
          autoComplete="off"
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
              className="w-full px-2 py-1 text-xl rounded-lg focus:outline-none border border-neutral-300 focus:ring focus:border-blue-500 focus:shadow-lg"
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
              className="w-full px-2 py-1 text-xl rounded-lg border border-neutral-300 focus:outline-none focus:ring focus:border-blue-500 focus:shadow-lg"
            />
          </div>

          <div className="flex flex-col mb-2">
            <label htmlFor="email" className="text-lg">
              Email:
            </label>
            <input
              type="email"
              id="first_name"
              placeholder="example@mail.com"
              className="w-full px-2 py-1 text-xl rounded-lg border border-neutral-300 focus:outline-none focus:ring focus:border-blue-500 focus:shadow-lg"
            />
          </div>
          <div className="flex flex-col mb-2">
            <label htmlFor="password" className="text-lg">
              Password:
            </label>
            <input
              type="password"
              id="passowrd"
              placeholder="Your strong password"
              className="w-full px-2 py-1 text-xl rounded-lg border border-neutral-300 focus:outline-none focus:ring focus:border-blue-500 focus:shadow-lg"
            />
          </div>
          <div className="flex flex-col mb-2">
            <label htmlFor="rep_password" className="text-lg">
              Comfirm password:
            </label>
            <input
              type="text"
              id="rep_password"
              placeholder="Confirm passowrd"
              className="w-full px-2 py-1 text-xl rounded-lg border border-neutral-300 focus:outline-none focus:ring focus:border-blue-500 focus:shadow-lg"
            />
          </div>
          <button
            className=" mb-2 text-xl text-white rounded-lg border border-neutral-300 font-bold py-1 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300"
            type="submit"
          >
            Create account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registrations;
