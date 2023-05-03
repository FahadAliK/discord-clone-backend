const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema(
	{
		from: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'User ID is required in from field.'],
		},
		to: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'User ID is required in to field.'],
		},
		message: {
			type: String,
			required: [true, 'Message is required.'],
		},
		type: {
			type: String,
			enum: ['DIRECT', 'WORKSPACE'],
			trim: true,
		},
	},
	{ timestamps: true }
);

const MessageModel = mongoose.model('Message', MessageSchema);

module.exports = MessageModel;
