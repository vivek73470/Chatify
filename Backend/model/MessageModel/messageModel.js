
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userRegister',
    required: true,
  },
  text: {
    type: String,
  },
  seenBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userRegister',
  }],
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);

