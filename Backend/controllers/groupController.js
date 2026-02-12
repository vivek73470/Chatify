const Group = require("../model/GroupModel/groupModel");
const Message = require("../model/MessageModel/messageModel");

const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;
    const creatorId = String(req.user._id);

    if (!name?.trim()) {
      return res.status(400).json({ status: false, message: "Group name is required" });
    }

    if (!Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ status: false, message: "Select at least one member" });
    }

    const uniqueMembers = Array.from(new Set([...members.map(String), creatorId]));

    const group = await Group.create({
      name: name.trim(),
      members: uniqueMembers,
      createdBy: creatorId,
    });

    const populatedGroup = await Group.findById(group._id).populate("members", "name status profilepic");

    return res.status(201).json({
      status: true,
      data: populatedGroup,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

const getMyGroups = async (req, res) => {
  try {
    const loggedInUserId = String(req.user._id);
    const groups = await Group.find({ members: loggedInUserId })
      .populate("members", "name status profilepic")
      .sort({ updatedAt: -1 })
      .lean();

    const enriched = await Promise.all(
      groups.map(async (group) => {
        const lastMessage = await Message.findOne({ group: group._id })
          .where({ deletedFor: { $ne: loggedInUserId } })
          .sort({ createdAt: -1 })
          .select("text sender createdAt")
          .lean();

        let lastMessageSenderName = "";
        if (lastMessage?.sender) {
          const sender = group.members.find((m) => String(m._id) === String(lastMessage.sender));
          lastMessageSenderName = sender?.name || "";
        }

        return {
          ...group,
          isGroup: true,
          lastMessageText: lastMessage?.text || "",
          lastMessageTime: lastMessage?.createdAt || new Date(0),
          lastMessageSender: lastMessage?.sender || null,
          lastMessageSenderName,
        };
      })
    );

    return res.status(200).json({
      status: true,
      data: enriched.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)),
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const loggedInUserId = String(req.user._id);

    const group = await Group.findById(groupId).select("createdBy");
    if (!group) {
      return res.status(404).json({ status: false, message: "Group not found" });
    }

    if (String(group.createdBy) !== loggedInUserId) {
      return res.status(403).json({ status: false, message: "Only group creator can delete group" });
    }

    await Message.deleteMany({ group: groupId });
    await Group.findByIdAndDelete(groupId);

    return res.status(200).json({
      status: true,
      message: "Group deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createGroup,
  getMyGroups,
  deleteGroup,
};
