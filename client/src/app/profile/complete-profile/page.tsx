"use client";

import withAuth from "@/hooks/withAuth";
import { SubmitHandler, useForm } from "react-hook-form";
import getCounryList from "@/utils/getCountryList";
import useAppStore from "@/store";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import UserAvatar from "@/components/UserAvatar";
import Alert from "@/components/Alert";
import { useMutation } from "react-query";
import profileApi from "@/api/profile";
import routes from "@/config/appRoutes";

type FormValues = {
  first_name: string;
  last_name: string;
  avatar: File | null;
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
  const { setAppStartLoading, setAppEndLoading } = useAppStore();
  const router = useRouter();

  const inputFileRef = useRef<HTMLInputElement | null>(null); // ref to connect button "change avatar" and input type="file" tags
  const [previewAvatarSrc, setPreviewAvatarSrc] = useState<string | null>(null); // state to save url choosed file
  const [isFile, setIsFile] = useState<boolean>(false); // ???

  //send profile data
  const sendProfileMutation = useMutation(profileApi.postProfile, {
    onSuccess(data) {
      setAppEndLoading();
      console.log(data);
      router.push(routes.home);
    },
    onError(error) {
      console.log(error);
      setAppEndLoading();
    },
  });

  //on submit form
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    const formData = new FormData();
    //add data(form fields) to formData
    Object.entries(data).map(([key, value]) => {
      if (value !== null)
        formData.append(key, typeof value === "number" ? String(value) : value);
    });

    sendProfileMutation.mutate(formData);
  };

  // make click on input type="file" with inputFileRef
  const onOpenFileInput = useCallback(() => {
    inputFileRef.current?.click();
  }, []);

  // func to set value avatar useForm
  const onAvatarChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setValue("avatar", event.target.files[0]);
      setIsFile((prew) => !prew); // ??
    }
  }, []);

  const onCancelClick = useCallback(() => {
    router.back();
  }, []);

  // effect to change avatar
  useEffect(() => {
    const avatar = getValues("avatar");
    // if ! vatar leave
    if (!avatar) {
      setPreviewAvatarSrc(null);
      return;
    }

    // if file choosed create fiel url
    const avatarUrl = URL.createObjectURL(avatar);
    setPreviewAvatarSrc(avatarUrl); // set path to preview

    return () => URL.revokeObjectURL(avatarUrl); // returned revoke
  }, [getValues("avatar")]);

  // if user have first_name and last_name, set this values in form
  useEffect(() => {
    if (user?.first_name) {
      setValue("first_name", user.first_name);
    }
    if (user?.last_name) {
      setValue("last_name", user.last_name);
    }
  }, [user]);

  // effect to loading
  useEffect(() => {
    if (sendProfileMutation.isLoading) {
      setAppStartLoading();
    }
  }, [sendProfileMutation.isLoading]);

  return (
    <div>
      <div className="flex justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="my-10 mx-1 desktop:w-1/2 phone:w-full border-2 border-violet-200 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 dark:text-white"
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
                className={`w-full px-2 py-1 text-xl text-black dark:text-white dark:bg-neutral-500 rounded-lg border border-neutral-300 focus:outline-none focus:ring focus:border-blue-500 focus:shadow-lg focus:duration-300 ${
                  errors.first_name && "ring-2 ring-red-400"
                }`}
                {...register("first_name", {
                  required: "First name is required",
                })}
              />
              {errors.first_name?.message && (
                <Alert type="error" message={errors.first_name.message} />
              )}
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
                className={`w-full px-2 py-1 text-xl text-black dark:text-white dark:bg-neutral-500 rounded-lg border border-neutral-300 focus:outline-none focus:ring focus:border-blue-500 focus:shadow-lg focus:duration-300 ${
                  errors.last_name && "ring-2 ring-red-400"
                }`}
                {...register("last_name", {
                  required: "Last name is required",
                })}
              />
              {errors.last_name?.message && (
                <Alert type="error" message={errors.last_name.message} />
              )}
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
              className={`w-full px-2 py-1 text-xl text-black dark:text-white dark:bg-neutral-500 rounded-lg border border-neutral-300 focus:outline-none focus:ring focus:border-blue-500 focus:shadow-lg focus:duration-300 ${
                errors?.age && "ring-2 ring-red-400"
              }`}
              {...register("age", {
                required: "Age is required",
                min: { value: 18, message: "Min age for registration 18!" },
                max: { value: 140, message: "You're very old." },
              })}
            />

            {errors.age?.message && (
              <Alert type="error" message={errors.age.message} />
            )}
          </div>

          <div className="w-full flex desktop:flex-row desktop:gap-4 phone:flex-col">
            <div className="w-full flex flex-col mb-2">
              <label htmlFor="gender" className="text-lg">
                Gender:
              </label>
              <select
                id="gender"
                autoFocus
                className={`text-black w-full px-2 py-1 text-xl dark:text-white dark:bg-neutral-500 rounded-lg border border-neutral-300 focus:outline-none focus:ring focus:border-blue-500 focus:shadow-lg focus:duration-300 ${
                  errors?.age && "ring-2 ring-red-400"
                }`}
                {...register("gender", {
                  required: "Gender is required",
                })}
              >
                <option hidden>Choose your gender ⚥</option>
                <option value={1}>Male</option>
                <option value={0}>Female</option>
                <option value={2}>Gender binary</option>
              </select>
              {errors.gender?.message && (
                <Alert type="error" message={errors.gender.message} />
              )}
            </div>

            <div className="w-full flex flex-col mb-2">
              <label htmlFor="partner_gender" className="text-lg">
                Partner gender:
              </label>
              <select
                id="partner_gender"
                autoFocus
                className={`w-full px-2 py-1 text-xl text-black dark:text-white dark:bg-neutral-500 rounded-lg border border-neutral-300 focus:outline-none focus:ring focus:border-blue-500 focus:shadow-lg focus:duration-300 ${
                  errors?.age && "ring-2 ring-red-400"
                }`}
                {...register("partner_gender", {
                  required: "Partner gender is required",
                })}
              >
                <option hidden>Choose partner gender ⚥</option>
                <option value={1}>Male</option>
                <option value={0}>Female</option>
                <option value={2}>Gender binary</option>
              </select>
              {errors.partner_gender?.message && (
                <Alert type="error" message={errors.partner_gender.message} />
              )}
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
                className={`w-full px-2 py-1 text-xl text-black dark:text-white dark:bg-neutral-500 rounded-lg border border-neutral-300 focus:outline-none focus:ring focus:border-blue-500 focus:shadow-lg focus:duration-300 ${
                  errors?.age && "ring-2 ring-red-400"
                }`}
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
              {errors.country?.message && (
                <Alert type="error" message={errors.country.message} />
              )}
            </div>

            <div className="flex flex-col mb-2">
              <label htmlFor="about_self" className="text-lg">
                About You:
              </label>
              <textarea
                id="about_self"
                autoFocus
                placeholder="Write 2-3 sentences about yourself"
                className={`w-full h-[150px] resize-none px-2 py-1 text-xl text-black dark:text-white dark:bg-neutral-500 rounded-lg border border-neutral-300 focus:outline-none focus:ring focus:border-blue-500 focus:shadow-lg focus:duration-300 ${
                  errors?.age && "ring-2 ring-red-400"
                }`}
                {...register("about_self", {
                  required: "Tell about self is required",
                  minLength: { value: 50, message: "Please write longer text" },
                  maxLength: {
                    value: 150,
                    message: "Please write shorted text",
                  },
                })}
              />
              {errors.about_self?.message && (
                <Alert type="error" message={errors.about_self.message} />
              )}
            </div>

            <div className="flex flex-col mb-2">
              <label htmlFor="about_partner" className="text-lg">
                About your ideal partner:
              </label>
              <textarea
                id="about_partner"
                autoFocus
                placeholder="Write 2-3 sentences about your ideal partner"
                className={`w-full resize-none h-[150px] px-2 py-1 text-xl text-black dark:text-white dark:bg-neutral-500 rounded-lg border border-neutral-300 focus:outline-none focus:ring focus:border-blue-500 focus:shadow-lg focus:duration-300 ${
                  errors?.age && "ring-2 ring-red-400"
                }`}
                {...register("about_partner", {
                  required: "About partner is required",
                  minLength: { value: 50, message: "Please write tonger text" },
                  maxLength: {
                    value: 150,
                    message: "Please write shorted text",
                  },
                })}
              />
              {errors.about_partner?.message && (
                <Alert type="error" message={errors.about_partner.message} />
              )}
            </div>
          </div>
          <div className="w-full flex justify-end gap-3">
            <button
              onClick={onCancelClick}
              className="my-2 p-2 text-xl text-white rounded-lg border border-neutral-300 font-semibold tracking-widest py-1 bg-neutral-400 dark:bg-neutral-700 hover:bg-neutral-900 active:bg-neutral-600 focus:outline-none focus:ring focus:ring-slate-300"
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
