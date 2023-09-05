import * as message from "./message";
import * as chat from "./chat";
import * as typing from "./typing";
import * as ping from "./ping";
import * as auth from "./auth";
import * as disconnect from "./disconnect";
import * as postLike from "./like";

const socketApi = {
  ...message,
  ...chat,
  ...typing,
  ...ping,
  ...auth,
  ...disconnect,
  ...postLike,
};

export default socketApi;
