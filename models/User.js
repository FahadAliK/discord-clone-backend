const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, 'Please add a username'],
		minLength: [3, 'Username must be atleast 3 characters long'],
		maxLength: [12, 'Username can not be more that 12 characters long'],
	},
	email: {
		type: String,
		required: [true, 'Please add an email'],
		unique: true,
		match: [
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
			'Please add a valid email',
		],
	},
	password: {
		type: String,
		required: [true, 'Please add a password'],
		minLength: [6, 'Password must be atleast 6 characters long'],
		select: false,
	},
	friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	imageUrl: {
		type: String,
		default: '',
	},
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}
	const salt = await bcryptjs.genSalt(10);
	this.password = await bcryptjs.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcryptjs.compare(enteredPassword, this.password);
};

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
