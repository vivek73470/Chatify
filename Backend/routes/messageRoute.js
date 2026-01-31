const express = require('express');
const {sendMessage, getMessage} = require('../controllers/messageController');
const authenticate = require('../middleware/middleware');

const messageRouter = express.Router();

messageRouter.post('/send', authenticate, sendMessage);
messageRouter.get('/get/:id', authenticate, getMessage);

module.exports = messageRouter;