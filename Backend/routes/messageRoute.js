const express = require('express');
const {sendMessage, getMessage, markMessageAsRead, markMessageAsDelivered, getUnreadMessageCount} = require('../controllers/messageController');
const authenticate = require('../middleware/middleware');

const messageRouter = express.Router();

messageRouter.post('/send', authenticate, sendMessage);
messageRouter.get('/get/:id', authenticate, getMessage);
messageRouter.put('/read/:id', authenticate, markMessageAsRead);
messageRouter.put('/delivered/:id', authenticate, markMessageAsDelivered);
messageRouter.get('/count/:id', authenticate, getUnreadMessageCount);

module.exports = messageRouter;