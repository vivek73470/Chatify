import registerUserHandlers from "./users.socket.js";
import messageHandlers from "./message.socket.js";
import typingHandlers from "./typing.socket.js";


export const initSocket = (io) => {
    const onlineUsers = new Map();

    // this runs immediately when io()(initSocket fn) connects from frontend and happens befor connectUser()
    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        registerUserHandlers(io, socket, onlineUsers);
        messageHandlers(io, socket, onlineUsers);
        typingHandlers(io, socket,onlineUsers);
    });
}


