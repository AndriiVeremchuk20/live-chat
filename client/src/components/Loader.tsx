const Loader = () => {
  return (
    <div className="flex h-fit w-full gap-2">
      <div className="w-1/3 animate-pulse bg-violet-300 p-5"></div>
      <div className="w-1/3 animate-pulse-slow bg-violet-300 p-5"></div>
      <div className="w-1/3 animate-pulse bg-violet-300 p-5"></div>
    </div>
  );
};

export default Loader;
