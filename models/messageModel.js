const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  room: { type: String, default: 'global' },
  username: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

messageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400, partialFilterExpression : { room: 'global' } });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;