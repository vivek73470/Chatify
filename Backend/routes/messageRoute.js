const express = require('express');
const {sendMessage, sendGroupMessage, getMessage, getGroupMessages, deleteConversation, deleteGroupConversation, markMessageAsRead, markMessageAsDelivered, getUnreadMessageCount} = require('../controllers/messageController');
const authenticate = require('../middleware/middleware');

const messageRouter = express.Router();

messageRouter.post('/send', authenticate, sendMessage);
messageRouter.post('/group/send', authenticate, sendGroupMessage);
messageRouter.get('/get/:id', authenticate, getMessage);
messageRouter.get('/group/:id', authenticate, getGroupMessages);
messageRouter.delete('/conversation/:id', authenticate, deleteConversation);
messageRouter.delete('/group-chat/:id', authenticate, deleteGroupConversation);
messageRouter.put('/read/:id', authenticate, markMessageAsRead);
messageRouter.put('/delivered/:id', authenticate, markMessageAsDelivered);
messageRouter.get('/unread-count/:id', authenticate, getUnreadMessageCount);

module.exports = messageRouter;
