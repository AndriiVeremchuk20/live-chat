"use client";

import withAuth from "@/hooks/withAuth";
import { useForm } from "react-hook-form";
import { countries, getEmojiFlag } from "countries-list";
import getCounryList from "@/utils/getCountryList";
import useAppStore from "@/store";

type FormValues = {
  first_name: string;
  last_name: string;
  age: number;
  country: string;
  gender: number;
  partner_gender: number;
  about_self: string;
  about_partner: string;
};

const CompleteProfile = () => {
  const { register } = useForm<FormValues>();
  const { user } = useAppStore();

  return (
    <div>
      <div className="flex justify-center">
        <form className="my-10 mx-1 desktop:w-1/2  phone:w-full border-2 border-violet-200 p-4 rounded-lg bg-neutral-50">
          <div className="text-2xl flex justify-center items-center border-b-2 border-violet-200 mb-3">
            <span>Complete Your Profile</span>
          </div>
          <div>{/*add upload avatar form*/}</div>
          <div className="w-full flex desktop:flex-row desktop:gap-4 phone:flex-col">
            <div className="w-full flex flex-col mb-2">
              <label htmlFor="first_name" className="text-lg">
                First name:
              </label>
              <input
                type="text"
                id="first_name"
                value={user?.first_name ? user.first_name : ""}
                autoFocus
                placeholder="Your name :)"
                className="w-full px-2 py-1 text-xl rounded-lg border border-neutral-300 focus:outline-none focus:ring focus:border-blue-500 focus:shadow-lg focus:duration-300"
                {...register("first_name", {
                  required: "First name is required",
                })}
              />
            </div>
            <div className="w-full flex flex-col mb-2">
              <label htmlFor="last_name" className="text-lg">
                Last name:
              </label>
              <input
                type="text"
                id="last_name"
                value={user?.last_name ? user.last_name : ""}
                autoFocus
                placeholder="Your last name :)"
                className="w-full px-2 py-1 text-xl rounded-lg border border-neutral-300 focus:outline-none focus:ring focus:border-blue-500 focus:shadow-lg focus:duration-300"
                {...register("last_name", {
                  required: "Last name is required",
                })}
              />
            </div>
          </div>
          <div className="flex flex-col mb-2">
            <label htmlFor="first_name" className="text-lg">
              Age:
            </label>
            <input
              type="number"
              id="age"
              autoFocus
              placeholder="Your age."
              className="w-full px-2 py-1 text-xl rounded-lg border border-neutral-300 focus:outline-none focus:ring focus:border-blue-500 focus:shadow-lg focus:duration-300"
              {...register("age", {
                required: "Age is required",
              })}
            />
          </div>

<div className="w-full flex desktop:flex-row desktop:gap-4 phone:flex-col">
          <div className="w-full flex flex-col mb-2">
            <label htmlFor="gender" className="text-lg">
              Gender:
            </label>
            <select
              id="gender"
              autoFocus
              className="w-full px-2 py-1 text-xl rounded-lg border border-neutral-300 focus:outline-none focus:ring focus:border-blue-500 focus:shadow-lg focus:duration-300"
              {...register("gender", {
                required: "Sex is required",
              })}
            >
              <option hidden>Choose your gender ⚥</option>
              <option value={1}>Male</option>
              <option value={0}>Female</option>
              <option value={2}>Gender binary</option>
            </select>
          </div>

          <div className="w-full flex flex-col mb-2">
            <label htmlFor="partner_gender" className="text-lg">
              Partner gender:
            </label>
            <select
              id="partner_gender"
              autoFocus
              className="w-full px-2 py-1 text-xl rounded-lg border border-neutral-300 focus:outline-none focus:ring focus:border-blue-500 focus:shadow-lg focus:duration-300"
              {...register("partner_gender", {
                required: "Partner gender is required",
              })}
            >
              <option hidden>Choose partner gender ⚥</option>
              <option value={1}>Male</option>
              <option value={0}>Female</option>
              <option value={2}>Gender binary</option>
            </select>
          </div>
</div>
          <div>
            <div className="flex flex-col mb-2">
              <label htmlFor="country" className="text-lg">
                Country:
              </label>
              <select
                id="country"
                placeholder="Your name :)"
                className="w-full px-2 py-1 text-xl rounded-lg border border-neutral-300 focus:outline-none focus:ring focus:border-blue-500 focus:shadow-lg focus:duration-300"
                {...register("country", {
                  required: "Country name is required",
                })}
              >
                <option>Select your country 🌐 </option>
                {getCounryList().map((country) => (
                  <option
                    key={country.code}
                    value={country.code}
                  >{`${country.emoji} ${country.name}`}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col mb-2">
              <label htmlFor="about_self" className="text-lg">
                About You:
              </label>
              <textarea
                id="about_self"
                autoFocus
                placeholder="Write 2-3 sentences about yourself"
                className="w-full resize-none h-[150px] px-2 py-1 text-xl rounded-lg border border-neutral-300 focus:outline-none focus:ring focus:border-blue-500 focus:shadow-lg focus:duration-300"
                {...register("about_self", {
                  required: "First name is required",
                })}
              />
            </div>

            <div className="flex flex-col mb-2">
              <label htmlFor="about_partner" className="text-lg">
                About your ideal partner:
              </label>
              <textarea
                id="about_partner"
                autoFocus
                placeholder="Write 2-3 sentences about your ideal partner"
                className="w-full resize-none h-[150px] px-2 py-1 text-xl rounded-lg border border-neutral-300 focus:outline-none focus:ring focus:border-blue-500 focus:shadow-lg focus:duration-300"
                {...register("about_partner", {
                  required: "About partner is required",
                })}
              />
            </div>
          </div>
          <div className="w-full flex justify-end gap-3">
            <button
              className="my-2 p-2 text-xl text-white rounded-lg border border-neutral-300 font-bold py-1 bg-neutral-400 hover:bg-neutral-600 active:bg-neutral-700 focus:outline-none focus:ring focus:ring-slate-300"
              type="button"
            >
              Cancel
            </button>
            <button
              className="my-2 p-2 text-xl text-white rounded-lg border border-neutral-300 font-bold py-1 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300"
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withAuth(CompleteProfile);