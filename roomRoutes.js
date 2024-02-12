const express = require('express');
const router = express.Router();
const Room = require('./models/roomModel');

router.get('/list', async (req, res) => {
    try {
        const rooms = await Room.find().select('-password');
        res.json(rooms);
    } catch (error) {
        console.error(`Error fetching rooms: ${error.message}`, error.stack);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;