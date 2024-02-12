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

    console.log('Update request received:', { username, password: password ? true : false, avatarURL }); // gpt_pilot_debugging_log

    try {
        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found for ID:', userId); // gpt_pilot_debugging_log
            return res.status(404).send('User not found');
        }

        console.log('Preparing to update user profile for:', user.username); // gpt_pilot_debugging_log

        if (username) user.username = username;
        if (avatarURL) user.avatarURL = avatarURL;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        console.log('Updating user profile for:', user.username); // gpt_pilot_debugging_log
        
        await user.save();
        console.log('Profile updated successfully for:', user.username); // gpt_pilot_debugging_log
        res.status(200).send('Profile updated successfully');
    } catch (error) {
        console.error(`Error updating profile: ${error.message}`, error.stack); // gpt_pilot_debugging_log
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;