const asyncHandler = require('../../middlewares/async');
const UserModel = require('../../models/User');
const ErrorResponse = require('../../utils/errorResponse');
const InvitationModel = require('../../models/Invitation');
const {
	updateFriendsPendingInvitations,
	updateFriends,
} = require('../../socketHandlers');
const Conversation = require('../../models/Conversation');

async function inviteAcceptController(req, res, next) {
	const { id } = req.body;
	const invitation = await InvitationModel.findById(id);
	if (!invitation) {
		return next(new ErrorResponse(401, 'Invitaion not found.!'));
	}
	const { senderId, receiverId } = invitation;
	// Add friends to both users
	const senderUser = await UserModel.findById(senderId);
	senderUser.friends = [...senderUser.friends, receiverId];
	const receiverUser = await UserModel.findById(receiverId);
	receiverUser.friends = [...receiverUser.friends, senderId];
	await senderUser.save();
	await receiverUser.save();
	// delete invitation
	await InvitationModel.findByIdAndDelete(id);
	// create a new conversation
	await Conversation.create({
		participants: [senderUser._id, receiverUser._id],
	});
	// update list of the friends to both users.
	updateFriends(senderId.toString());
	updateFriends(receiverId.toString());
	// emit invitaions to client
	updateFriendsPendingInvitations(receiverUser._id.toString());
	res.status(200).json({
		success: true,
		message: 'Friend invitation accepted successfully.',
	});
}

module.exports = asyncHandler(inviteAcceptController);
