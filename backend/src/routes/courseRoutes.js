 
// ============================================
// FILE: src/routes/courseRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticate } = require('../middlewares/auth');
const { generalLimiter } = require('../middlewares/rateLimiter');

router.use(authenticate);
router.use(generalLimiter);

router.get('/', courseController.getAllCourses);

router.get('/:courseId', courseController.getCourseById);

router.get('/:courseId/topics', courseController.getCourseTopics);

module.exports = router;

