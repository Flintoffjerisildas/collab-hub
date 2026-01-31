const http = require('http');
const dotenv = require('dotenv');
// Load env vars immediately
dotenv.config();

const { Server } = require('socket.io');
const connectDB = require('./config/db.js');
const app = require('./app');

console.log('Mongo URI loaded:', process.env.MONGO_URI ? 'Yes' : 'No');

console.log('Mongo URI starts with:', process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 15) : 'Undefined');


// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Socket.io setup
const allowedOrigins = [
    process.env.CLIENT_URL,
    'https://collab-hub-virid.vercel.app',
    'http://localhost:5173'
].filter(Boolean).map(url => url.replace(/\/$/, ''));
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join user's personal room for notifications
    const userId = socket.handshake.query.userId;
    if (userId) {
        socket.join(userId);
        console.log(`User ${userId} joined their personal room`);
    }

    // Join a project room
    socket.on('join_project', (projectId) => {
        socket.join(projectId);
        console.log(`User ${socket.id} joined project: ${projectId}`);
    });

    // Leave a project room
    socket.on('leave_project', (projectId) => {
        socket.leave(projectId);
        console.log(`User ${socket.id} left project: ${projectId}`);
    });

    // Handle new message
    socket.on('send_message', (data) => {
        // Broadcast the message to all OTHER users is the room
        // data should equal the message object returned from the API
        socket.to(data.project._id || data.project).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});



// Make io accessible globally via app.get('io')
app.set('io', io);

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
