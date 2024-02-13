const express = require('express');
const router = express.Router();
const User = require('./models/userModel'); // Updated import statement
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

router.post('/register', async (req, res) => {
    console.log('Starting registration process.');
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        console.log('Registration attempt failed - missing fields.');
        return res.status(400).json({ message: 'Please enter all fields' });
    }
    try {
        let user = await User.findOne({ email });
        if (user) {
            console.log('Registration attempt failed - user already exists.');
            return res.status(400).json({ message: 'User already exists' });
        }
        user = new User({ username, email, password });
        // Generate verification token
        user.generateVerificationToken();
        await user.save();

        // Send verification email
        const verificationUrl = `http://localhost:3000/api/auth/verify-email?token=${user.verificationToken}&reset=true`; // Modified as per instructions
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: 'Verify Your Email',
            html: `<p>Please click the link to verify your email and set your password: <a href="${verificationUrl}">${verificationUrl}</a></p>`
        });
        console.log(`Verification email sent to ${email} with reset option.`); // gpt_pilot_debugging_log

        res.status(201).json({ message: 'User registered successfully. Please check your email to verify your account and set your password.' });
    } catch (error) {
        console.error(`Register Error: ${error.message}`, error.stack); // gpt_pilot_error_log
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    console.log('Processing login request.');
    const { email, password } = req.body;
    console.log(`Login data - Email: ${email}, Password: [HIDDEN]`);
    if (!email || !password) {
        console.log('Login attempt failed - missing fields.');
        return res.status(400).json({ message: 'Please enter all fields' });
    }
    try {
        console.log(`Attempting to find user with email: ${email}`);
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Login attempt failed - user does not exist.');
            return res.status(400).json({ message: 'User does not exist' });
        }
        console.log(`User found. Verifying password for user: ${user.username}`);
        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            console.log('Login attempt failed - invalid credentials.');
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        console.log(`Password verified for user: ${user.username}. Generating token.`);
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 3600 });

        try {
            if (!req.session) {
                console.error('Session object is undefined.'); // gpt_pilot_error_log
                return res.status(500).json({ message: 'Internal server error related to session management.' });
            }
            req.session.userId = user._id; // Setting userId in session
            console.log(`Login process completed. Session ID: ${req.sessionID}, User ID in session: ${req.session.userId}`); // gpt_pilot_debugging_log
        } catch (error) {
            console.error('Error while handling session data:', error.message, error.stack); // gpt_pilot_error_log
            return res.status(500).json({ message: 'Error while handling session data.' });
        }

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatarURL: user.avatarURL
            }
        });
        console.log(`User ${user.username} logged in successfully.`); // gpt_pilot_debugging_log
    } catch (error) {
        console.error(`Login Error: ${error.message}`, error.stack); // gpt_pilot_error_log
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/verify-email', async (req, res) => {
    console.log('Starting email verification process.');
    console.log(`Accessing /verify-email with token: ${req.query.token}`);
    console.log(`Received request to verify email with token: ${req.query.token}`);
    const { token } = req.query;

    if (!token) {
        console.log('Email verification failed - no token provided.');
        return res.status(400).json({ message: 'Invalid verification link or expired' });
    }

    try {
        const user = await User.findOne({ verificationToken: token });
        
        if (!user) {
            console.log('Email verification failed - token not found.');
            return res.status(400).json({ message: 'Invalid verification link or expired' });
        }

        user.verificationToken = undefined;
        await user.save();

        console.log(`User ${user.email} email verified successfully, redirecting to email verified success page.`); // gpt_pilot_debugging_log
        res.redirect('/emailVerified.html');
    } catch (error) {
        console.error(`Verification Error: ${error.message}`, error.stack); // gpt_pilot_error_log
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;