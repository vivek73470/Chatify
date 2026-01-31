const messageService  = require('../services/messageService');

const sendMessage = async (req, res) => {
    try {
        const { receiverId, text } = req.body;

        if (!receiverId || !text) {
            return res.status(400).json({
                status: false,
                message: "receiverId and text are required",
            });
        }

        const savedMessage = await messageService .createMessage({
            sender: req.user._id,
            receiver: receiverId,
            text
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
            $or: [
                { sender: loggedInUserId, receiver: otherUserId },
                { sender: otherUserId, receiver: loggedInUserId },
            ]
        }).sort({ createdAt: 1 })
//         const result = messageService.find({});
// console.log("TYPE:", typeof result);
// console.log("HAS SORT:", typeof result?.sort);

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
module.exports = {
    sendMessage,
    getMessage
}