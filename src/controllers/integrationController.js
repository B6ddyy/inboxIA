const User = require('../models/User');

// Adicionar integração
exports.addIntegration = async (req, res) => {
  try {
    const userId = req.user.userId;
    const integration = req.body;

    const user = await User.findById(userId);
    // Remove integração do mesmo tipo se já existir
    user.integrations = user.integrations.filter(i => i.emailType !== integration.emailType);
    user.integrations.push({ ...integration, _id: new Date().getTime().toString() }); // Gera um id simples se não vier do frontend
    await user.save();

    return res.json({ success: true, message: 'Integração cadastrada com sucesso', data: user.integrations });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Listar integrações
exports.getIntegrations = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    return res.json({ success: true, data: user.integrations || [] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Atualizar integração
exports.updateIntegration = async (req, res) => {
  try {
    const userId = req.user.userId;
    const integrationId = req.params.id;
    const update = req.body;

    const user = await User.findById(userId);

    let found = false;
    user.integrations = user.integrations.map(i => {
      if (i._id == integrationId || (i.id && i.id == integrationId)) {
        found = true;
        return { ...i, ...update, _id: integrationId };
      }
      return i;
    });

    if (!found) {
      return res.status(404).json({ success: false, error: 'Integração não encontrada' });
    }

    await user.save();

    return res.json({ success: true, message: 'Integração atualizada com sucesso', data: user.integrations });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Testar integração (apenas mock para simular sucesso)
exports.testIntegration = async (req, res) => {
  try {
    // Aqui você pode colocar sua lógica real para testar integração
    return res.json({ success: true, message: 'Teste de integração executado com sucesso!' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
