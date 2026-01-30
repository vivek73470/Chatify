const message = require('../model/MessageModel/messageModel')

const createMessage = async (data) => {
    const result = new message(data);
    return await result.save();
}

//  Find message by ID
const findMessageById = async (id) => {
    return await message.findById(id);
};


module.exports = {
    createMessage,
 
}