const UserModel = require('../../models/User');
const asyncHandler = require('../../middlewares/async');
const ErrorResponse = require('../../utils/errorResponse');
const { loginSchema } = require('../../utils/schemas');

async function loginController(req, res, next) {
	const { email, password } = req.body;
	const { error } = loginSchema.validate({
		email,
		password,
	});
	if (error) {
		const message = error.details.map((error) => error.message)[0];
		return next(new ErrorResponse(400, message));
	}

	const user = await UserModel.findOne({ email: email.toLowerCase() }).select(
		'+password'
	);
	if (!user) {
		return next(
			new ErrorResponse(404, 'User does not exists, Please register yourself.')
		);
	}
	const isMatch = await user.matchPassword(password);
	if (!isMatch) {
		return next(
			new ErrorResponse(400, 'Invalid password, Please enter right password.')
		);
	}
	return res.status(200).json({
		success: true,
		message: 'Logged in successfully.',
		token: user.getSignedJwtToken(),
		username: user.username,
		email: user.email,
		_id: user._id,
		expiresIn: process.env.JWT_EXPIRE,
	});
}

module.exports = asyncHandler(loginController);
