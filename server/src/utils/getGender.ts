

import { Gender } from "@prisma/client";

const getGender = (gender: string) => {
  return gender === "MALE"
    ? Gender.MALE
    : gender === "FEMALE"
    ? Gender.FEMALE
    : Gender.BINARY;
};

export default getGender;
