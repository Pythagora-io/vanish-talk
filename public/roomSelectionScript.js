document.getElementById('roomForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  let roomName = document.getElementById('roomName').value.trim(); // Modified from const to let to allow reassignment
  const password = document.getElementById('roomPassword').value;

  // Check if room name is blank and set it to "global" if so
  // gpt_pilot_debugging_log
  if (roomName === '') {
    console.log('No room name provided, defaulting to global chat.'); // gpt_pilot_debugging_log
    roomName = 'global'; // Default to global chat if room name is left blank
  }

  console.log(`Preparing to send create/join room request with roomName: ${roomName}, Password Provided: ${password ? 'Yes' : 'No'}`); // gpt_pilot_debugging_log
  console.log(`Attempting to create/join room with name: ${roomName}`, ' and password provided:', password !== ''); // gpt_pilot_debugging_log

  try {
    const response = await fetch('/api/room/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roomName, password }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`Successfully joined or created room: ${data.room.name}`); // gpt_pilot_debugging_log
      window.location.href = `/chat?room=${encodeURIComponent(roomName)}`;
    } else {
      const errorText = await response.text();
      console.error('Failed to join/create room with response:', errorText); // gpt_pilot_debugging_log
      alert('Failed to join/create room.');
    }
  } catch (error) {
    console.error('Error during fetching create/join room:', error.message, error.stack); // gpt_pilot_debugging_log
    alert('Error occurred. Please try again.');
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  const roomsList = document.getElementById('roomsList'); // Get the element that will display the list of rooms
  try {
    console.log('Fetching room list...'); // gpt_pilot_debugging_log
    const response = await fetch('/api/rooms/list'); // Make a request to get the list of rooms
    if (!response.ok) throw new Error('Failed to fetch rooms'); // gpt_pilot_debugging_log
    const rooms = await response.json(); // Parse the JSON response to get the rooms
    let roomsHtml = rooms.map(room => `<button onclick="selectRoom('${room.name}')">${room.name}</button>`); // Create HTML for each room
    roomsList.innerHTML = roomsHtml.join(''); // Set the inner HTML of the roomsList element
    console.log('Room list fetched and displayed successfully.'); // gpt_pilot_debugging_log
  } catch (error) {
    // Catch and log any errors that occur during the operation
    console.error(`Error fetching rooms: ${error.message}`, error.stack); // gpt_pilot_debugging_log
    roomsList.innerHTML = '<p>Error loading rooms. Please try again later.</p>'; // Display an error message in the UI
  }
});

function selectRoom(roomName) {
  console.log(`Room selected: ${roomName}`); // gpt_pilot_debugging_log
  document.getElementById('roomName').value = roomName; // Set the value of the roomName input to the selected room
}