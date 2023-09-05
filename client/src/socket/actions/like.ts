import PostLike from "@/types/postLike.type";
import socket from "..";
import SocketEvents from "../events";

const onLikePost = ({
  user_id,
  post_id,
}: {
  user_id: string;
  post_id: string;
}) => {
  socket.emit(SocketEvents.like, { user_id, post_id });
};

const onLikePostResponse = (
  callback: ({ like }: { like: PostLike }) => void,
) => {
  socket.on(SocketEvents.like, callback);
};

export { onLikePost, onLikePostResponse };
