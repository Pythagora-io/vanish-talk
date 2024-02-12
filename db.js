const mongoose = require('mongoose');
require('dotenv').config();

console.log('Attempting to load environment variables...'); // gpt_pilot_debugging_log
if (!process.env.MONGODB_URI) {
  console.error('Missing MONGODB_URI in environment variables.'); // gpt_pilot_debugging_log
}

const connectionStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/complex_chat_app_db';

try {
  mongoose.connect(connectionStr)
  .then(() => console.log(`Mongoose connected to: ${connectionStr}`))
  .catch(err => console.error(`Error connecting to MongoDB: ${err.message}`, err.stack)); // gpt_pilot_debugging_log
} catch (err) {
  console.error(`Unexpected error initializing MongoDB connection: ${err.message}`, err.stack); // gpt_pilot_debugging_log
}

mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to: ${connectionStr}`);
});
mongoose.connection.on('error', (err) => {
  console.error(`Mongoose connection error: ${err.message}`, err.stack); // gpt_pilot_debugging_log
});
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});