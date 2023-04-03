const myConversationController = require('./myConversation');
const userConversationController = require('./userConversation');

const conversationsControllers = {
	userConversationController,
	myConversationController,
};

module.exports = conversationsControllers;
