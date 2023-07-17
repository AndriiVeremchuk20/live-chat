// 1 - male
// 0 - female
// 2 - binary

import { Gender } from "@prisma/client";

const getGender = (gender: number) => {
  return gender === 1
    ? Gender.MALE
    : gender === 0
    ? Gender.FEMALE
    : Gender.BINARY;
};

export default getGender;
