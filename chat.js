const socketIo = require('socket.io');
const Message = require('./models/messageModel');
const { increaseRoomOccupancy, decreaseRoomOccupancy, roomOccupancy } = require('./roomMetadata');

function setupSocketIO(server, sessionMiddleware) {
    const io = socketIo(server);

    io.use((socket, next) => {
        sessionMiddleware(socket.request, {}, next);
    });

    io.on('connection', (socket) => {
        console.log('New client connected'); // gpt_pilot_debugging_log
        const sessionID = socket.request.sessionID;

        socket.on('join room', async ({ room, username }) => {
            console.log(`User ${username} attempting to join room: ${room} with session ID: ${sessionID}`); // gpt_pilot_debugging_log
            if (!socket.currentRoom) {
                console.log(`User ${username} with session ID ${sessionID} joining room ${room} for the first time.`); // gpt_pilot_debugging_log
                socket.join(room);
                socket.currentRoom = room;
                increaseRoomOccupancy(room, sessionID);
            } else if (socket.currentRoom !== room) {
                console.log(`User ${username} with session ID ${sessionID} switching from room ${socket.currentRoom} to ${room}.`); // gpt_pilot_debugging_log
                socket.leave(socket.currentRoom);
                decreaseRoomOccupancy(io, socket.currentRoom, sessionID);
                socket.join(room);
                socket.currentRoom = room;
                increaseRoomOccupancy(room, sessionID);
            }

            if (!socket.request.session.rooms) {
                socket.request.session.rooms = {}; // Initialize rooms object in session
            }

            if (!socket.request.session.rooms[room]) { // Check if the user has already joined the room
                socket.request.session.rooms[room] = true; // Mark the room as joined in the session
                socket.request.session.save(); // Save the session
            }

            console.log(`Current room occupancy for ${room}: ${roomOccupancy[room] || 'undefined'}`); // gpt_pilot_debugging_log

            try {
                const recentMessages = await Message.find({ room: room }).sort({ timestamp: -1 }).limit(50);
                socket.emit('room history', { room: room, messages: recentMessages });
            } catch (error) {
                console.error(`Error retrieving chat history for room: ${room}`, error.message, error.stack); // gpt_pilot_debugging_log
            }

            io.to(room).emit('room occupancy', { room: room, count: roomOccupancy[room] });
            console.log(`Room ${room} occupancy after join: ${roomOccupancy[room]}`); // gpt_pilot_debugging_log
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id} from room: ${socket.currentRoom || 'N/A'} with session ID: ${sessionID}`); // gpt_pilot_debugging_log
            if (socket.currentRoom) {
                console.log(`Decreasing room occupancy for room: ${socket.currentRoom} due to disconnection.`); // gpt_pilot_debugging_log
                decreaseRoomOccupancy(io, socket.currentRoom, sessionID);
                if (socket.request.session.rooms && socket.request.session.rooms[socket.currentRoom]) {
                    delete socket.request.session.rooms[socket.currentRoom]; // Remove the room from session
                    socket.request.session.save(); // Save the session changes
                    console.log(`Decreased occupancy for room: ${socket.currentRoom} and updated session after disconnection.`); // gpt_pilot_debugging_log
                }
            }
        });

        socket.on('leave room', ({ room, username }) => {
            console.log(`${username} leaving room: ${room}`); // gpt_pilot_debugging_log
            socket.leave(room);
            if (socket.request.session.rooms && socket.request.session.rooms[room]) {
                decreaseRoomOccupancy(io, room, sessionID);
                delete socket.request.session.rooms[room]; // Remove the room from session
                socket.request.session.save(); // Save the session changes
                console.log(`Decreased occupancy for room: ${room} upon leave and updated session.`); // gpt_pilot_debugging_log
            }
        });

        socket.on('new message', async ({ room, message, username }) => {
            console.log(`New message from ${username} in room: ${room}`); // gpt_pilot_debugging_log
            try {
                const messageData = { username, message, timestamp: new Date(), room };
                await new Message(messageData).save();
                io.to(room).emit('message', messageData);
            } catch (error) {
                console.error(`Error sending new message in room: ${room}`, error.message, error.stack); // gpt_pilot_debugging_log
            }
        });
    });
}

module.exports = setupSocketIO;