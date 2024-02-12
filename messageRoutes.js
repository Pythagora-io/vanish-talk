const express = require('express');
const router = express.Router();
const Message = require('./models/messageModel');

router.get('/messages/:room', async (req, res) => {
    const { room } = req.params;
    console.log(`Fetching messages for room: ${room}`); // gpt_pilot_debugging_log
    try {
        const messages = await Message.find({ room: room }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        console.error(`Error fetching messages for room ${room}: ${error.message}`, error.stack); // gpt_pilot_debugging_log
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;