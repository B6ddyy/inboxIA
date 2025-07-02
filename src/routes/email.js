const express = require('express');
const router = express.Router();
const { getUnreadEmails, sendEmail, sugerirResposta, getHistory } = require('../controllers/emailController');
const { authenticate } = require('../middlewares/authenticate');

router.get('/unread', authenticate, getUnreadEmails);
router.post('/send', authenticate, require('../controllers/emailController').sendEmail);
router.post('/suggest', authenticate, require('../controllers/emailController').sugerirResposta);
router.get('/history', authenticate, require('../controllers/emailController').getHistory);


module.exports = router;
