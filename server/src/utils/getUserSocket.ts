import { usersSockets } from "../socket/usersSockets";

const getUserSocket = ({ user_id }: { user_id: string }) => {
  const userSocket = [...usersSockets.entries()]
    .filter(({ 1: v }) => v === user_id)
    .map(([k]) => k);

	return userSocket;
};

export default getUserSocket;
