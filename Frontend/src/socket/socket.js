import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

let socket = null;

// Create socket ONCE & Reuse everywhere &  No race conditions
// Opens a WebSocket connection to the server
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
      console.log("Socket disconnected:", reason);
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
  const socket = initSocket();
  socket.off("getOnlineUsers");
}

/* ---------------- MESSAGES ---------------- */

export const sendSocketMessage = (message) => {
  const socket = initSocket();
  socket.emit("sendMessage", message);
};

export const onReceiveMessage = (callback) => {
  const socket = initSocket();
  socket.on("receiveMessage", callback);
}

export const offReceiveSocketMessage = () => {
  const socket = initSocket();
  socket.off("receiveMessage");
};

export const sendGroupSocketMessage = (message) => {
  const socket = initSocket();
  socket.emit("sendGroupMessage", message);
};

export const onReceiveGroupMessage = (callback) => {
  const socket = initSocket();
  socket.on("receiveGroupMessage", callback);
}

export const offReceiveGroupMessage = () => {
  const socket = initSocket();
  socket.off("receiveGroupMessage");
};

export const emitMessageEdited = (message) => {
  const socket = initSocket();
  socket.emit("messageEdited", message);
};

export const onMessageEdited = (callback) => {
  const socket = initSocket();
  socket.on("messageEdited", callback);
};

export const offMessageEdited = () => {
  const socket = initSocket();
  socket.off("messageEdited");
};

export const emitGroupMessageEdited = (message) => {
  const socket = initSocket();
  socket.emit("messageEdited", message);
};

export const onGroupMessageEdited = (callback) => {
  const socket = initSocket();
  socket.on("groupMessageEdited", callback);
};

export const offGroupMessageEdited = () => {
  const socket = initSocket();
  socket.off("groupMessageEdited");
};

export const emitGroupCreated = (memberIds) => {
  const socket = initSocket();
  socket.emit("groupCreated", { memberIds });
};

export const emitGroupDeleted = ({ groupId, memberIds }) => {
  const socket = initSocket();
  socket.emit("groupDeleted", { groupId, memberIds });
};

export const onGroupDeletedNotice = (callback) => {
  const socket = initSocket();
  socket.on("groupDeletedNotice", callback);
};

export const offGroupDeletedNotice = () => {
  const socket = initSocket();
  socket.off("groupDeletedNotice");
};

/* ---------------- READ / STATUS ---------------- */

export const sendReadReceipt = ({ senderId, receiverId }) => {
  const socket = initSocket();
  socket.emit("messageRead", { senderId, receiverId });

}

export const onMessageStatusUpdate = (callback) => {
  const socket = initSocket();
  socket.on("messageStatusUpdate", callback);
};

export const offMessageStatusUpdate = () => {
  const socket = initSocket();
  socket.off("messageStatusUpdate");
};

export const onMessageReadUpdate = (callback) => {
  const socket = initSocket();
  socket.on("messageReadUpdate", callback);
};

export const offMessageReadUpdate = () => {
  const socket = initSocket();
  socket.off("messageReadUpdate");
};

/* ---------------- SIDEBAR / COUNTS ---------------- */

export const onUnreadCountMessage = (callback) => {
  const socket = initSocket();
  socket.on("unreadCountChanged", callback)
};

export const offUnreadCountMessage = () => {
  const socket = initSocket();
  socket.off("unreadCountChanged");
};

export const onSidebarUpdated = (callback) => {
  const socket = initSocket();
  socket.on("sidebarUpdated", callback)
}

export const offSidebarUpdated = () => {
  const socket = initSocket();
  socket.off("sidebarUpdated");
};

// typing emitters
export const emitTypingStart = ({ senderId, receiverId }) => {
  const socket = initSocket();
  socket.emit("typingStart", { senderId, receiverId });
};

export const emitTypingStop = ({ senderId, receiverId }) => {
  const socket = initSocket();
  socket.emit("typingStop", { senderId, receiverId });
};

// typing listeners
export const onTypingStart = (callback) => {
  const socket = initSocket();
  socket.on("typingStart", callback);
};

export const offTypingStart = () => {
  const socket = initSocket();
  socket.off("typingStart");
};

export const onTypingStop = (callback) => {
  const socket = initSocket();
  socket.on("typingStop", callback);
};

export const offTypingStop = () => {
  socket?.off("typingStop");
};

/* ---------------- ACTIVE CHAT ---------------- */
export const openChat = ({ userId, withUserId }) => {
  const socket = initSocket();
  socket.emit("openChat", { userId, withUserId });
};

export const closeChat = () => {
  const socket = initSocket();
  socket.emit("closeChat");
};

/* ---------------- BULK STATUS ---------------- */
export const onMessageStatusBulkUpdate = (callback) => {
  const socket = initSocket();
  socket.on("messageStatusBulkUpdate", callback);
};

export const offMessageStatusBulkUpdate = () => {
  const socket = initSocket();
  socket.off("messageStatusBulkUpdate");
};
