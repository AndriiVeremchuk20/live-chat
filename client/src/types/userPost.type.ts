import AppUser from "./user.type";

interface UserPost {
  id: string;
  description: string | null;
  file_path: string;
  user_id: string;
  user: AppUser;
  created_at: string;
  likes: number,
  isLiked: boolean,
}

export default UserPost;
