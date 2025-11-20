 
// ============================================
// FILE: src/routes/authRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');
const { validate } = require('../middlewares/validator');
const { authLimiter } = require('../middlewares/rateLimiter');

router.post('/register',
  authLimiter,
  [
    body('full_name')
      .trim()
      .notEmpty().withMessage('Full name is required')
      .isLength({ min: 2, max: 200 }).withMessage('Name must be between 2-200 characters'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  validate,
  authController.register
);

router.post('/login',
  authLimiter,
  [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required')
  ],
  validate,
  authController.login
);

router.get('/profile',
  authenticate,
  authController.getProfile
);

module.exports = router;