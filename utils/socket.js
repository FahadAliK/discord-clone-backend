const connectedUsers = new Map();

function addConnectedUser(socketId, userId) {
	connectedUsers.set(socketId, { userId });
}
function removeConnectedUser(socketId, userId) {
	if (connectedUsers.has(socketId)) {
		connectedUsers.delete(socketId);
	}
}

module.exports = {
	connectedUsers,
	addConnectedUser,
	removeConnectedUser,
};
