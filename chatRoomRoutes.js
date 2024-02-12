const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/chat', (req, res) => {
    console.log('Serving the chat room interface.'); // gpt_pilot_debugging_log
    const filePath = path.join(__dirname, 'public', 'chatRoom.html');
    res.sendFile(filePath, err => {
        if (err) {
            console.error('Error serving chatRoom.html:', err.message, err.stack); // gpt_pilot_debugging_log
            res.status(500).send('Failed to load the chat room interface.');
        }
    });
});

module.exports = router;