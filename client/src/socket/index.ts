import {io} from "socket.io-client";

const OriginURL = "http://localhost:4000";

const socket = io(OriginURL,{
	autoConnect: false,
});

export default socket;
