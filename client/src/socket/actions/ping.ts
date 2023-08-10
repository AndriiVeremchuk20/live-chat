import socket from "..";
import SocketEvents from "../events";

const userPing = ({user_id}: {user_id: string}) =>{
	socket.emit(SocketEvents.ping, {user_id});
};

const onlineUsers = (callback: (data: any)=>void) => {
	socket.on(SocketEvents.online, callback);	
}

export {userPing, onlineUsers};

