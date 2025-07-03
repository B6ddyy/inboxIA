const mongoose = require('mongoose');

const IntegrationSchema = new mongoose.Schema({
  emailType: String,
  email: String,
  appPassword: String,
  shopifyStore: String,
  shopifyToken: String,
  openaiKey: String,
});

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  passwordHash: String,
  integrations: [IntegrationSchema],
  contextPrompt: String
});

module.exports = mongoose.model('User', UserSchema);
