const asyncHandler = require('../../middlewares/async');
const UserModel = require('../../models/User');
const ErrorResponse = require('../../utils/errorResponse');
const { inviteSchema } = require('../../utils/schemas');
const InvitationModel = require('../../models/Invitation');
const { updateFriendsPendingInvitations } = require('../../socketHandlers');

async function inviteController(req, res, next) {
	const { email } = req.body;
	const { error } = inviteSchema.validate({ email });
	if (error) {
		const message = error.details.map((error) => error.message)[0];
		return next(new ErrorResponse(400, message));
	}
	// Check if user sends invitation to himself
	if (email === req.user.email) {
		return next(
			new ErrorResponse(400, "You can't send invitation to yourself.")
		);
	}
	// Check for user existance.
	const receiverUser = await UserModel.findOne({ email: email.toLowerCase() });
	if (!receiverUser) {
		return next(new ErrorResponse(404, "User does't exists."));
	}
	// Check if invitation already exists.
	const invitationAlreadyExists = await InvitationModel.findOne({
		senderId: req.user._id,
		receiverId: receiverUser._id,
	});
	if (invitationAlreadyExists) {
		return next(new ErrorResponse(409, 'Invitation has been already sent.'));
	}
	// Check if the user whick we would like to invite is already our friend.
	const usersAlreadyFriends = receiverUser.friends.find(
		(id) => id.toString() === req.user._id.toString()
	);
	if (usersAlreadyFriends) {
		return next(
			new ErrorResponse(409, 'Friend already added, Please check friends list.')
		);
	}
	// Check if sender already have a pending invitaion from receiver.
	const pendingInvitation = await InvitationModel.findOne({
		senderId: receiverUser._id,
		receiverId: req.user._id,
	});
	if (pendingInvitation) {
		return next(
			new ErrorResponse(
				'409',
				'You already have a pending invitain from this user, Please accept it or reject it.'
			)
		);
	}

	// Create new invitation in DB.
	await InvitationModel.create({
		senderId: req.user._id,
		receiverId: receiverUser._id,
	});

	// emit invitaions to client
	updateFriendsPendingInvitations(receiverUser._id.toString());

	res.status(200).json({
		success: true,
		message: 'Invitation has been send successfully.',
		senderEmail: req.user.email,
		receiver: email,
	});
}

module.exports = asyncHandler(inviteController);
