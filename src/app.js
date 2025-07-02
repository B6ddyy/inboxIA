require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const integrationRoutes = require('./routes/integration');
const emailRoutes = require('./routes/email');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/integration', integrationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/email', emailRoutes);

app.get('/', (req, res) => res.json({ message: 'API rodando!' }));

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB conectado!');
  app.listen(process.env.PORT, () => {
    console.log('Servidor rodando na porta', process.env.PORT);
  });
}).catch((err) => {
  console.error('Erro ao conectar no MongoDB:', err);
});

const cron = require('node-cron');
const { processarTodosOsUsuarios } = require('./services/automationService');

// Executa a cada 5 minutos
cron.schedule('*/5 * * * *', async () => {
  console.log('Executando automação de e-mails...');
  await processarTodosOsUsuarios();
});
