import * as message from "./message";
import * as chat from "./chat";
import * as typing from "./typing";

const socketApi = {
  ...message,
  ...chat,
  ...typing,
};

export default socketApi;
