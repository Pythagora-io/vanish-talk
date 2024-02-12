const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const Room = require('./models/roomModel');
const User = require('./models/userModel'); // Corrected path

router.post('/create', async (req, res) => {
  if (!req.session.userId) {
    console.log('Unauthorized access attempt due to missing session userId.'); // gpt_pilot_debugging_log
    return res.status(401).send('Unauthorized access.');
  }
  try {
    // Validate the session userId
    const user = await User.findById(req.session.userId);
    if (!user) {
      console.log('Unauthorized access attempt with invalid session userId.'); // gpt_pilot_debugging_log
      return res.status(401).send('Unauthorized access: User not found.');
    }

    const { roomName, password } = req.body;
    let room = await Room.findOne({ name: roomName });
    if (room) {
      console.log(`Room found: ${room.name}`); // gpt_pilot_debugging_log
      if(room.hasPassword && password) {
        console.log('Verifying password for a protected room.'); // gpt_pilot_debugging_log
        const isMatch = await bcrypt.compare(password, room.password);
        if (!isMatch) {
            console.log('Provided password does not match.'); // gpt_pilot_debugging_log
            return res.status(401).json({ message: 'Incorrect password for room.' });
        } else {
            console.log(`Room accessed successfully - Room name: ${roomName}, Has Password: ${room.hasPassword}`); // gpt_pilot_debugging_log
            return res.status(200).json({ message: 'Room accessed successfully.', room: { name: roomName, hasPassword: true } });
        }
      } else if(room.hasPassword && !password) {
        console.log('Password required for access.'); // gpt_pilot_debugging_log
        return res.status(401).json({ message: 'Password required for room.' });
      } else {
        console.log(`Room accessed successfully - Room name: ${roomName}, No Password`); // gpt_pilot_debugging_log
        return res.status(200).json({ message: 'Room accessed successfully.', room: { name: roomName, hasPassword: false } });
      }
    } else {
      console.log(`Room ${roomName} not found. Proceeding with creation.`); // gpt_pilot_debugging_log
      let hasPassword = false;
      if(password) {
        hasPassword = true;
        // Directly assign the password without hashing here
        console.log(`Assigning password for new room to be hashed in model.`); // gpt_pilot_debugging_log
      }
      room = new Room({
        name: roomName,
        hasPassword,
        password // Pass the password as is for hashing in pre-save middleware
      });
      await room.save();
      console.log(`Room created successfully - Room name: ${roomName}, Has Password: ${hasPassword}`); // gpt_pilot_debugging_log
      res.status(200).json({ message: 'Room created and accessed successfully.', room: { name: roomName, hasPassword } });
    }
  } catch (error) {
    console.error(`Error during room creation/joining: ${error.message}`, error.stack); // gpt_pilot_debugging_log
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;