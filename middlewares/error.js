const ErrorResponse = require('../utils/errorResponse');

function errorHandler(error, req, res, next) {
	// console.log(error);

	// Mongoose duplicate key
	if (error.code === 11000) {
		console.log(error.keyValue.email);
		const message = `User already exists with email ${error.keyValue.email}`;
		error = new ErrorResponse(400, message);
	}

	// Mongoose validation error
	if (error.name === 'ValidationError') {
		const message = Object.values(error.errors).map((error) => error.message);
		error = new ErrorResponse(400, message);
	}

	// Mongoose invalid objectId error
	if (error.name === 'CastError') {
		const message = `${error.reason}, ${error.value} is not a valid ObjectID.`;
		error = new ErrorResponse(400, message);
	}

	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || 'Internal server error.',
	});
}

module.exports = errorHandler;
