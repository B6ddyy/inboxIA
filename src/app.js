require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const integrationRoutes = require('./routes/integration');
const emailRoutes = require('./routes/email');
const profileRoutes = require('./routes/profile');

const app = express();

app.use(cors());
app.use(express.json());

// Auth
app.use('/api/auth', authRoutes);

app.use('/api/user', profileRoutes);

// Integrações - aceita tanto /integration quanto /integrations
app.use('/api/integration', integrationRoutes);
app.use('/api/integrations', integrationRoutes);

// Emails - aceita tanto /email quanto /emails
app.use('/api/email', emailRoutes);
app.use('/api/emails', emailRoutes);

// Rotas extras para dashboard, sync e usuário (mock inicialmente)
app.get('/api/dashboard/stats', (req, res) => res.json({ data: { total: 10, atendidos: 5, pendentes: 2, aguardando: 3 } }));
app.get('/api/dashboard/recent-activity', (req, res) => res.json({ data: [] }));
app.post('/api/sync', (req, res) => res.json({ success: true }));

// Perfil do usuário (mock)
app.put('/api/user/profile', (req, res) => res.json({ success: true }));
app.post('/api/user/change-password', (req, res) => res.json({ success: true }));
app.put('/api/user/preferences', (req, res) => res.json({ success: true }));

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

// Automação (caso você use cron)
const cron = require('node-cron');
const { processarTodosOsUsuarios } = require('./services/automationService');

// Executa a cada 5 minutos
cron.schedule('*/5 * * * *', async () => {
  console.log('Executando automação de e-mails...');
  await processarTodosOsUsuarios();
});
