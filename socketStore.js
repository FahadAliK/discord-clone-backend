const connectedUsers = new Map();

let io = null;

function setSocketServerInstance(ioInstance) {
	io = ioInstance;
}

function getSocketServerInstance() {
	return io;
}

function addNewConnectedUser(socketId, userId) {
	connectedUsers.set(socketId, { userId });
	// console.log(connectedUsers);
}

function removeConnectedUser(socketId, userId) {
	if (connectedUsers.has(socketId)) {
		connectedUsers.delete(socketId);
		// console.log(connectedUsers);
	}
}

function getActiveConnections(userId) {
	const activeConnections = [];
	connectedUsers.forEach(function (value, key) {
		if (value.userId === userId) {
			activeConnections.push(key);
		}
	});
	return activeConnections;
}

function getOnlineUsers() {
	const onlineUsers = [];
	connectedUsers.forEach((value, key) => {
		onlineUsers.push({ socketId: key, userId: value.userId });
	});
	return onlineUsers;
}

function getUserIds() {
	const userIds = [];
	connectedUsers.forEach((value, key) => {
		userIds.push(value.userId);
	});
	return userIds;
}

function isUserOnline(id) {
	return !!getUserIds().find((userId) => userId === id);
}

module.exports = {
	connectedUsers,
	addNewConnectedUser,
	removeConnectedUser,
	getActiveConnections,
	setSocketServerInstance,
	getSocketServerInstance,
	getOnlineUsers,
	isUserOnline,
};
