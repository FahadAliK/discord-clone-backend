const inviteController = require('./invite');
const inviteAcceptController = require('./inviteAccept');
const inviteRejectController = require('./inviteReject');
const friendsControllers = {
	inviteController,
	inviteAcceptController,
	inviteRejectController,
};

module.exports = friendsControllers;
