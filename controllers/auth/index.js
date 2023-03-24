const loginController = require('./login');
const registerController = require('./register');

const authControllers = {
	loginController,
	registerController,
};

module.exports = authControllers;
