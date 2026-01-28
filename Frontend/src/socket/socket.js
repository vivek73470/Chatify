import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_SERVER_URL;
let socket = null;

export const connectSocket = (userId) => {
  if (socket) return socket;

  socket = io(BASE_URL, {
    auth: {
      token: localStorage.getItem("token"),
    },
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    socket.emit("addUser", userId);
  });

  socket.on("disconnect", ()=>{
    console.log('socket disconnected')
  })

  return socket;
  
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
