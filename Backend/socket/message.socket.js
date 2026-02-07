export default function messageHandlers(io, socket, onlineUsers) {

  socket.on("sendMessage", (message) => {
    const receiverSockets = onlineUsers.get(message.receiver);

    if (receiverSockets) {
      receiverSockets.forEach((sid) => {
        io.to(sid).emit("receiveMessage", {
          ...message,
          status: "delivered",
        });

        io.to(sid).emit("unreadCountChanged", {
          from: message.sender,
        });

        io.to(sid).emit("sidebarUpdated");
      });

      // sender delivery confirmation
      socket.emit("messageStatusUpdate", {
        messageId: message._id,
        status: "delivered",
      });
    }
  });

  socket.on("messageRead", ({ senderId, receiverId }) => {
    const senderSockets = onlineUsers.get(senderId);

    if (senderSockets) {
      senderSockets.forEach((sid) => {
        io.to(sid).emit("messageReadUpdate", {
          receiverId,
          status: "read",
        });
      });
    }
  });
}


