const mongoose = require("mongoose");
const User = require("../model/UserRegisterModel/usermodel");

const getAllUsers = async (req, res) => {
  try {
    const loggedInUserId = new mongoose.Types.ObjectId(req.user._id);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { search } = req.query;

    let matchStage = {
      _id: { $ne: loggedInUserId },
    };

    if (search) {
      matchStage.$or = [
        { name: { $regex: search, $options: "i" } },
        { number: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.aggregate([
      { $match: matchStage },

      // sort latest chats first 
      { $sort: { updatedAt: -1 } },

      // pagination
      { $skip: skip },
      { $limit: limit },

      // lookup last message
      {
        $lookup: {
          from: "messages",
          let: { otherUserId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    {
                      $and: [
                        { $eq: ["$sender", "$$otherUserId"] },
                        { $eq: ["$receiver", loggedInUserId] },
                      ],
                    },
                    {
                      $and: [
                        { $eq: ["$sender", loggedInUserId] },
                        { $eq: ["$receiver", "$$otherUserId"] },
                      ],
                    },
                  ],
                },
              },
            },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
            { $project: { createdAt: 1 } },
          ],
          as: "lastMessage",
        },
      },

      {
        $addFields: {
          lastMessageTime: {
            $arrayElemAt: ["$lastMessage.createdAt", 0],
          },
        },
      },

      {
        $project: {
          password: 0,
          lastMessage: 0,
        },
      },
    ]);

    // check if more data exists
    const totalUsers = await User.countDocuments(matchStage);
    const hasMore = skip + users.length < totalUsers;

    res.status(200).json({
      status: true,
      data: users,
      page,
      hasMore,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

module.exports = { getAllUsers };
