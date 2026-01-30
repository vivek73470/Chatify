import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_SERVER_URL;
let socket = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(BASE_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
      transports: ["websocket"],
    });
  }
  return socket;
};

export const connectUser = (userId) => {
  const socket = initSocket();
  socket.emit("addUser", userId);
};

export const onOnlineUsers = (callback) => {
  const socket = initSocket();
  socket.on("getOnlineUsers", callback);
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const sendSocketMessage = (message) => {
  const socket = initSocket();
  socket.emit("sendMessage", message)
};

export const receiveSocketMessage = (callback) => {
  const socket = initSocket();
  socket.on("receiveMessage", callback);
}

// export const getSocket = () => socket;


