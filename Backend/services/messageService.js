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
const find = (condition) => {
    return message.find(condition);
};

// UpdateMany
const UpdateMany = async (condition, update) => {
    return await message.updateMany(condition, update)
}

// UpdateById
const updateById = async (id, update) => {
    return await message.findByIdAndUpdate(id, update, { new: true })
}

const count = async (condition) => {
    return await message.countDocuments(condition);
};

module.exports = {
    createMessage,
    find,
    UpdateMany,
    findMessageById,
    updateById,
    count

}