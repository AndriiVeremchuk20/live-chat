import * as message from "./message";
import * as chat from "./chat";
import * as typing from "./typing";
import * as ping from "./ping";

const socketApi = {
  ...message,
  ...chat,
  ...typing,
  ...ping,
};

export default socketApi;
