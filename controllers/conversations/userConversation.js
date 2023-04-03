const asyncHandler = require('../../middlewares/async');
const ConversationModel = require('../../models/Conversation');
const UserModel = require('../../models/User');
const ErrorResponse = require('../../utils/errorResponse');

async function userConversationController(req, res, next) {
	const { userId } = req.body;
	// console.log({ idFromBody: userId, authUserId: req.user._id });
	const user = await UserModel.findById(userId);
	if (!user) {
		return next(new ErrorResponse(400, `User not found with ID of ${userId}`));
	}
	const conversation = await ConversationModel.findOne({
		participants: { $all: [userId, req.user._id] },
	}).populate('messages');
	// console.log(conversation._id.toString());
	res.status(200).json({
		success: true,
		message: `Conversation with user having ID : ${userId} fetched successfully.`,
		conversation,
	});
}

module.exports = asyncHandler(userConversationController);
