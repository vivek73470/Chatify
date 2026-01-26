const user = require('../model/UserRegisterModel/usermodel')

const createUser = async (data) => {
    const result = new user(data);
    return await result.save();
}

//  Find user by ID
const findUserById = async (id) => {
    return await User.findById(id);
};

//  Find user by Phone
const findUserByPhone = async (number) => {
    return await user.findOne({ number });
}

//  Find user by Id & update
const updateUserPassword = async (id, password) => {
    return await user.findByIdAndUpdate(
        id,
        { password },
        { new: true })
}

module.exports = {
    createUser,
    findUserById,
    findUserByPhone,
    updateUserPassword
}