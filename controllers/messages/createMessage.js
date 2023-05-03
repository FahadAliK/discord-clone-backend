const asyncHandler = require('../../middlewares/async');
const ConversationModel = require('../../models/Conversation');
const MessageModel = require('../../models/Message');
const {
	getSocketServerInstance,
	getActiveConnections,
} = require('../../socketStore');
const ErrorResponse = require('../../utils/errorResponse');
const { newMessageSchema } = require('../../utils/schemas');

async function createMessageController(req, res, next) {
	const { conversationId, from, to, message, type } = req.body;

	const { error } = newMessageSchema.validate({
		conversationId,
		from,
		to,
		message,
		type,
	});
	if (error) {
		const message = error.details.map((error) => error.message)[0];
		return next(new ErrorResponse(400, message));
	}
	const conversation = await ConversationModel.findById(conversationId);
	const newMessage = await MessageModel.create({
		from,
		to,
		message,
		type,
	});
	conversation.messages.push(newMessage._id);
	await conversation.save();
	const io = getSocketServerInstance();
	[...getActiveConnections(to), ...getActiveConnections(from)].forEach(
		async (socketId) => {
			io.to(socketId).emit(
				'new-messages',
				// await conversation.populate('messages')
				newMessage
			);
		}
	);
	res.status(201).json({
		success: true,
		message: 'Message send successfully.',
		newMessage,
	});
}

module.exports = asyncHandler(createMessageController);
