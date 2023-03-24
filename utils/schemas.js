const Joi = require('joi');

const loginSchema = Joi.object({
	email: Joi.string().email().required().messages({
		'string.base': 'Email must be a string',
		'string.empty': 'Please add a email',
		'string.email': 'Please add a valid email',
	}),
	password: Joi.string().min(6).max(12).required().messages({
		'string.base': 'Password must be a string',
		'string.empty': 'Please add a password',
		'string.min': 'Password must be atleast 6 characters long',
		'string.max': 'Password can not be more that 12 characters long',
	}),
});

const registerSchema = Joi.object({
	username: Joi.string().min(3).max(12).required().messages({
		'string.base': 'Username must be a string',
		'string.empty': 'Please add a username',
		'string.min': 'Username must be atleast 3 characters long',
		'string.max': 'Username can not be more that 12 characters long',
	}),
	password: Joi.string().min(6).max(12).required().messages({
		'string.base': 'Password must be a string',
		'string.empty': 'Please add a password',
		'string.min': 'Password must be atleast 6 characters long',
		'string.max': 'Password can not be more that 12 characters long',
	}),
	email: Joi.string().email().required().messages({
		'string.base': 'Email must be a string',
		'string.empty': 'Please add a email',
		'string.email': 'Please add a valid email',
	}),
});

const inviteSchema = Joi.object({
	email: Joi.string().email().required().messages({
		'string.base': 'Email must be a string',
		'string.empty': 'Please add a email',
		'string.email': 'Please add a valid email',
	}),
});

module.exports = { loginSchema, registerSchema, inviteSchema };
