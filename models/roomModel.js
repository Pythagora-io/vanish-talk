const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  hasPassword: { type: Boolean, default: false }, // Indicates if the room is protected by a password
  password: { type: String, default: '' } // Stores the password if the room is protected
}, { timestamps: true });

roomSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.hasPassword) return next();
  try {
    const bcrypt = require('bcrypt');
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error(`Error hashing password for room: ${error.message}`, error.stack); // gpt_pilot_debugging_log
    next(error);
  }
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;