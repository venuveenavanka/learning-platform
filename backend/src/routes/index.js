 
// ============================================
// FILE: src/routes/index.js
// ============================================
const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const courseRoutes = require('./courseRoutes');
const topicRoutes = require('./topicRoutes');
const quizRoutes = require('./quizRoutes');
const dashboardRoutes = require('./dashboardRoutes');

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/topics', topicRoutes);
router.use('/quizzes', quizRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;