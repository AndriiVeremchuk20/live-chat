import React from "react";

const Registrations = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-700 via-purple-900 to-pink-700">
      <div className="w-fit h-fit bg-neutral-200 bg-opacity-40 rounded-sm">
		<span className="text-2xl font-bold py-2 px-1">Registrations</span>
        <form className="flex flex-col gap-2">
          <label htmlFor="first_name" className="flex">
            <span>First name</span>
			<input type="text" id="first_name" />
          </label>
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

