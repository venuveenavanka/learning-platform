 
// ============================================
// FILE: src/controllers/courseController.js
// ============================================
const courseService = require('../services/courseService');
const { successResponse, errorResponse } = require('../utils/response');

class CourseController {
  async getAllCourses(req, res, next) {
    try {
      const courses = await courseService.getAllCourses();
      return successResponse(res, { courses }, 'Courses retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getCourseById(req, res, next) {
    try {
      const { courseId } = req.params;
      const course = await courseService.getCourseById(courseId);
      return successResponse(res, { course }, 'Course retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getCourseTopics(req, res, next) {
    try {
      const { courseId } = req.params;
      const userId = req.user.id;
      
      const result = await courseService.getCourseTopics(courseId, userId);
      return successResponse(res, result, 'Topics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CourseController();
