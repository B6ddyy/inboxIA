const User = require('../models/User');
const Email = require('../models/Email');
const { fetchUnreadEmails } = require('./imapService');
const { gerarRespostaOpenAI } = require('./openaiService');
const { sendEmail } = require('./smtpService');
// const { getOrderStatusFromShopify } = require('./shopifyService'); // para futuro

async function processarEmailsParaUsuario(user) {
  // Para cada integração de e-mail cadastrada
  for (const integration of user.integrations) {
    if (!integration.email || !integration.appPassword) continue;

    // 1. Buscar e-mails não lidos
    let emails = [];
    try {
      emails = await fetchUnreadEmails(integration);
    } catch (e) {
      console.error(`Falha ao buscar e-mails do usuário ${user.email}: ${e.message}`);
      continue;
    }

    // 2. Salvar cada e-mail no histórico se ainda não existe
    for (const e of emails) {
      const exists = await Email.findOne({ userId: user._id, from: e.from, subject: e.subject, body: e.text });
      if (exists) continue;

      const emailDoc = await Email.create({
        userId: user._id,
        from: e.from,
        to: integration.email,
        subject: e.subject,
        body: e.text,
        receivedAt: new Date(e.date)
      });

      // 3. Criar o prompt para IA (pode enriquecer com dados Shopify futuramente)
      let prompt = `
        O cliente enviou o seguinte e-mail:
        "${e.text}"
        Responda de forma educada, personalizada e profissional, como um atendente da loja online.
      `;

      // Exemplo para enriquecer o prompt futuramente:
      // if (orderIdDetectadoNoEmail) {
      //   const status = await getOrderStatusFromShopify(orderId, integration.shopifyToken, integration.shopifyStore);
      //   prompt += `\nStatus do pedido: ${status}`;
      // }

      // 4. Gerar resposta com IA
      let resposta;
      try {
        if (integration.openaiKey) {
          resposta = await gerarRespostaOpenAI(prompt, integration.openaiKey);
        } else {
          resposta = 'Não foi possível gerar resposta automática (OpenAI não integrado).';
        }
      } catch (e) {
        resposta = 'Falha ao gerar resposta automática.';
        console.error(`OpenAI error: ${e.message}`);
      }

      // 5. Salvar resposta no histórico
      emailDoc.resposta = resposta;
      emailDoc.responded = true;
      emailDoc.respondedAt = new Date();
      await emailDoc.save();

      // 6. Enviar e-mail de resposta para o cliente
      try {
        await sendEmail({
          emailType: integration.emailType,
          email: integration.email,
          appPassword: integration.appPassword,
          to: e.from,
          subject: `Re: ${e.subject}`,
          text: resposta
        });
        console.log(`Resposta enviada para ${e.from} (usuário ${user.email})`);
      } catch (err) {
        console.error(`Falha ao enviar resposta para ${e.from}: ${err.message}`);
      }
    }
  }
}

async function processarTodosOsUsuarios() {
  const users = await User.find();
  for (const user of users) {
    await processarEmailsParaUsuario(user);
  }
}

module.exports = { processarTodosOsUsuarios };
