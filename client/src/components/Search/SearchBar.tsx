import AppUser from "@/types/user.type";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { useMutation } from "react-query";
import userActionsApi from "@/api/userActions";
import Tooltip from "./Tooltip";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "react-toastify";

const SearchBar = () => {
  const [query, setQuery] = useState<string>("");
  const [searchResult, setSearchResult] = useState<Array<AppUser>>([]);
  const debouncedQuery = useDebounce(query, 500);

  const searchUsersMutation = useMutation(userActionsApi.searchUsers, {
    onSuccess(data) {
      setSearchResult(data.data);
      console.log(data);
    },
    onError(error) {
      console.log(error);
    },
  });

  const onRemoveText = useCallback(() => {
    setQuery("");
  }, []);

  const onChangeQuery = useCallback((event: any) => {
    const { value } = event.target;
    setQuery(value);
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (query) {
      const promise = searchUsersMutation.mutateAsync({ query });

      const loadingToastId = toast.loading("Please wait...");

      await promise;

      toast.update(loadingToastId, {
        render: "Complete",
        type: "success",
        autoClose: 1000,
        isLoading: false,
        hideProgressBar: false,
      });
    }
  };

  useEffect(() => {
    if (debouncedQuery) {
      searchUsersMutation.mutate({ query: debouncedQuery });
    }
    setSearchResult([]);
  }, [debouncedQuery]);

  return (
    <>
      <form className="w-full text-xl" autoComplete="off" onSubmit={onSubmit}>
        <label className="flex w-full items-center justify-between gap-3 rounded-2xl bg-neutral-200 p-2 px-6 dark:bg-neutral-600">
          <BsSearch size={25} onClick={onSubmit} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-inherit placeholder:italic placeholder:text-neutral-400 focus:border-b focus:border-neutral-700 focus:outline-none"
            required
            onChange={onChangeQuery}
            value={query}
          />
          {query ? <IoMdClose onClick={onRemoveText} size={25} /> : null}
        </label>
      </form>
      {searchResult.length > 0 ? (
        <div className="absolute w-2/4 z-40">
          <Tooltip users={searchResult} onClick={onRemoveText} />
        </div>
      ) : null}
    </>
  );
};

export default SearchBar;
