const { Configuration, OpenAIApi } = require('openai');

async function gerarRespostaOpenAI(prompt, userOpenAiKey) {
  const configuration = new Configuration({ apiKey: userOpenAiKey });
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'Você é um assistente de atendimento ao cliente de uma loja de e-commerce.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 300
  });

  return completion.data.choices[0].message.content;
}

module.exports = { gerarRespostaOpenAI };
