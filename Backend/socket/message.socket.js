
export default function messageHandlers(io, socket, onlineUsers) {

  // SEND MESSAGE 
  socket.on("sendMessage", (message) => {
    const receiverSocketId = onlineUsers.get(message.receiver);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", {
        ...message,
        status: 'delivered'
      });

      io.to(receiverSocketId).emit("unreadCountChanged", {
        from: message.sender,
      });

      io.to(receiverSocketId).emit("sidebarUpdated");
      socket.emit("sidebarUpdated");

      // Notify sender that message was delivered
      socket.emit("messageStatusUpdate", {
        messageId: message._id,
        status: "delivered",
      });
    }
  });

  // When user comes online, notify all users who sent them messages
  socket.on("userOnline", ({ userId }) => {
    // all connected users that this user is now online & They mark their sent messages as delivered
    socket.broadcast.emit("userCameOnline", { userId });
  });

  // MARK AS READ when user opens specific chat
  socket.on("messageRead", ({ senderId, receiverId }) => {
    const senderSocketId = onlineUsers.get(senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("messageReadUpdate", {
        receiverId,
        status: "read",
      });
    }
  });
}