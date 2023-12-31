import { Like } from "@prisma/client";
import { Server, Socket } from "socket.io";
import prisma from "../../../prisma";
import getUserSocket from "../../utils/getUserSocket";
import SocketEvents from "../socketEvents";
import { usersSockets } from "../usersSockets";

const likeHandler = (io: Server, socket: Socket) => {
  const onLike = async ({
    user_id,
    post_id,
  }: {
    user_id: string;
    post_id: string;
  }) => {
    const isLiked = await prisma.like.findUnique({
      where: {
        user_id_post_id: {
          user_id,
          post_id,
        },
      },
    });

    if (isLiked) {
      return await prisma.like.delete({
        where: {
          user_id_post_id: {
            user_id,
            post_id,
          },
        },
      });
    }

    const postOwner = await prisma.post.findUnique({
      where: {
        id: post_id,
      },
      select: {
        user_id: true,
      },
    });

	if(!postOwner) return;

    const postOwnerSocket = getUserSocket({user_id: postOwner.user_id})

    const newLike = await prisma.like.create({
      data: {
        user_id,
        post_id,
      },
    });

    if (postOwnerSocket && postOwner?.user_id !== user_id) {
      return io.to(postOwnerSocket).emit(SocketEvents.like, {
        like: { ...newLike },
      });
    }
  };

  socket.on(SocketEvents.like, onLike);
};

export default likeHandler;
