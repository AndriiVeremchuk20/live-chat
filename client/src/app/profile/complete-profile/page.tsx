"use client";

import withAuth from "@/hooks/withAuth";
import { SubmitHandler, useForm } from "react-hook-form";
import getCounryList from "@/utils/getCountryList";
import useAppStore from "@/store";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import UserAvatar from "@/components/UserAvatar";

type FormValues = {
  first_name: string;
  last_name: string;
  avatar?: File;
  age: number;
  country: string;
  gender: number;
  partner_gender: number;
  about_self: string;
  about_partner: string;
};

const CompleteProfile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    getValues,
    setFocus,
  } = useForm<FormValues>();
  const { user } = useAppStore();
  const router = useRouter();

  const inputFileRef = useRef<HTMLInputElement | null>(null); // ref to connect button "change avatar" and input type="file" tags
  const [previewAvatarSrc, setPreviewAvatarSrc] = useState<string | null>(null);
  const [isFile, setIsFile] = useState<boolean>(false);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
  };

  const onOpenFileInput = useCallback(() => {
    inputFileRef.current?.click();
  }, []);

  const onAvatarChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setValue("avatar", event.target.files[0]);
      setIsFile((prew) => !prew);
    }
  }, []);

  const onCancelClick = useCallback(() => {
    router.back();
  }, []);

  useEffect(() => {
    const avatar = getValues("avatar");
    if (!avatar) {
      setPreviewAvatarSrc(null);
      return;
    }
    const avatarUrl = URL.createObjectURL(avatar);
    setPreviewAvatarSrc(avatarUrl);

    return () => URL.revokeObjectURL(avatarUrl);
  }, [getValues("avatar")]);

  useEffect(() => {
    if (user?.first_name) {
      setValue("first_name", user.first_name);
    }
    if (user?.last_name) {
      setValue("last_name", user.last_name);
    }
  }, [user]);

  return (
    <div>
      <div className="flex justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="my-10 mx-1 desktop:w-1/2 phone:w-full border-2 border-violet-200 p-4 rounded-lg bg-neutral-50"
        >
          <div className="text-2xl flex justify-center items-center border-b-2 border-violet-200 mb-3">
            <span>Complete Your Profile</span>
          </div>
          <div className="w-full flex flex-col justify-center items-center gap-3 my-4">
            {previewAvatarSrc ? (
              <UserAvatar
                image={{ src: previewAvatarSrc, alt: "preview avatar" }}
                size={140}
              />
            ) : (
              <UserAvatar size={140} />
            )}
            <input
              type="file"
              className="hidden"
              ref={inputFileRef}
              onChange={onAvatarChange}
            />
            <button
              onClick={onOpenFileInput}
              className="flex justify-center items-center px-3 py-1 border border-black rounded-md hover:bg-violet-100 hover:duration-200 focus:ring-2 focus:ring-neutral-200"
              type="button"
            >
              <span className="font-semibold tracking-widest">
                Change avatar
              </span>
            </button>
          </div>
          <div className="w-full flex desktop:flex-row desktop:gap-4 phone:flex-col">
            <div className="w-full flex flex-col mb-2">
              <label htmlFor="first_name" className="text-lg">
                First name:
              </label>
              <input
                type="text"
                id="first_name"
                placeholder={"Your name"}
                autoFocus={!!user?.first_name}
                title={
                  user?.first_name
                    ? "if you want to change the name, enter a new name"
                    : "Enter a name"
                }
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
                placeholder={"Your last name"}
                title={
                  user?.first_name
                    ? "if you want to change the last name, enter a new last name"
                    : "Enter last name"
                }
                autoFocus={!!user?.last_name}
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
                min: { value: 18, message: "Min age for registration 18!" },
                max: { value: 140, message: "You're very old." },
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
                  required: "Gender is required",
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
                  required: "Country is required",
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
                  required: "Tell about self is required",
                  minLength: { value: 50, message: "Please write longer text" },
                  maxLength: {
                    value: 150,
                    message: "Please write shorted text",
                  },
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
                  minLength: { value: 50, message: "Please write tonger text" },
                  maxLength: {
                    value: 150,
                    message: "Please write shorted text",
                  },
                })}
              />
            </div>
          </div>
          <div className="w-full flex justify-end gap-3">
            <button
              onClick={onCancelClick}
              className="my-2 p-2 text-xl text-white rounded-lg border border-neutral-300 font-semibold tracking-widest py-1 bg-neutral-400 hover:bg-neutral-600 active:bg-neutral-700 focus:outline-none focus:ring focus:ring-slate-300"
              type="button"
            >
              Cancel
            </button>
            <button
              className="my-2 p-2 text-xl text-white rounded-lg border border-neutral-300 font-semibold tracking-widest py-1 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300"
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
