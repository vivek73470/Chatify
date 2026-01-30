export default function typingHandlers(io, socket) {
  socket.on("typing", ({ receiverId }) => {
    socket.to(receiverId).emit("userTyping");
  });

  socket.on("stopTyping", ({ receiverId }) => {
    socket.to(receiverId).emit("stopTyping");
  });
}
