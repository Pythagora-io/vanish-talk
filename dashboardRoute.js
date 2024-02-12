const express = require('express');
const router = express.Router();
const User = require('./models/userModel'); // Updated import statement
const bcrypt = require('bcrypt');
const path = require('path');
const isLoggedInMiddleware = require('./isLoggedInMiddleware');

router.get('/', isLoggedInMiddleware, async (req, res) => {
    const { userId } = req.session;
    try {
        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found for ID:', userId); // gpt_pilot_debugging_log
            return res.status(404).send('User not found');
        }
        
        // Assuming direct serving of static files with no templating, 
        // hence not dynamically rendering user data into HTML in this step.
        res.sendFile(path.join(__dirname, 'dashboard.html'));
    } catch (error) {
        console.error('Failed fetching user data for dashboard:', error.message, error.stack); // gpt_pilot_debugging_log
        res.status(500).send('Failed to load dashboard');
    }
});

router.post('/updateProfile', async (req, res) => {
    const { userId } = req.session;
    const { username, password, avatarURL } = req.body;

    console.log(`Received update profile request for user ID ${userId} with data - Username: ${username}, Password: ${password ? 'Provided' : 'Not Provided'}, AvatarURL: ${avatarURL}`); // gpt_pilot_debugging_log

    try {
        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found for provided session ID.'); // gpt_pilot_debugging_log
            return res.status(404).json({ message: 'User not found.' });
        }

        if (username) user.username = username;
        if (avatarURL) user.avatarURL = avatarURL;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        console.log(`Profile updated successfully for user: ${user.username}.`); // gpt_pilot_debugging_log
        res.json({ message: 'Profile updated successfully.' });
    } catch (error) {
        console.error(`Error updating user profile: ${error.message}`, error.stack); // gpt_pilot_debugging_log
        res.status(500).json({ message: 'Internal Server Error while updating profile.' });
    }
});

module.exports = router;