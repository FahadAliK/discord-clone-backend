const asyncHandler = require('../../middlewares/async');
const ConversationModel = require('../../models/Conversation');
const UserModel = require('../../models/User');
const ErrorResponse = require('../../utils/errorResponse');

async function myConversationController(req, res, next) {
	const conversation = await ConversationModel.findOne({
		participants: {
			$all: [req.user._id],
		},
	}).populate('messages');
	res.status(200).json({
		success: true,
		message: `Conversation of user having ID : ${req.user._id} fetched successfully.`,
		messagesLength: conversation.messages.length,
		conversation,
	});
}

module.exports = asyncHandler(myConversationController);
