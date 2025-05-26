const mongoose = require('mongoose');

const userModel = new mongoose.Schema({
    name: { type: String, required: true },
    number: { type: String, required: true },
    password: { type: String, required: true },
    profilepic: { type: String, default: null },
    lastSeen: { type: Date, default: Date.now },
    status: {
        type: String,
        default: 'Hey there! I am using Chatify.',
    },
    token: { type: String, default:null },
}, { timestamps: true, versionKey: false });

const User = mongoose.model("userRegister", userModel)

module.exports = User;