const asyncHandler = require('../../middlewares/async');
const UserModel = require('../../models/User');
const ErrorResponse = require('../../utils/errorResponse');
const InvitationModel = require('../../models/Invitation');
const {
	updateFriendsPendingInvitations,
	updateFriends,
} = require('../../socketHandlers');

async function inviteRejectController(req, res, next) {
	const { id } = req.body;
	// remove that invitation from friend invitations collection
	const invitationExists = await InvitationModel.exists({ _id: id });
	if (!invitationExists) {
		return next(new ErrorResponse('400', 'Invitation does not exists.'));
	}
	await InvitationModel.findByIdAndDelete(id);
	updateFriendsPendingInvitations(req.user._id.toString());
	res.status(200).json({
		success: true,
		message: 'Friend invitation rejected successfully.',
	});
}

module.exports = asyncHandler(inviteRejectController);
