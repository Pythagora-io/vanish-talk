console.log('Is io defined:', typeof io !== 'undefined'); // gpt_pilot_debugging_log
var socket = io();

document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Socket.IO client...'); // gpt_pilot_debugging_log
    try {
        console.log('Socket.IO client has been initialized globally.'); // gpt_pilot_debugging_log

        socket.on('connect', () => {
            console.log('Connected to server via Socket.IO'); // gpt_pilot_debugging_log
        });

    } catch (error) {
        console.error('Error initializing Socket.IO client:', error.message, error.stack); // gpt_pilot_debugging_log
    }
});