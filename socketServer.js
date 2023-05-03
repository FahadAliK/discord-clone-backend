const authSocket = require('./middlewares/authSocket');
const { Server } = require('socket.io');
const {
	addNewConnectedUser,
	removeConnectedUser,
	setSocketServerInstance,
	getOnlineUsers,
	connectedUsers,
	getActiveConnections,
	getSocketServerInstance,
} = require('./socketStore');
const {
	updateFriendsPendingInvitations,
	updateFriends,
	directMessageHandler,
} = require('./socketHandlers');
const UserModel = require('./models/User');
const MessageModel = require('./models/Message');
const ConversationModel = require('./models/Conversation');

function createSocketServer(server) {
	const io = new Server(server, {
		cors: { origin: '*', methods: ['GET', 'POST'] },
	});

	setSocketServerInstance(io);

	io.use((socket, next) => {
		authSocket(socket, next);
	});

	io.on('connection', async (socket) => {
		console.log(
			`A client with id ${socket.id} has been connected successfully.`.cyan
		);
		socket.on('messageFromPostman', (data) => {
			console.log({ data });
			updateFriends(socket.user.id);
		});
		// user connect handler
		addNewConnectedUser(socket.id, socket.user.id);
		updateFriendsPendingInvitations(socket.user.id);
		updateFriends(socket.user.id);
		const connectedUser = await UserModel.findById(socket.user.id);
		// If connected user have friends then message them that user in online.
		if (connectedUser?.friends) {
			connectedUser.friends.map((friendId) =>
				updateFriends(friendId.toString())
			);
		}
		// user disconnect handler
		socket.on('disconnect', async () => {
			console.log(
				`A client with id ${socket.id} has been disconnected successfully.`.cyan
			);
			removeConnectedUser(socket.id, socket.user.id);
			const disconnectedUser = await UserModel.findById(socket.user.id);
			// If disconnected user have friends then message them that user in offline.
			if (disconnectedUser?.friends) {
				disconnectedUser.friends.map((friendId) =>
					updateFriends(friendId.toString())
				);
			}
		});
	});
}

module.exports = { createSocketServer };
