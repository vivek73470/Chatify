const express = require('express');
const {sendMessage} = require('../controllers/messageController');
const authenticate = require('../middleware/middleware');

const messageRouter = express.Router();

messageRouter.post('/send',authenticate, sendMessage)

module.exports = messageRouter;