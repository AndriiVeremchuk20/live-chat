import { Server, Socket } from "socket.io";
import prisma from "../../../prisma";
import getUserSocket from "../../utils/getUserSocket";
import SocketEvents from "../socketEvents";

const subscribeHandlers = (io: Server, socket: Socket) => {
  const onSubscribe = async ({
    subscriber_id,
    subscribedTo_id,
  }: {
    subscriber_id: string;
    subscribedTo_id: string;
  }) => {
    const newSubscribe = await prisma.subscription.create({
      data: {
        subscriber_id,
        subscribedTo_id,
      },
    });

    const subscribedToSocket = getUserSocket({ user_id: subscribedTo_id });

    if (subscribedToSocket) {
      io.to(subscribedToSocket).emit(SocketEvents.subscribe.subscribe, {
        ...newSubscribe,
      });
    }
  };

  const onUnsubscribe = async ({
    subscriber_id,
    subscribedTo_id,
  }: {
    subscriber_id: string;
    subscribedTo_id: string;
  }) => {
    try {
      await prisma.subscription.delete({
        where: {
          subscriber_id_subscribedTo_id: {
            subscriber_id,
            subscribedTo_id,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  socket.on(SocketEvents.subscribe.subscribe, onSubscribe);
  socket.on(SocketEvents.subscribe.unsubscribe, onUnsubscribe);
};

export default subscribeHandlers;
