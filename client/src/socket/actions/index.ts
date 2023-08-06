import * as message from "./message";
import * as chat from "./chat";

const socketApi = {
	...message,
	...chat,
};

export default socketApi;
