const message = require('../services/messageService');

const sendMessage = async (req, res) => {
    try {
        const { receiverId, text } = req.body;

        if (!receiverId || !text) {
            return res.status(400).json({
                status: false,
                message: "receiverId and text are required",
            });
        }

        const savedMessage = await message.createMessage({
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
module.exports = {
    sendMessage
}