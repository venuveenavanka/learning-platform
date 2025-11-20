 
// ============================================
// FILE: src/routes/dashboardRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticate } = require('../middlewares/auth');
const { generalLimiter } = require('../middlewares/rateLimiter');

router.use(authenticate);
router.use(generalLimiter);

router.get('/', dashboardController.getDashboard);

router.get('/progress/:courseId', dashboardController.getCourseProgress);

module.exports = router;
