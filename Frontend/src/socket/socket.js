import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_SERVER_URL;
let socket;

export const connectSocket = (userId) => {
  socket = io(BASE_URL, {
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
    socket.emit("addUser", userId); 
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  return socket;
};

export const getSocket = () => socket;
