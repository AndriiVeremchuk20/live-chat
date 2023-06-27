import React from "react";

const Registrations = () => {
  return (
    <div className="h-screen flex flex-row items-center justify-end bg-[url(/auth-bg.jpg)] bg-cover ">
      <div className="w-1/2 h-screen flex flex-col justify-center items-center bg-violet-400 bg-opacity-20">
        <form className="flex flex-col gap-3 w-max text-xl bg-white bg-opacity-80 rounded-md border-violet-300 border-[2px] shadow-md">
        <span className="text-2xl font-bold py-2 px-1 border-b-2 border-violet-300">Registrations</span>
          <div className="flex justify-between">
            <label
              htmlFor="first_name"
              className=""
            >
              First name
            </label>
            <input
              type="text"
              id="first_name"
              className="w-full focus:outline-none focus:ring focus:border-blue-500 focus:shadow-lg"
            />
          </div>
          <label htmlFor="last_name">
            <span>Last name</span>
            <input type="text" id="last_name" />
          </label>
          <label htmlFor="email">
            <span>Email</span>
            <input type="email" id="email" />
          </label>
          <label htmlFor="password">
            <span>Password</span>
            <input type="password" id="password" />
          </label>
          <label htmlFor="rep_password">
            <span>Repeat password</span>
            <input type="password" id="rep_password" />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Registrations;
