const express = require('express');
const messagesRouter = express.Router();
const { createMessageController } = require('../controllers/messages');

messagesRouter.post('/create-message', createMessageController);

module.exports = messagesRouter;
