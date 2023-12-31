"use client";
import postsApi from "@/api/userActions/post";
import Image from "next/image";
import React, { ChangeEvent, useCallback, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BsFillImageFill } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

interface FormValues {
  post: File | null;
  description: string | null;
}

const AddNewPost = () => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [postPreview, setPostPreview] = useState<string | null>(null);
  const { register, setValue, getValues, handleSubmit, reset } = useForm<FormValues>();

  const addPostMutation = useMutation(postsApi.addPost, {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onOpenFileInput = useCallback(() => {
    if (!fileRef.current) {
      return;
    }
    fileRef.current.click();
  }, []);

  const onChooseFile = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setValue("post", file);
      const previewImageURL = URL.createObjectURL(file);
      setPostPreview(previewImageURL);
    }
  }, []);

  const onRemoveImageClick = useCallback(() => {
    setValue("post", null);
    setPostPreview(null);
  }, []);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!data.post) {
      return toast.warn("Please add your post", { autoClose: 1000 });
    }
    console.log(data);

    const formData = new FormData();

    formData.append("post", data.post),
      formData.append("description", data.description ?? "");

    const addPostPromise = addPostMutation.mutateAsync(formData);

    const loadingToastId = toast.loading("Please wait");

    await addPostPromise;

    toast.update(loadingToastId, {
      render: "Complete",
      type: "success",
      autoClose: 1000,
      isLoading: false,
      hideProgressBar: false,
    });

	reset();
  };

  return (
    <div className="mx-1 mt-5 flex max-h-fit min-h-[500px] justify-center">
      <div className="grid rounded-xl bg-neutral-300 shadow-sm shadow-slate-950 drop-shadow-2xl dark:bg-neutral-700 dark:shadow-neutral-500 phone:w-full phone:grid-cols-1 phone:grid-rows-2 tablet:w-3/4 desktop:w-2/4 desktop:grid-cols-2 desktop:grid-rows-1">
        <div
          className={`flex h-full w-full items-center justify-center rounded-l-xl bg-neutral-200 p-10 text-black dark:bg-neutral-600 dark:text-white`}
        >
          {!postPreview ? (
            <button
              className="flex h-3/4 w-3/4 flex-col items-center justify-center rounded-xl duration-200 hover:bg-neutral-500 hover:text-white dark:hover:bg-neutral-300 dark:hover:text-black"
              onClick={onOpenFileInput}
            >
              <BsFillImageFill size={50} />
              <span className="text-xl font-semibold">Upload post</span>
            </button>
          ) : (
            <div className="flex flex-col gap-1">
              <button
                className="self-end rounded-full bg-neutral-500 bg-opacity-50 p-1 hover:bg-opacity-20"
                onClick={onRemoveImageClick}
              >
                <IoMdClose size={20} />
              </button>
              <Image
                width={400}
                height={400}
                src={postPreview}
                alt="new post"
                className="rounded-lg drop-shadow-2xl"
              />
            </div>
          )}
        </div>
        <form
          className="flex h-fit w-full flex-col justify-self-center p-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
            onChange={onChooseFile}
          />
          <textarea
            className="bordeer h-[200px] w-full resize-none rounded-lg border-neutral-500 bg-neutral-200 p-3 text-lg text-black shadow-lg outline-none dark:bg-neutral-600 dark:text-white"
            placeholder="Add text to post"
            {...register("description")}
          />
          <button
            type="submit"
            className="my-2 self-end rounded-lg border border-neutral-300 bg-violet-500 px-3 py-1 text-xl font-bold text-white hover:bg-violet-600 focus:outline-none focus:ring focus:ring-violet-300 active:bg-violet-700 "
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNewPost;
