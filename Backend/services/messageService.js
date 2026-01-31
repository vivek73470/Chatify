const message = require('../model/MessageModel/messageModel')

const createMessage = async (data) => {
    const result = new message(data);
    return await result.save();
}

//  Find message by ID
const findMessageById = async (id) => {
    return await message.findById(id);
};

// findAll
const find =  (condition) => {
       return  message.find(condition);
};

module.exports = {
    createMessage,
    find,
    findMessageById
}