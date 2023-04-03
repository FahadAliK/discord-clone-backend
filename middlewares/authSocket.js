const jwt = require('jsonwebtoken');

async function authSocket(socket, next) {
	// console.log(socket.handshake.headers.authorization);
	// const token = socket.handshake.auth.token;
	const token = socket.handshake.headers.authorization;
	try {
		socket.user = jwt.verify(token, process.env.JWT_SECRET);
		return next();
	} catch (error) {
		return next(error);
	}
}

module.exports = authSocket;
