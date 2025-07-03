const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authenticate');
const User = require('../models/User');

router.post('/prompt', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.contextPrompt = req.body.prompt;
    await user.save();
    res.json({ success: true, message: 'Prompt salvo com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
