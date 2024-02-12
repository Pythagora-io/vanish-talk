const express = require('express');
const router = express.Router();

const roomOccupancy = require('./chat').roomOccupancy; // Assuming roomOccupancy is exported from chat.js

router.get('/exists/:roomName', (req, res) => {
    const { roomName } = req.params;
    const exists = roomOccupancy[roomName] && roomOccupancy[roomName] > 0;
    res.json({ exists });
});

module.exports = router;
