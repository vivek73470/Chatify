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

export const sendReadReceipt = ({ senderId, receiverId }) => {
  const socket = initSocket();
  socket.emit("messageRead", {
    senderId,
    receiverId
  })
}

export const onMessageStatusUpdate = (callback) => {
  const socket = initSocket();
  socket.on("messageStatusUpdate", callback);
};

export const onMessageReadUpdate = (callback) => {
  const socket = initSocket();
  socket.on("messageReadUpdate", callback);
};

export const emitUserOnline = (userId) => {
  const socket = initSocket();
  socket.emit("userOnline", { userId });
};

export const onUserCameOnline = (callback) => {
  const socket = initSocket();
  socket.on("userCameOnline", callback);
};

export const onUnreadCountMessage = (callback) => {
  const socket = initSocket();
  socket.on("unreadCountChanged", callback)
};

export const onSidebarUpdated = (callback) => {
  const socket = initSocket();
  socket.on("sidebarUpdated", callback)
}

export const offSidebarUpdated = () => {
  const socket = initSocket();
  socket.off("sidebarUpdated");
};

// export const getSocket = () => socket;


