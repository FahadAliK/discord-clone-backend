const express = require('express');
const authRouter = express.Router();
const { loginController, registerController } = require('../controllers/auth');

authRouter.post('/register', registerController);

authRouter.post('/login', loginController);

module.exports = authRouter;
