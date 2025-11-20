 
// ============================================
// FILE: src/controllers/authController.js
// ============================================
const authService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/response');

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      return successResponse(res, result, 'Registration successful', 201);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      return successResponse(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = {
        id: req.user.id,
        full_name: req.user.full_name,
        email: req.user.email,
        created_at: req.user.created_at
      };
      return successResponse(res, { user }, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
