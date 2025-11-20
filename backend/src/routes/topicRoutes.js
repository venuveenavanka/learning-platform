 
// ============================================
// FILE: src/routes/topicRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');
const { authenticate } = require('../middlewares/auth');
const { generalLimiter } = require('../middlewares/rateLimiter');

router.use(authenticate);
router.use(generalLimiter);

router.get('/:topicId/content', topicController.getTopicContent);

module.exports = router;