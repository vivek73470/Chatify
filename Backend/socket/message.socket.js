import Message from "../model/MessageModel/messageModel.js";
import Group from "../model/GroupModel/groupModel.js";

const asId = (value) => String(value);

export default function messageHandlers(io, socket, onlineUsers, activeChats) {

  socket.on("openChat", ({ userId, withUserId }) => {
    if (!userId || !withUserId) return;
    socket.data.userId = asId(userId);
    activeChats.set(socket.id, asId(withUserId));
  });

  socket.on("closeChat", () => {
    activeChats.delete(socket.id);
  });

  socket.on("sendMessage", async (message) => {
    if (!message?._id || !message?.sender || !message?.receiver || message?.group) return;
    const senderId = asId(message.sender);
    const receiverId = asId(message.receiver);
    const messageId = asId(message._id);
    const receiverSockets = onlineUsers.get(receiverId);
    const senderSockets = onlineUsers.get(senderId);

    try {
      if (senderSockets) {
        senderSockets.forEach((sid) => {
          io.to(sid).emit("sidebarUpdated");
        });
      } else {
        socket.emit("sidebarUpdated");
      }

      if (receiverSockets && receiverSockets.size > 0) {
        const isReceiverViewingThisChat = Array.from(receiverSockets).some(
          (sid) => activeChats.get(sid) === senderId
        );

        const nextStatus = isReceiverViewingThisChat ? "read" : "delivered";

        await Message.findByIdAndUpdate(
          messageId,
          { $set: { status: nextStatus } },
          { new: false }
        );

        receiverSockets.forEach((sid) => {
          io.to(sid).emit("receiveMessage", {
            ...message,
            status: nextStatus,
          });

          io.to(sid).emit("sidebarUpdated");
        });

        if (!isReceiverViewingThisChat) {
          receiverSockets.forEach((sid) => {
            io.to(sid).emit("unreadCountChanged", {
              from: senderId,
            });
          });
        }

        if (senderSockets) {
          senderSockets.forEach((sid) => {
            io.to(sid).emit("messageStatusUpdate", {
              messageId,
              status: nextStatus,
            });
          });
        } else {
          socket.emit("messageStatusUpdate", {
            messageId,
            status: nextStatus,
          });
        }
      }
    } catch (error) {
      console.error("Failed to process message status update:", error.message);
    }
  });

  socket.on("sendGroupMessage", async (message) => {
    if (!message?._id || !message?.sender || !message?.group) return;

    try {
      const senderId = asId(message.sender);
      const groupId = asId(message.group);

      const group = await Group.findById(groupId).select("members");
      if (!group) return;

      const memberIds = group.members.map((id) => asId(id));

      memberIds.forEach((memberId) => {
        const memberSockets = onlineUsers.get(memberId);
        if (!memberSockets) return;

        memberSockets.forEach((sid) => {
          if (memberId !== senderId) {
            io.to(sid).emit("receiveGroupMessage", message);
          }
          io.to(sid).emit("sidebarUpdated");
        });
      });
    } catch (error) {
      console.error("Failed to process group message:", error.message);
    }
  });

  socket.on("messageEdited", async (message) => {
    if (!message?._id || !message?.sender || !message?.text) return;

    try {
      const senderId = asId(message.sender);
      const senderSockets = onlineUsers.get(senderId);

      if (message.group) {
        const groupId = asId(message.group);
        const group = await Group.findById(groupId).select("members");
        if (!group) return;

        group.members.forEach((memberIdValue) => {
          const memberId = asId(memberIdValue);
          const memberSockets = onlineUsers.get(memberId);
          if (!memberSockets) return;

          memberSockets.forEach((sid) => {
            io.to(sid).emit("groupMessageEdited", message);
            io.to(sid).emit("sidebarUpdated");
          });
        });

        return;
      }

      if (!message.receiver) return;
      const receiverId = asId(message.receiver);
      const receiverSockets = onlineUsers.get(receiverId);

      if (senderSockets) {
        senderSockets.forEach((sid) => {
          io.to(sid).emit("messageEdited", message);
          io.to(sid).emit("sidebarUpdated");
        });
      } else {
        socket.emit("messageEdited", message);
        socket.emit("sidebarUpdated");
      }

      if (receiverSockets) {
        receiverSockets.forEach((sid) => {
          io.to(sid).emit("messageEdited", message);
          io.to(sid).emit("sidebarUpdated");
        });
      }

    } catch (error) {
      console.error("Failed to process message edit:", error.message);
    }
  });

  socket.on("groupCreated", ({ memberIds }) => {
    if (!Array.isArray(memberIds)) return;

    memberIds.forEach((memberId) => {
      const sockets = onlineUsers.get(asId(memberId));
      if (!sockets) return;

      sockets.forEach((sid) => {
        io.to(sid).emit("sidebarUpdated");
      });
    });
  });

  socket.on("groupDeleted", ({ groupId, memberIds }) => {
    if (!groupId || !Array.isArray(memberIds)) return;

    memberIds.forEach((memberId) => {
      const sockets = onlineUsers.get(asId(memberId));
      if (!sockets) return;

      sockets.forEach((sid) => {
        io.to(sid).emit("sidebarUpdated");
        io.to(sid).emit("groupDeletedNotice", { groupId: asId(groupId) });
      });
    });
  });

  socket.on("messageRead", async ({ senderId, receiverId }) => {
    if (!senderId || !receiverId) return;
    const normalizedSenderId = asId(senderId);
    const normalizedReceiverId = asId(receiverId);
    const senderSockets = onlineUsers.get(normalizedSenderId);

    try {
      await Message.updateMany(
        {
          sender: normalizedSenderId,
          receiver: normalizedReceiverId,
          status: { $ne: "read" },
        },
        { $set: { status: "read" } }
      );
    } catch (error) {
      console.error("Failed to persist read status:", error.message);
    }

    if (senderSockets) {
      senderSockets.forEach((sid) => {
        io.to(sid).emit("messageReadUpdate", {
          receiverId: normalizedReceiverId,
          status: "read",
        });
      });
    }
  });

  socket.on("disconnect", () => {
    activeChats.delete(socket.id);
  });
}
