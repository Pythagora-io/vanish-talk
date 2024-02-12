document.getElementById('roomForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  const roomName = document.getElementById('roomName').value.trim();
  const password = document.getElementById('roomPassword').value; // Fetch password from input
  try {
    console.log(`Attempting to create or join room: ${roomName} with password: ${password ? 'yes' : 'no'}`); // gpt_pilot_debugging_log
    const response = await fetch('/api/room/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roomName, password }),
    });
    if (response.ok) {
      console.log(`Successfully joined or created room: ${roomName}`); // gpt_pilot_debugging_log
      window.location.href = `/chat?room=${encodeURIComponent(roomName)}`;
    } else {
      console.error('Failed to join/create room, server response was not OK.'); // gpt_pilot_debugging_log
      const { message } = await response.json();
      console.error('Failed to join/create room, server response was not OK:', message); // gpt_pilot_debugging_log
      alert(message);
    }
  } catch (error) {
    console.error('Error while joining/creating room:', error.message, error.stack); // gpt_pilot_debugging_log // gpt_pilot_debugging_log
    alert('Failed to join/create room.');
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  const roomsList = document.getElementById('roomsList');
  try {
    console.log('Fetching room list...'); // gpt_pilot_debugging_log
    const response = await fetch('/api/rooms/list');
    if (!response.ok) throw new Error('Failed to fetch rooms');
    const rooms = await response.json();
    let roomsHtml = rooms.map(room => `<button onclick="selectRoom('${room.name}')">${room.name}</button>`);
    roomsList.innerHTML = roomsHtml.join('');
    console.log('Room list fetched and displayed successfully.'); // gpt_pilot_debugging_log
  } catch (error) {
    console.error(`Error fetching rooms: ${error.message}`, error.stack); // gpt_pilot_debugging_log // gpt_pilot_debugging_log
    roomsList.innerHTML = '<p>Error loading rooms. Please try again later.</p>';
  }
});

function selectRoom(roomName) {
  console.log(`Room selected: ${roomName}`); // gpt_pilot_debugging_log
  document.getElementById('roomName').value = roomName;
}