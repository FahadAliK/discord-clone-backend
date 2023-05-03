const ConversationModel = require('./models/Conversation');
const Invitation = require('./models/Invitation');
const MessageModel = require('./models/Message');
const UserModel = require('./models/User');
const {
	getActiveConnections,
	getSocketServerInstance,
	isUserOnline,
} = require('./socketStore');

async function updateFriendsPendingInvitations(userId) {
	try {
		let pendingInvitations = await Invitation.find({
			receiverId: userId,
		}).populate('senderId');
		pendingInvitations = pendingInvitations.map((invitation) => ({
			invitationId: invitation._id,
			username: invitation.senderId.username,
			email: invitation.senderId.email,
			senderId: invitation.senderId._id,
		}));
		// find all active connections of specific userId
		const receiverList = getActiveConnections(userId);
		const io = getSocketServerInstance();
		receiverList.forEach((receiverSocketId) => {
			io.to(receiverSocketId).emit(
				'friends-invitations',
				pendingInvitations || []
			);
		});
	} catch (err) {
		console.log(err);
	}
}

async function updateFriends(userId) {
	try {
		// find active connections of specific id (online users)
		const receiverList = getActiveConnections(userId);
		const user = await UserModel.findById(userId).populate('friends');
		if (!user) {
			console.log({ userId });
		}
		let friends;
		if (user?.friends) {
			friends = user.friends.map(({ _doc }) => ({
				..._doc,
				isOnline: isUserOnline(_doc._id.toString()),
			}));
		}
		// get io server instance
		const io = getSocketServerInstance();
		receiverList.forEach((receiverSocketId) => {
			io.to(receiverSocketId).emit('friends-list', friends ? friends : []);
		});
	} catch (err) {
		console.log(err);
	}
}

module.exports = {
	updateFriendsPendingInvitations,
	updateFriends,
};
