"use client";

import withAuth from "@/hooks/withAuth";
import { useForm } from "react-hook-form";
import { countries, getEmojiFlag } from "countries-list";
import getCounryList from "@/utils/getCountryList";

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

  return (
    <div>
      <div>
        <form>
          <div className="flex phone:flex-col">
            <div className="flex flex-col mb-2">
              <label htmlFor="first_name" className="text-lg">
                First name:
              </label>
              <input
                type="text"
                id="first_name"
                autoFocus
                placeholder="Your name :)"
                className="w-full px-2 py-1 text-xl rounded-lg border border-neutral-300 focus:outline-none focus:ring focus:border-blue-500 focus:shadow-lg focus:duration-300"
                {...register("first_name", {
                  required: "First name is required",
                })}
              />
            </div>
            <div className="flex flex-col mb-2">
              <label htmlFor="last_name" className="text-lg">
                First name:
              </label>
              <input
                type="text"
                id="last_name"
                autoFocus
                placeholder="Your last name :)"
                className="w-full px-2 py-1 text-xl rounded-lg border border-neutral-300 focus:outline-none focus:ring focus:border-blue-500 focus:shadow-lg focus:duration-300"
                {...register("last_name", {
                  required: "Last name is required",
                })}
              />
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

            <div className="flex flex-col mb-2">
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

            <div className="flex flex-col mb-2">
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

            <div>
              <div className="flex flex-col mb-2">
                <label htmlFor="country" className="text-lg">
                  Country:
                </label>
                <select
                  id="country"
                  placeholder="Your name :)"
                  className="w-full px-2 py-1 text-xl rounded-lg border border-neutral-300 focus:outline-none focus:ring focus:border-blue-500 focus:shadow-lg focus:duration-300"
                  {...register("first_name", {
                    required: "First name is required",
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
        </form>
      </div>
    </div>
  );
};

export default withAuth(CompleteProfile);
