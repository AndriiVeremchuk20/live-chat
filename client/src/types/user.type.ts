import Profile from "./profile.type";

interface AppUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  isOnline: boolean;
  profile: Profile | null;
}

export default AppUser;
