export default function registerUserHandlers(io, socket, onlineUsers) {

  socket.on("addUser", (userId) => {
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }

    onlineUsers.get(userId).add(socket.id);

    // send full online list to everyone
    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
  });

  socket.on("disconnect", () => {
    for (const [userId, sockets] of onlineUsers.entries()) {
      sockets.delete(socket.id);

      if (sockets.size === 0) {
        onlineUsers.delete(userId);
      }
    }

    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
  });
}
