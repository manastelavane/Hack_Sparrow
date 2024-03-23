const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const uuid4 = require('uuid4');
const { Server } = require('socket.io');

const userRouter = require('./routes/user.js');
const blogsRouter = require('./routes/blog.js');
const roomsRouter = require('./routes/room.js');
const chatRouter = require('./routes/chat.js');

const app = express();
dotenv.config();
const PORT = process.env.PORT || 8080;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-Requested-With, Content-Type, Authorization'
    );
    next();
});
app.use(express.json({ limit: '10MB' }));

app.use('/api/user', userRouter);
app.use('/api/blog', blogsRouter);
app.use('/api/chat', chatRouter);
app.use('/api/rooms', roomsRouter);

app.get('/mtoken', (req, res) => {
    var app_access_key = process.env.HMS_ACCESS_KEY;
    var app_secret = process.env.HMS_SECRET_APP;
    try {
        const token = jwt.sign(
            {
                access_key: app_access_key,
                type: 'management',
                version: 2,
                iat: Math.floor(Date.now() / 1000),
                nbf: Math.floor(Date.now() / 1000),
            },
            app_secret,
            {
                algorithm: 'HS256',
                expiresIn: '1h',
                jwtid: uuid4(),
            }
        );
        res.status(200).json({
            success: true,
            data: {
                token,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: { error },
        });
    }
});

app.get('/', (req, res) => {
    res.send('Hello, welocme to  API!');
});

mongoose.set('strictQuery', false);
mongoose
    .connect(process.env.CONNECTION_URL)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch((error) => console.log(`${error} did not connect`));

const server = app.listen(PORT, () =>
    console.log('Hello! This is backend, listening on port - ', PORT)
);

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.CLIENT_URL,
    },
});

let online_users = [];
const chat = io.of('/chat');
chat.on('connection', (socket) => {
    socket.on('join', ({ newUserId, onlineStatus }) => {
        if (!online_users.some((user) => user.userId === newUserId)) {
            online_users.push({
                userId: newUserId,
                socketId: socket.id,
                onlineStatus,
            });
            console.log('New User Connected', online_users);
        }
        chat.emit('online_users', online_users);
    });

    socket.on('send_message', (data) => {
        const { receiverId, senderId } = data;
        const user = online_users.find((user) => user.userId === receiverId);
        const self = online_users.find((user) => user.userId === senderId);
        if (user) {
            chat.to(user.socketId).emit('recieve_message', data);
            chat.to(user.socketId).emit('recieve_notification', data);
        }
        if (self) {
            chat.to(self.socketId).emit('update_user_chats', data);
        }
    });

    socket.on('start_typing', (data) => {
        const { receiverId } = data;
        const user = online_users.find((user) => user.userId === receiverId);
        if (user) {
            chat.to(user.socketId).emit('typing_status', data);
        }
    });

    socket.on('stop_typing', (data) => {
        const { receiverId } = data;
        const user = online_users.find((user) => user.userId === receiverId);
        if (user) {
            chat.to(user.socketId).emit('typing_status', data);
        }
    });

    socket.on('disconnect', () => {
        online_users = online_users.filter(
            (user) => user.socketId !== socket.id
        );
        // console.log('User Disconnected', online_users);
        chat.emit('online_users', online_users);
    });
});
