// const user = require('../services/authService')

// const getAllUsers = async (req, res) => {
//     try {
//         const { search } = req.query;
//         const loggedInUserId = req.user._id;

//         let condition = {
//             _id: {$ne: loggedInUserId}
//         }
//         if (search) {
//             condition.$or = [
//                 { name: { $regex: search, $options: 'i' } },
//                 { number: { $regex: search, $options: 'i' } },
//             ]
//         }
//         const users = await user.find(condition)
//         res.status(200).json({
//             status: true,
//             data: users,
//         });

//     } catch (error) {
//         res.status(500).json({
//             status: false,
//             message: 'Failed to fetch users'
//         })
//     }
// }

// module.exports = {
//     getAllUsers
// }


const mongoose = require("mongoose");
const User = require("../model/UserRegisterModel/usermodel");

const getAllUsers = async (req, res) => {
  try {
    const loggedInUserId = new mongoose.Types.ObjectId(req.user._id);
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

      // 🔹 find last message between logged-in user & this user
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

      // 🔹 extract time
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

    res.status(200).json({ status: true, data: users });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

module.exports = {
    getAllUsers
}

