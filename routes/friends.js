const express = require('express');
const friendsRouter = express.Router();
const { inviteController } = require('../controllers/friends');

friendsRouter.post('/invite', inviteController);

module.exports = friendsRouter;
