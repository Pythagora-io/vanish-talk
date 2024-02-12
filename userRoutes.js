const express = require('express');
const router = express.Router();
const User = require('./models/userModel'); // Updated to reflect new path
const isLoggedInMiddleware = require('./isLoggedInMiddleware');

router.get('/data', isLoggedInMiddleware, async (req, res) => {
    const { userId } = req.session;
    console.log(`Fetching data for user ID: ${userId}`); // gpt_pilot_debugging_log
    try {
        const user = await User.findById(userId).select("-password -verificationToken");
        if (!user) {
            console.log('User data fetch failed - User not found.'); // gpt_pilot_debugging_log
            return res.status(404).json({ message: 'User not found' });
        }
        console.log(`User data fetched successfully for user ID: ${userId}`); // gpt_pilot_debugging_log
        res.json(user);
    } catch (error) {
        console.error(`Error fetching user data: ${error.message}`, error.stack); // gpt_pilot_debugging_log
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;