 
// ============================================
// FILE: src/controllers/quizController.js
// ============================================
const quizService = require('../services/quizService');
const { successResponse, errorResponse } = require('../utils/response');

class QuizController {
  async startQuiz(req, res, next) {
    try {
      const { topicId } = req.body;
      const userId = req.user.id;
      
      const quiz = await quizService.startQuiz(topicId, userId);
      return successResponse(res, { quiz }, 'Quiz started successfully');
    } catch (error) {
      if (error.message.includes('locked')) {
        return errorResponse(res, error.message, 403);
      }
      next(error);
    }
  }

  async submitQuiz(req, res, next) {
    try {
      const { topicId, answers } = req.body;
      const userId = req.user.id;
      
      const result = await quizService.submitQuiz(topicId, userId, answers);
      return successResponse(res, { result }, 'Quiz submitted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new QuizController();