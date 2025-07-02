const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  from: String,
  to: String,
  subject: String,
  body: String,
  resposta: String,
  responded: { type: Boolean, default: false },
  receivedAt: Date,
  respondedAt: Date
});

module.exports = mongoose.model('Email', EmailSchema);
