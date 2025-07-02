const User = require('../models/User');

exports.addIntegration = async (req, res) => {
  try {
    const userId = req.user.userId;
    const integration = req.body;

    const user = await User.findById(userId);
    // Remove integração do mesmo tipo se já existir
    user.integrations = user.integrations.filter(i => i.emailType !== integration.emailType);
    user.integrations.push(integration);
    await user.save();

    return res.json({ message: 'Integração cadastrada com sucesso', integrations: user.integrations });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getIntegrations = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    return res.json({ integrations: user.integrations });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
