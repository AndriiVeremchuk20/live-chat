import Profile from "./profile.type";
import Theme from "./theme.type";

interface AppUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  isOnline: boolean;
  profile: Profile | null;
  chats: Array<string>;
  theme: Theme;
}

export default AppUser;
