const UserModel = require('../../models/User');

const jwt = require('jsonwebtoken');
const asyncHandler = require('../../middlewares/async');
const ErrorResponse = require('../../utils/errorResponse');
const { registerSchema } = require('../../utils/schemas');
const ConversationModel = require('../../models/Conversation');

async function registerController(req, res, next) {
	const { username, email, password } = req.body;
	const { error } = registerSchema.validate({
		username,
		email,
		password,
	});
	if (error) {
		const message = error.details.map((error) => error.message)[0];
		return next(new ErrorResponse(400, message));
	}
	// Create user
	const user = await UserModel.create({
		username,
		email: email.toLowerCase(),
		password,
	});
	// create a new workplace conversation
	await ConversationModel.create({ participants: [user._id] });

	return res.status(201).json({
		success: true,
		message: 'User created successfully.',
		token: user.getSignedJwtToken(),
		username: user.username,
		email: user.email,
		_id: user._id,
		expiresIn: process.env.JWT_EXPIRE,
	});
}

module.exports = asyncHandler(registerController);
