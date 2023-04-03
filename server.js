const express = require('express');
const mongoose = require('mongoose');
const colors = require('colors');
const morgan = require('morgan');
const { createServer } = require('http');
const errorHandler = require('./middlewares/error');

// Load env vars
require('dotenv').config({ path: './config/server.env' });
const cors = require('cors');

// Route files
const authRouter = require('./routes/auth');
const verifyToken = require('./middlewares/auth');

const friendsRouter = require('./routes/friends');
const { createSocketServer } = require('./socketServer');
const conversationsRouter = require('./routes/conversations');

const PORT = process.env.PORT || 5000;

const app = express();
const server = createServer(app);

// Register socket server
createSocketServer(server);

// Enable CORS
app.use(cors());

// Body parser
app.use(express.json());

// Dev logging middleware
app.use(morgan('combined'));

// Mount routers
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/friends', verifyToken, friendsRouter);
app.use('/api/v1/conversations', verifyToken, conversationsRouter);

// Test route for auth middleware
app.get('/api/v1/getMe', verifyToken, (req, res, next) => {
	res.status(200).json({ user: req.user });
});

app.use(errorHandler);

mongoose
	.connect(process.env.MONGO_URI_LOCAL)
	.then((connectionDetails) => {
		const { host, name } = connectionDetails.connections[0];
		console.log(
			colors.brightCyan(
				`MongoDB connect successfully... \nHost:  ${host}\nDatabase Name:  ${name}`
			)
		);
	})
	.catch((error) => {
		console.log(colors.underline.red('Server is not starting...'));
		console.log(colors.underline.red('Unable to connect DB...'));
		console.log(colors.red.bold(error.message));
	});

server.listen(PORT, () => {
	const serverStatus = `Server running on port ${PORT}`;
	console.log(colors.brightYellow(serverStatus));
});
