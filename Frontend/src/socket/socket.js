import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

let socket = null;

//  Create socket ONCE & Reuse everywhere &  No race conditions

export const initSocket = () => {
  if (!socket) {
    socket = io(BASE_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket error:", err.message);
    });
  }

  return socket;
};

/* ---------------- User Presence ---------------- */
export const connectUser = (userId) => {
  const socket = initSocket();
  socket.emit("addUser", userId);
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const onOnlineUsers = (callback) => {
  const socket = initSocket();
  socket.on("getOnlineUsers", callback);
};

export const offOnlineUsers = () => {
  socket?.off("getOnlineUsers");
}

/* ---------------- MESSAGES ---------------- */

export const sendSocketMessage = (message) => {
  socket?.emit("sendMessage", message);
};

export const onReceiveMessage = (callback) => {
  socket?.on("receiveMessage", callback);
}

export const offReceiveSocketMessage = () => {
  socket?.off("receiveMessage");
};

/* ---------------- READ / STATUS ---------------- */

export const sendReadReceipt = ({ senderId, receiverId }) => {
  socket?.emit("messageRead", { senderId, receiverId });

}

export const onMessageStatusUpdate = (callback) => {
  socket?.on("messageStatusUpdate", callback);
};

export const offMessageStatusUpdate = () => {
  socket?.off("messageStatusUpdate");
};

export const onMessageReadUpdate = (callback) => {
  socket?.on("messageReadUpdate", callback);
};

export const offMessageReadUpdate = () => {
  socket?.off("messageReadUpdate");
};

/* ---------------- SIDEBAR / COUNTS ---------------- */

export const onUnreadCountMessage = (callback) => {
  socket.on("unreadCountChanged", callback)
};

export const offUnreadCountMessage = () => {
  socket?.off("unreadCountChanged");
};

export const onSidebarUpdated = (callback) => {
  socket?.on("sidebarUpdated", callback)
}

export const offSidebarUpdated = () => {
  socket?.off("sidebarUpdated");
};

// typing emitters
export const emitTypingStart = ({ senderId, receiverId }) => {
  socket?.emit("typingStart", { senderId, receiverId });
};

export const emitTypingStop = ({ senderId, receiverId }) => {
  socket?.emit("typingStop", { senderId, receiverId });
};

// typing listeners
export const onTypingStart = (callback) => {
  socket?.on("typingStart", callback);
};

export const offTypingStart = () => {
  socket?.off("typingStart");
};

export const onTypingStop = (callback) => {
  socket?.on("typingStop", callback);
};

export const offTypingStop = () => {
  socket?.off("typingStop");
};




