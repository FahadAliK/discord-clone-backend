const express = require('express');
const mongoose = require('mongoose');
const colors = require('colors');
const morgan = require('morgan');
const { Server } = require('socket.io');
const { createServer } = require('http');
const errorHandler = require('./middlewares/error');

// Load env vars
require('dotenv').config({ path: './config/.env' });
const cors = require('cors');

// Route files
const authRouter = require('./routes/auth');
const verifyToken = require('./middlewares/auth');
const authSocket = require('./middlewares/authSocket');
const {
	addConnectedUser,
	removeConnectedUser,
	connectedUsers,
} = require('./utils/socket');
const friendsRouter = require('./routes/friends');

const PORT = process.env.PORT || process.env.API_PORT;

const app = express();
const server = createServer(app);
const io = new Server(server, {
	cors: { origin: '*', methods: ['GET', 'POST'] },
});

io.use((socket, next) => {
	authSocket(socket, next);
});

io.on('connection', (socket) => {
	// console.log(socket.user);
	console.log(
		`A client with id ${socket.id} has been connected successfully.`.cyan
	);
	// console.log({ socketId: socket.id });
	// console.log({ userId: socket.user.userId });

	// user connect handler
	addConnectedUser(socket.id, socket.user.id);
	// user disconnect handler
	socket.on('disconnect', () => {
		console.log(
			`A client with id ${socket.id} has been disconnected successfully.`.cyan
		);
		removeConnectedUser(socket.id, socket.user.id);
	});
});

// Enable CORS
app.use(cors());

// Body parser
app.use(express.json());

// Dev logging middleware
app.use(morgan('combined'));

// Mount routers
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/friends', verifyToken, friendsRouter);

// Test route for auth middleware
app.get('/api/v1/getMe', verifyToken, (req, res, next) => {
	res.status(200).json({ user: req.user });
});

app.use(errorHandler);

mongoose
	.connect(process.env.MONGO_URI)
	.then((connectionDetails) => {
		const { host, name } = connectionDetails.connections[0];
		console.log(
			colors.brightCyan(
				`MongoDB connect successfully... \nHost:  ${host}\nDatabase Name:  ${name}`
			)
		);
		return;
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
