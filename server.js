const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('./db');
const app = express();
const authRoutes = require('./authRoutes');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo');
const isLoggedInMiddleware = require('./isLoggedInMiddleware');
const userRoutes = require('./userRoutes'); // Added require for userRoutes
const chatSetup = require('./chat');
const chatRoomRoutes = require('./chatRoomRoutes'); // Added require for chatRoomRoutes
const roomRoutes = require('./roomRoutes'); // Added require for roomRoutes
const messageRoutes = require('./messageRoutes'); // Added require for messageRoutes
const createRoomRoute = require('./createRoomRoute'); // Added require for createRoomRoute
const { doesRoomExist } = require('./roomMetadata'); // Added require for roomMetadata

try {
  // Parsing JSON bodies for POST requests
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Middleware to prevent modifications of req.body.content unintentionally
  app.use((req, res, next) => {
    // Logging the body before any route handling
    console.log("Incoming request body:", req.body); // Monitoring incoming request body
    next();
  });

  const sessionMiddleware = expressSession({
    secret: process.env.SESSION_SECRET, // Ensure you have SESSION_SECRET in your .env file
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
  });
  app.use(sessionMiddleware);
  console.log('Express-session configured with MongoDB store.'); // gpt_pilot_debugging_log

  // Serve static files from the 'public' directory
  app.use(express.static('public'));
  console.log('Static files are being served from the public directory.'); // gpt_pilot_debugging_log

  app.use('/api/auth', authRoutes);

  app.get('/', (req, res) => {
    try {
      const landingPagePath = path.join(__dirname, 'public', 'landingPage.html');
      console.log(`Attempting to serve landingPage.html from: ${landingPagePath}`); // gpt_pilot_debugging_log
      res.sendFile(landingPagePath);
      console.log('Served landingPage.html successfully.'); // gpt_pilot_debugging_log
    } catch (error) {
      console.error('Failed to serve landingPage.html:', error.message, error.stack); // gpt_pilot_debugging_log
      res.status(500).send('An error occurred while serving the landing page.');
    }
  });

  app.get('/api/auth/login', (req, res) => {
    try {
      res.sendFile(path.join(__dirname, 'login.html'));
      console.log('Served login.html successfully.'); // gpt_pilot_debugging_log
    } catch (error) {
      console.error('Failed to serve login.html:', error.message, error.stack); // gpt_pilot_debugging_log
      res.status(500).send('An error occurred while serving the login page.');
    }
  });

  app.get('/login', (req, res) => {
    try {
        const loginPath = path.join(__dirname, 'public', 'login.html');
        console.log(`Attempting to serve login.html from: ${loginPath}`); // gpt_pilot_debugging_log
        res.sendFile(loginPath);
        console.log('Served login.html successfully.'); // gpt_pilot_debugging_log
    } catch (error) {
        console.error('Failed to serve login.html:', error.message, error.stack); // gpt_pilot_debugging_log
        res.status(500).send('An error occurred while serving the login page.');
    }
  });

  app.get('/register', (req, res) => {
  try {
    const registerPath = path.join(__dirname, 'public', 'register.html');
    console.log(`Attempting to serve register.html from: ${registerPath}`); // gpt_pilot_debugging_log
    res.sendFile(registerPath);
    console.log('Served register.html successfully.'); // gpt_pilot_debugging_log
  } catch (error) {
    console.error('Failed to serve register.html:', error.message, error.stack); // gpt_pilot_debugging_log
    res.status(500).send('An error occurred while serving the registration page.');
  }
});

  mongoose.connection.once('open', () => {
    console.log('MongoDB connection established successfully.');
    const server = app.listen(3000, () => {
      console.log('Server is running on http://localhost:3000');
    });
    chatSetup(server, sessionMiddleware); // Passed sessionMiddleware to chatSetup
  }).on('error', (error) => {
    console.error('Error connecting to MongoDB:', error.message, error.stack);
  });

  app.get('/dashboard', isLoggedInMiddleware, (req, res) => {
    try {
        const dashboardPath = path.join(__dirname, 'public', 'dashboard.html');
        console.log(`Attempting to serve dashboard.html from: ${dashboardPath}`); // gpt_pilot_debugging_log
        res.sendFile(dashboardPath);
        console.log('Served dashboard.html successfully.'); // gpt_pilot_debugging_log
    } catch (error) {
        console.error('Failed to serve dashboard.html:', error.message, error.stack); // gpt_pilot_debugging_log
        res.status(500).send('An error occurred while serving the dashboard page.');
    }
});
  
  // Using the userRoutes
  app.use('/api/user', userRoutes);
  console.log('User routes configured successfully.'); // gpt_pilot_debugging_log

  app.get('/chat-room-select', isLoggedInMiddleware, (req, res) => {
    try {
      res.sendFile(path.join(__dirname, 'public', 'chat-room-select.html'));
      console.log('Served chat-room-select.html successfully.'); // gpt_pilot_debugging_log
    } catch (error) {
      console.error('Failed to serve chat-room-select.html:', error.message, error.stack); // gpt_pilot_debugging_log
      res.status(500).send('An error occurred while serving the chat room selection page.');
    }
  });

  // Using the roomRoutes
  app.use('/api/rooms', roomRoutes);
  console.log('Room routes configured successfully.'); // gpt_pilot_debugging_log

  // Using the messageRoutes
  app.use('/api', messageRoutes);
  console.log('Message routes configured successfully.'); // gpt_pilot_debugging_log

  // Integrating createRoomRoute to handle creation/joining of rooms with passwords
  app.use('/api/room', createRoomRoute);
  console.log('Create Room route integrated successfully.'); // gpt_pilot_debugging_log

  // Place this after other app.use() calls for routes
  app.use(chatRoomRoutes);

  // Route for joining/creating a room
  app.get('/join-room/:roomName', (req, res) => {
    const { roomName } = req.params;
    if (!doesRoomExist(roomName)) {
        // Treat as a new room
        console.log(`Room ${roomName} does not exist, treating as new.`); // gpt_pilot_debugging_log
        return res.status(200).send({ message: "Room doesn't exist, creating new room", isNewRoom: true });
    }
    // If the room exists
    console.log(`Joining existing room: ${roomName}.`); // gpt_pilot_debugging_log
    res.status(200).send({ message: 'Joining existing room', isNewRoom: false });
  });

  // Middleware for temporary debugging to log requests for missing static files
  app.use((req, res, next) => {
    console.log(`Request for non-existent static file: ${req.url}`); // gpt_pilot_debugging_log
    next();
  });

  app.use((err, req, res, next) => {
    console.error(`Error encountered: ${err.message}`, err.stack);
    res.status(500).send('An internal server error occurred');
  });
} catch (error) {
  console.error('Server configuration error:', error.message, error.stack);
}