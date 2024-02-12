const express = require('express');
const router = express.Router();
const User = require('./models/userModel'); // Updated to reflect new path
const isLoggedInMiddleware = require('./isLoggedInMiddleware');

router.get('/data', isLoggedInMiddleware, async (req, res) => {
    const { userId } = req.session;
    try {
        const user = await User.findById(userId).select("-password -verificationToken");
        if (!user) {
            console.log(`User with ID ${userId} not found in /data endpoint.`); // gpt_pilot_debugging_log
            return res.status(404).json({ message: 'User not found' });
        }
        console.log(`User data fetched successfully for user ID ${userId}.`); // gpt_pilot_debugging_log
        res.json(user);
    } catch (error) {
        console.error(`Error fetching user data: ${error.message}`, error.stack); // gpt_pilot_debugging_log
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/set-new-password', isLoggedInMiddleware, async (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword) {
        console.log('No new password provided in /set-new-password endpoint.'); // gpt_pilot_debugging_log
        return res.status(400).json({ message: 'New password must be provided.' });
    }
    try {
        const userId = req.session.userId;
        const user = await User.findById(userId);
        if (!user) {
            console.log(`User not found with ID ${userId} during password update process.`); // gpt_pilot_debugging_log
            return res.status(404).json({ message: 'User not found.' });
        }
        user.password = newPassword;  // Directly assign the new password
        await user.save();
        console.log(`Password updated successfully for userId ${userId}.`); // gpt_pilot_debugging_log
        res.status(200).json({ message: 'Password updated successfully. Please log in with your new password.', redirectTo: '/login' });
    } catch (error) {
        console.error(`Error updating user password: ${error.message}`, error.stack); // gpt_pilot_debugging_log
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/updateProfile', isLoggedInMiddleware, async (req, res) => {
    const { userId } = req.session;
    const { username, password, avatarURL } = req.body;

    if (!userId) {
        console.log('Unauthorized access attempt detected in /updateProfile endpoint.'); // gpt_pilot_debugging_log
        res.status(401).send('Unauthorized access.');
        return;
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            console.log(`User not found with ID ${userId} during profile update.`); // gpt_pilot_debugging_log
            res.status(404).send('User not found.');
            return;
        }

        if (username) user.username = username;
        if (avatarURL) user.avatarURL = avatarURL;
        if (password) {
            console.log(`Updating password for user: ${user.username}.`); // gpt_pilot_debugging_log
            user.password = password; // Let the model handle hashing
        }

        await user.save();
        console.log(`Profile updated successfully for user: ${user.username}.`); // gpt_pilot_debugging_log
        res.json({ message: 'Profile updated successfully.' }); // gpt_pilot_debugging_log
    } catch (error) {
        console.error(`Error updating user profile: ${error.message}`, error.stack); // gpt_pilot_debugging_log
        res.status(500).send('Failed to update profile.');
    }
});

module.exports = router;