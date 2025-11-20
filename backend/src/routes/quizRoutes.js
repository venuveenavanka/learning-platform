 
// ============================================
// FILE: src/routes/quizRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const quizController = require('../controllers/quizController');
const { authenticate } = require('../middlewares/auth');
const { validate } = require('../middlewares/validator');
const { quizLimiter } = require('../middlewares/rateLimiter');

router.use(authenticate);

router.post('/start',
  quizLimiter,
  [
    body('topicId')
      .notEmpty().withMessage('Topic ID is required')
      .isInt({ min: 1 }).withMessage('Invalid topic ID')
  ],
  validate,
  quizController.startQuiz
);

router.post('/submit',
  quizLimiter,
  [
    body('topicId')
      .notEmpty().withMessage('Topic ID is required')
      .isInt({ min: 1 }).withMessage('Invalid topic ID'),
    body('answers')
      .isArray({ min: 1 }).withMessage('Answers must be a non-empty array'),
    body('answers.*.question_id')
      .notEmpty().withMessage('Question ID is required')
      .isInt({ min: 1 }).withMessage('Invalid question ID'),
    body('answers.*.selected_option_ids')
      .isArray().withMessage('Selected options must be an array')
  ],
  validate,
  quizController.submitQuiz
);

module.exports = router;
