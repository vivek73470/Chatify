const messageService = require('../services/messageService');
const Group = require("../model/GroupModel/groupModel");

const sendMessage = async (req, res) => {
    try {
        const { receiverId, text } = req.body;

        if (!receiverId || !text) {
            return res.status(400).json({
                status: false,
                message: "receiverId and text are required",
            });
        }

        const savedMessage = await messageService.createMessage({
            sender: req.user._id,
            receiver: receiverId,
            group: null,
            text,
            status: "sent"
        });
        res.status(201).json({
            status: true,
            data: savedMessage,
        });

    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }

}

const getMessage = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const otherUserId = req.params.id;

        const messagesData = await messageService.find({
            group: null,
            deletedFor: { $ne: loggedInUserId },
            $or: [
                { sender: loggedInUserId, receiver: otherUserId },
                { sender: otherUserId, receiver: loggedInUserId },
            ]
        }).sort({ createdAt: 1 })
        res.status(200).json({
            status: true,
            data: messagesData,
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
        });
    }
};

const markMessageAsRead = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const otherUserId = req.params.id;

        await messageService.UpdateMany(
            {
                sender: otherUserId,
                receiver: loggedInUserId,
                group: null,
                deletedFor: { $ne: loggedInUserId },
                status: { $ne: "read" },
            },
            { $set: { status: "read" } }
        );
        res.status(200).json({ status: true });

    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
}

const markMessageAsDelivered = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const otherUserId = req.params.id;

        await messageService.UpdateMany(
            {
                sender: otherUserId,
                receiver: loggedInUserId,
                group: null,
                deletedFor: { $ne: loggedInUserId },
                status: "sent",
            },
            { $set: { status: "delivered" } }
        );
        res.status(200).json({ status: true });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
}

const getUnreadMessageCount = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const otherUserId = req.params.id;
        const count = await messageService.count({
            sender: otherUserId,
            receiver: loggedInUserId,
            group: null,
            deletedFor: { $ne: loggedInUserId },
            status: { $ne: "read" }
        })
        res.status(200).json({
            status: true,
            count,
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
        });
    }
}

const sendGroupMessage = async (req, res) => {
    try {
        const { groupId, text } = req.body;

        if (!groupId || !text?.trim()) {
            return res.status(400).json({
                status: false,
                message: "groupId and text are required",
            });
        }

        const group = await Group.findById(groupId).select("members");
        if (!group) {
            return res.status(404).json({ status: false, message: "Group not found" });
        }

        const isMember = group.members.some((memberId) => String(memberId) === String(req.user._id));
        if (!isMember) {
            return res.status(403).json({ status: false, message: "You are not a group member" });
        }

        const savedMessage = await messageService.createMessage({
            sender: req.user._id,
            receiver: null,
            group: groupId,
            text: text.trim(),
            status: "delivered",
        });

        return res.status(201).json({
            status: true,
            data: savedMessage,
        });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
}

const getGroupMessages = async (req, res) => {
    try {
        const groupId = req.params.id;
        const group = await Group.findById(groupId).select("members");

        if (!group) {
            return res.status(404).json({ status: false, message: "Group not found" });
        }

        const isMember = group.members.some((memberId) => String(memberId) === String(req.user._id));
        if (!isMember) {
            return res.status(403).json({ status: false, message: "You are not a group member" });
        }

        const messagesData = await messageService.find({ group: groupId }).sort({ createdAt: 1 });
        const visibleMessages = messagesData.filter(
            (message) => !(message.deletedFor || []).some((userId) => String(userId) === String(req.user._id))
        );

        return res.status(200).json({
            status: true,
            data: visibleMessages,
        });
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message,
        });
    }
}

const deleteConversation = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const otherUserId = req.params.id;

        await messageService.UpdateMany(
            {
                group: null,
                $or: [
                    { sender: loggedInUserId, receiver: otherUserId },
                    { sender: otherUserId, receiver: loggedInUserId },
                ],
            },
            { $addToSet: { deletedFor: loggedInUserId } }
        );

        return res.status(200).json({
            status: true,
            message: "Chat deleted successfully",
        });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
}

const deleteGroupConversation = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const groupId = req.params.id;

        await messageService.UpdateMany(
            { group: groupId },
            { $addToSet: { deletedFor: loggedInUserId } }
        );

        return res.status(200).json({
            status: true,
            message: "Group chat deleted successfully",
        });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
}

const editMessage = async (req, res) => {
    try {
        const messageId = req.params.id;
        const nextText = req.body?.text?.trim();

        if (!nextText) {
            return res.status(400).json({
                status: false,
                message: "text is required",
            });
        }

        const existingMessage = await messageService.findMessageById(messageId);
        if (!existingMessage) {
            return res.status(404).json({
                status: false,
                message: "Message not found",
            });
        }

        if (String(existingMessage.sender) !== String(req.user._id)) {
            return res.status(403).json({
                status: false,
                message: "You can only edit your own messages",
            });
        }

        const updatedMessage = await messageService.updateById(messageId, {
            text: nextText,
            isEdited: true,
            editedAt: new Date(),
        });

        return res.status(200).json({
            status: true,
            data: updatedMessage,
        });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
}

module.exports = {
    sendMessage,
    sendGroupMessage,
    getMessage,
    getGroupMessages,
    deleteConversation,
    deleteGroupConversation,
    markMessageAsRead,
    markMessageAsDelivered,
    getUnreadMessageCount,
    editMessage
}
