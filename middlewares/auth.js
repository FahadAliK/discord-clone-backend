const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('./async');
require('dotenv').config('../config/.env');

async function verifyToken(req, res, next) {
	let token = req.body.token || req.query.token || req.headers.authorization;
	if (!token) {
		return next(
			new ErrorResponse(403, 'A token is required for authentication.')
		);
	}
	token = token.replace(/^Bearer\s+/, '');
	try {
		const { id } = jwt.verify(token, process.env.JWT_SECRET);
		const user = await UserModel.findById(id);
		if (!user) {
			return next(
				new ErrorResponse(401, 'No user associated with provided token')
			);
		} else {
			req.user = user;
		}
		return next();
	} catch (error) {
		return next(
			new ErrorResponse(401, 'No user associated with provided token')
		);
	}
}

module.exports = asyncHandler(verifyToken);
