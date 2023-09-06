interface Profile {
  //  avatar_path: string | null;
  age: number;
  country: string;
  gender: genderType;
  about_self: string;
}

export type genderType = "MALE" | "FEMALE" | "BINARY";

export default Profile;
