export default function messageHandlers(io, socket, onlineUsers) {
socket.on("sendMessage", (message) => {
    const { receiverId } = message;

const receiverSocketId = onlineUsers.get(message.receiver);

if (receiverSocketId) {
  io.to(receiverSocketId).emit("receiveMessage", message);
}

  });
};
