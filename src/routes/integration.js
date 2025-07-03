const express = require('express');
const router = express.Router();
const { 
  addIntegration, 
  getIntegrations, 
  updateIntegration, 
  testIntegration 
} = require('../controllers/integrationController');
const { authenticate } = require('../middlewares/authenticate');

// Criar integração
router.post('/add', authenticate, addIntegration);

// Listar integrações
router.get('/', authenticate, getIntegrations);

// Atualizar integração (PUT /api/integrations/:id)
router.put('/:id', authenticate, updateIntegration);

// Testar integração (POST /api/integrations/:id/test)
router.post('/:id/test', authenticate, testIntegration);

module.exports = router;
