import socketApi from "@/socket/actions";
import useAppStore from "@/store";
import React, { useCallback } from "react";

interface propSubscribeButton {
  isSubscribed: boolean;
  subscribeTo: string;
}

const SubscribeButton: React.FC<propSubscribeButton> = ({
  isSubscribed,
  subscribeTo,
}) => {
  const { user } = useAppStore();

  const onSubscribeClick = useCallback(() => {
    if (!user) return;

    socketApi.onSubscribe({
      subscriber_id: user.id,
      subscribedTo_id: subscribeTo,
    });
  }, []);

  if (isSubscribed) {
    return <button>Unsubscribe</button>;
  }

  return <button onClick={onSubscribeClick}>Subscribe</button>;
};

export default SubscribeButton;
