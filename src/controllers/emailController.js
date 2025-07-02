const User = require('../models/User');
const Email = require('../models/Email');
const { gerarRespostaOpenAI } = require('../services/openaiService');
const { fetchUnreadEmails } = require('../services/imapService');
const { sendEmail } = require('../services/smtpService');

exports.getUnreadEmails = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const integration = user.integrations[0];
    if (!integration) return res.status(400).json({ error: 'Integração não cadastrada' });

    const emails = await fetchUnreadEmails(integration);

    // Salva no banco se ainda não existe (evita duplicidade)
    for (const e of emails) {
      const exists = await Email.findOne({ userId: user._id, from: e.from, subject: e.subject, body: e.text });
      if (!exists) {
        await Email.create({
          userId: user._id,
          from: e.from,
          to: integration.email,
          subject: e.subject,
          body: e.text,
          receivedAt: new Date(e.date)
        });
      }
    }

    // Retorna e-mails salvos no banco do usuário
    const savedEmails = await Email.find({ userId: user._id }).sort({ receivedAt: -1 }).limit(20);
    return res.json({ emails: savedEmails });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


exports.sendEmail = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const integration = user.integrations[0];
    if (!integration) return res.status(400).json({ error: 'Integração não cadastrada' });

    const { to, subject, text } = req.body;
    await sendEmail({ ...integration, to, subject, text });
    return res.json({ message: 'E-mail enviado com sucesso' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.sugerirResposta = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const integration = user.integrations[0];
    if (!integration || !integration.openaiKey)
      return res.status(400).json({ error: 'Integração OpenAI não cadastrada' });

    // O prompt pode ser criado com o texto do e-mail, status do pedido, etc
    const { emailId } = req.body;
    const email = await Email.findById(emailId);
    if (!email) return res.status(404).json({ error: 'Email não encontrado' });

    // Aqui você pode enriquecer o prompt com informações do pedido via Shopify futuramente
    const prompt = `
      O cliente enviou o seguinte e-mail:
      "${email.body}"
      Responda de forma educada, personalizada e profissional, como um atendente da loja online.
    `;

    const resposta = await gerarRespostaOpenAI(prompt, integration.openaiKey);

    // Salva a sugestão no histórico
    email.resposta = resposta;
    email.responded = true;
    email.respondedAt = new Date();
    await email.save();

    return res.json({ resposta });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const emails = await Email.find({ userId })
      .sort({ receivedAt: -1 })
      .limit(50); // ou ajuste conforme precisar
    return res.json({ emails });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
