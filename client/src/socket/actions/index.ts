import * as message from "./message";
import * as chat from "./chat";
import * as typing from "./typing";
import * as ping from "./ping";
import * as auth from "./auth";
import * as disconnect  from "./disconnect";

const socketApi = {
  ...message,
  ...chat,
  ...typing,
  ...ping,
  ...auth,
  ...disconnect,
};

export default socketApi;
