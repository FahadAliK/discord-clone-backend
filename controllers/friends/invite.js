const asyncHandler = require('../../middlewares/async');
const UserModel = require('../../models/User');
const ErrorResponse = require('../../utils/errorResponse');
const { inviteSchema } = require('../../utils/schemas');

async function inviteController(req, res, next) {
	const { email } = req.body;
	const { error } = inviteSchema.validate({ email });
	if (error) {
		const message = error.details.map((error) => error.message)[0];
		return next(new ErrorResponse(400, message));
	}
	// Check if user sends invitation to himself
	if (email === req.user.email) {
		return next(
			new ErrorResponse(400, "You can't send invitation to yourself.")
		);
	}
	// Check for user existance.
	const user = await UserModel.exists({ email: email.toLowerCase() });
	if (!user) {
		return next(new ErrorResponse(404, "User does't exists."));
	}
	res.status(200).json({
		success: true,
		message: 'Hellow form friend invite',
		req: req.body,
		user: user,
	});
}

module.exports = asyncHandler(inviteController);
