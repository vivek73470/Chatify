import registerUserHandlers from "./users.socket.js";
import messageHandlers from "./message.socket.js";
import typingHandlers from "./typing.socket.js";


export const initSocket = (io) => {
    const onlineUsers = new Map();

    // io.on("connection") is just a listener
    // it does not run immediately - Triggered when a client connects
    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        registerUserHandlers(io, socket, onlineUsers);
        messageHandlers(io, socket, onlineUsers);
        typingHandlers(io, socket);
    });
}


