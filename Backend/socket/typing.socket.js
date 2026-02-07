export default function typingHandlers(io, socket, onlineUsers) {

  socket.on("typingStart", ({ senderId, receiverId }) => {
    const receiverSockets = onlineUsers.get(receiverId);

    if (!receiverSockets) return;

    receiverSockets.forEach((socketId) => {
      io.to(socketId).emit("typingStart", {
        from: senderId,
      });
    });
  });

  socket.on("typingStop", ({ senderId, receiverId }) => {
    const receiverSockets = onlineUsers.get(receiverId);

    if (!receiverSockets) return;

    receiverSockets.forEach((socketId) => {
      io.to(socketId).emit("typingStop", {
        from: senderId,
      });
    });
  });
}
