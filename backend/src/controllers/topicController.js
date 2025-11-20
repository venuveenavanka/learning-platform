 
// ============================================
// FILE: src/controllers/topicController.js
// ============================================
const topicService = require('../services/topicService');
const { successResponse, errorResponse } = require('../utils/response');

class TopicController {
  async getTopicContent(req, res, next) {
    try {
      const { topicId } = req.params;
      const userId = req.user.id;
      
      const content = await topicService.getTopicContent(topicId, userId);
      return successResponse(res, { topic: content }, 'Topic content retrieved successfully');
    } catch (error) {
      if (error.message.includes('locked')) {
        return errorResponse(res, error.message, 403);
      }
      next(error);
    }
  }
}

module.exports = new TopicController();
