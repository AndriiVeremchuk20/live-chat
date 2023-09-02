import AppUser from "./user.type";

interface Post {
  id: string;
  description: string | null;
  file_path: string;
  user_id: string;
  user: AppUser;
  created_at: string;
}

export default Post;
