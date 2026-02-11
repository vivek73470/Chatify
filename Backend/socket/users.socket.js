import Message from "../model/MessageModel/messageModel.js";

const asId = (value) => String(value);

export default function registerUserHandlers(io, socket, onlineUsers, activeChats) {

  socket.on("addUser", async (userId) => {
    if (!userId) return;
    const normalizedUserId = asId(userId);
    socket.data.userId = normalizedUserId;

    if (!onlineUsers.has(normalizedUserId)) {
      onlineUsers.set(normalizedUserId, new Set());
    }

    onlineUsers.get(normalizedUserId).add(socket.id);

    // send full online list to everyone
    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));

    // On login/online: convert old "sent" messages to "delivered" and notify senders.
    try {
      const pendingMessages = await Message.find({
        receiver: normalizedUserId,
        status: "sent",
      }).select("_id sender");

      if (!pendingMessages.length) {
        return;
      }

      await Message.updateMany(
        { receiver: normalizedUserId, status: "sent" },
        { $set: { status: "delivered" } }
      );

      const groupedBySender = new Map();
      pendingMessages.forEach((msg) => {
        const senderId = asId(msg.sender);
        const current = groupedBySender.get(senderId) || [];
        current.push(asId(msg._id));
        groupedBySender.set(senderId, current);
      });

      groupedBySender.forEach((messageIds, senderId) => {
        const senderSockets = onlineUsers.get(senderId);
        if (!senderSockets) return;

        senderSockets.forEach((sid) => {
          io.to(sid).emit("messageStatusBulkUpdate", {
            messageIds,
            status: "delivered",
          });
        });
      });
    } catch (error) {
      console.error("Failed to mark pending messages as delivered:", error.message);
    }
  });

  socket.on("disconnect", () => {
    activeChats.delete(socket.id);

    for (const [userId, sockets] of onlineUsers.entries()) {
      sockets.delete(socket.id);

      if (sockets.size === 0) {
        onlineUsers.delete(userId);
      }
    }

    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
  });
}
