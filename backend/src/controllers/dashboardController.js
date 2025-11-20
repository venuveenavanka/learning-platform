 
// ============================================
// FILE: src/controllers/dashboardController.js
// ============================================
const progressService = require('../services/progressService');
const { successResponse, errorResponse } = require('../utils/response');

class DashboardController {
  async getDashboard(req, res, next) {
    try {
      const userId = req.user.id;
      const dashboard = await progressService.getUserDashboard(userId);
      return successResponse(res, { dashboard }, 'Dashboard data retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getCourseProgress(req, res, next) {
    try {
      const { courseId } = req.params;
      const userId = req.user.id;
      
      const progress = await progressService.getUserProgress(userId, courseId);
      
      if (!progress) {
        return errorResponse(res, 'Progress not found for this course', 404);
      }
      
      return successResponse(res, { progress }, 'Progress retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();