const socket = io();

const queryParams = new URLSearchParams(window.location.search);
const room = queryParams.get('room') || 'global';
console.log(`Joining room: ${room}`); // gpt_pilot_debugging_log
document.getElementById('roomTitle').innerText = `Chat Room: ${room}`;

async function fetchAndDisplayMessages(room) {
    console.log(`Fetching messages for room: ${room}`); // gpt_pilot_debugging_log
    try {
        const response = await fetch(`/api/messages/${encodeURIComponent(room)}`);
        if (!response.ok) throw new Error('Failed to fetch messages');
        console.log('Messages fetched successfully!'); // gpt_pilot_debugging_log
        const messages = await response.json();
        const messagesContainer = document.getElementById('messages');
        messages.forEach(msg => {
            const timeStr = new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            messagesContainer.innerHTML += `<p><strong>${timeStr}: ${msg.username}</strong>: ${msg.message}</p>`;
        });
    } catch (error) {
        console.error(`Error fetching messages: ${error.message}`, error.stack); // gpt_pilot_debugging_log
    }
}

document.getElementById('sendMessage').addEventListener('click', () => {
    const message = document.getElementById('messageInput').value;
    const username = sessionStorage.getItem('username');
    console.log(`Sending message: '${message}' from ${username} to room: ${room}`); // gpt_pilot_debugging_log
    socket.emit('new message', {room: room, message, username});
    document.getElementById('messageInput').value = '';
});

socket.on('message', data => {
    const timeStr = new Date(data.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    document.getElementById('messages').innerHTML += `<p><strong>${timeStr}: ${data.username}</strong>: ${data.message}</p>`;
});

socket.on('room occupancy', data => {
    console.log(`Room occupancy update for room ${data.room}: ${data.count} users`); // gpt_pilot_debugging_log
    document.getElementById('roomUsersCount').innerText = `Users in room: ${data.count}`;
});

fetchAndDisplayMessages(room);
socket.emit('join room', {room: room, username: sessionStorage.getItem('username')});

socket.on('room history', data => {
    console.log(`Received room history for room ${data.room}`); // gpt_pilot_debugging_log
    const messagesContainer = document.getElementById('messages');
    messagesContainer.innerHTML = ''; // Clear existing messages
    data.messages.forEach(msg => {
        const timeStr = new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        messagesContainer.innerHTML += `<p><strong>${timeStr}: ${msg.username}</strong>: ${msg.message}</p>`;
    });
});

socket.on('room deleted', data => {
    console.log(`Room deleted: ${data.room}`); // gpt_pilot_debugging_log
    alert(`The room ${data.room} has been deleted due to inactivity.`);
    window.location.href = '/chat-room-select'; // Redirecting user to the room selection page
});