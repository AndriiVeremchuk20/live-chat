import { Server, Socket } from "socket.io";
import prisma from "../../../prisma";
import logger from "../../logger";
import redisClient from "../../redis";
import getUserKey from "../../utils/getUserKey";
import SocketEvents from "../socketEvents";

const pingHandlers = (io: Server, socket: Socket) => {
  const onUserPing = async ({ user_id }: { user_id: string }) => {
    try {
      await redisClient.set(getUserKey(user_id), "online", { EX: 30 });

      const onlineUsers = await redisClient.keys("user:*");
      const usersWithChatTarget = await prisma.chat.findMany({
        where: {
          users: {
            some: { user_id: user_id },
          },
        },
        select: {
          users: {
            where: {
              NOT: [{ user_id }],
              user_id: {
                in: onlineUsers.map((key) => key.split(":")[1]),
              },
            },
            select: {
              user_id: true,
            },
            take: 1,
          },
        },
      });

      const onlineUsersResponse = usersWithChatTarget
        .map((chat) => chat.users[0])
        .filter(Boolean)
        .map((user) => user.user_id);

       socket.emit(SocketEvents.online, onlineUsersResponse);
    } catch (error) {
      logger.error(error);

      socket.emit(SocketEvents.error, {
        status: "error",
        message: "server error",
      });
    }
  };

  socket.on(SocketEvents.ping, onUserPing);
};

export default pingHandlers;
