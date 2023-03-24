const jwt = require('jsonwebtoken');

async function authSocket(socket, next) {
	const token = socket.handshake.auth.token;
	try {
		socket.user = jwt.verify(token, process.env.JWT_SECRET);
		return next();
	} catch (error) {
		return next(error);
	}
}

module.exports = authSocket;
