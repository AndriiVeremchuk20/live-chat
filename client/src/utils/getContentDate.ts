const getContentDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "numeric",
	  hour12: false,
    });
  }

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
	hour12: false,
  });
};

export default getContentDate;
