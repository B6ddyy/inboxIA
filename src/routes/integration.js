const express = require('express');
const router = express.Router();
const { addIntegration, getIntegrations } = require('../controllers/integrationController');
const { authenticate } = require('../middlewares/authenticate');

router.post('/add', authenticate, addIntegration);
router.get('/', authenticate, getIntegrations);

module.exports = router;
