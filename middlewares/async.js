function asyncHandler(fn) {
	return function (req, res, next) {
		return Promise.resolve(fn(req, res, next)).catch((error) => next(error));
	};
}

module.exports = asyncHandler;
