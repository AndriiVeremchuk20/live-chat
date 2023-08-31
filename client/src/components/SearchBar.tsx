import AppUser from "@/types/user.type";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BsSearch } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { useMutation } from "react-query";
import userActionsApi from "@/api/userActions";

interface formValues {
  text: string;
}

const SearchBar = () => {
  const { setValue, getValues, register } = useForm<formValues>();
  const [searchResult, setSearchResult] = useState<Array<AppUser>>([]);

  const searchUsersMutation = useMutation(userActionsApi.searchUsers, {
    onSuccess(data) {
      console.log(data);
    },
    onError(error) {
      console.log(error);
    },
  });

  const onRemoveText = useCallback(() => {
    setValue("text", "");
  }, []);
	
  useEffect(() => {
    const query = getValues("text");
    if (query) {
      searchUsersMutation.mutate({ query });
    }
  }, [getValues("text")]);

  return (
    <>
      <form className="w-full text-xl" autoComplete="off">
        <label className="flex w-full items-center justify-between gap-3 rounded-2xl bg-neutral-200 p-2 px-6 dark:bg-neutral-600">
          <BsSearch size={25} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-inherit placeholder:italic placeholder:text-neutral-400 focus:border-b focus:border-neutral-700 focus:outline-none"
            {...register("text")}
          />
          {getValues("text") ? (
            <IoMdClose onClick={onRemoveText} size={25} />
          ) : null}
        </label>
      </form>
      {searchResult.length > 0 ? (
        <div className="absolute top-[100px]"></div>
      ) : null}
    </>
  );
};

export default SearchBar;
