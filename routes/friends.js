const express = require('express');
const friendsRouter = express.Router();
const {
	inviteController,
	inviteAcceptController,
	inviteRejectController,
} = require('../controllers/friends');

friendsRouter.post('/invite', inviteController);
friendsRouter.post('/invite-accept', inviteAcceptController);
friendsRouter.post('/invite-reject', inviteRejectController);

module.exports = friendsRouter;
