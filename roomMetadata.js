const Room = require('./models/roomModel'); // Import the Room model to interact with the database
const Message = require('./models/messageModel'); // Importing Message model to delete messages.
const roomOccupancy = {};
const roomSessions = {};
const roomDeletionTimeouts = {};

function increaseRoomOccupancy(room, sessionId) {
    if (!roomSessions[room]) {
        roomSessions[room] = new Set();
    }
    roomSessions[room].add(sessionId);
    roomOccupancy[room] = roomSessions[room].size;
    clearTimeout(roomDeletionTimeouts[room]);
    console.log(`IncreaseRoomOccupancy: Room ${room} occupancy increased to ${roomOccupancy[room]}.`); // gpt_pilot_debugging_log
}

function decreaseRoomOccupancy(io, room, sessionId) {
    if (roomSessions[room]) {
        roomSessions[room].delete(sessionId);
        roomOccupancy[room] = roomSessions[room].size;

        console.log(`DecreaseRoomOccupancy: Room ${room} occupancy decreased to ${roomOccupancy[room]}.`); // gpt_pilot_debugging_log

        if (roomOccupancy[room] <= 0) {
            clearTimeout(roomDeletionTimeouts[room]);
            roomDeletionTimeouts[room] = setTimeout(async () => {
                try {
                    // NEW: Delete the room messages from the database.
                    await Message.deleteMany({room: room})
                      .then(() => console.log(`All messages for room ${room} deleted due to inactivity.`)) // gpt_pilot_debugging_log
                      .catch((error) => console.error(`Error deleting messages for room ${room}: ${error.message}`, error.stack)); // gpt_pilot_debugging_log

                    io.to(room).emit('room deleted', { room: room });
                    delete roomOccupancy[room];
                    delete roomSessions[room];
                    Room.deleteOne({ name: room }) // Delete the room from the database
                        .then(() => console.log(`Room ${room} deleted from database due to inactivity.`)) // gpt_pilot_debugging_log
                        .catch((error) => console.error(`Error deleting room ${room} from database: ${error.message}`, error.stack)); // gpt_pilot_debugging_log
                    delete roomDeletionTimeouts[room];
                    console.log(`Room ${room} deleted due to inactivity.`); // gpt_pilot_debugging_log
                } catch (error) {
                    console.error(`Error in timeout deleting room ${room}: ${error.message}`, error.stack); // gpt_pilot_debugging_log
                }
            }, 60000);
        }
    }
}

function doesRoomExist(room) {
    const exists = roomOccupancy.hasOwnProperty(room);
    console.log(`doesRoomExist: Room ${room} exists check returned ${exists}.`); // gpt_pilot_debugging_log
    return exists;
}

module.exports = {
    increaseRoomOccupancy,
    decreaseRoomOccupancy,
    doesRoomExist,
    roomOccupancy // Exporting roomOccupancy for access in chat.js
};