const express = require('express');
const conversationsRouter = express.Router();
const {
	userConversationController,
	myConversationController,
} = require('../controllers/conversations');

conversationsRouter.get('/my-conversation', myConversationController);
conversationsRouter.post('/user-conversation', userConversationController);

module.exports = conversationsRouter;
