const UserModel = require('../../models/User');

const jwt = require('jsonwebtoken');
const asyncHandler = require('../../middlewares/async');
const ErrorResponse = require('../../utils/errorResponse');
const { registerSchema } = require('../../utils/schemas');

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

	return res.status(201).json({
		success: true,
		message: 'User created successfully.',
		token: user.getSignedJwtToken(),
		username: user.username,
		email: user.email,
	});
}

module.exports = asyncHandler(registerController);
