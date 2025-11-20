 
// ============================================
// FILE: src/services/topicService.js
// ============================================
const { Topic, UserProgress, Course } = require('../models');

class TopicService {
  async getTopicContent(topicId, userId) {
    const topic = await Topic.findByPk(topicId, {
      include: [{
        model: Course,
        attributes: ['id', 'title']
      }]
    });

    if (!topic) {
      throw new Error('Topic not found');
    }

    const userProgress = await UserProgress.findOne({
      where: { user_id: userId, course_id: topic.course_id }
    });

    const isUnlocked = topic.order_index === 1 || 
                      (userProgress && topic.order_index <= userProgress.last_unlocked_order);

    if (!isUnlocked) {
      throw new Error('Topic is locked. Complete previous topics first.');
    }

    return {
      id: topic.id,
      title: topic.title,
      summary: topic.summary,
      video_url: topic.video_url,
      notes: topic.notes,
      pass_mark: topic.pass_mark,
      course: topic.Course
    };
  }

  async checkTopicUnlockStatus(topicId, userId) {
    const topic = await Topic.findByPk(topicId);
    
    if (!topic) {
      throw new Error('Topic not found');
    }

    if (topic.order_index === 1) {
      return true;
    }

    const userProgress = await UserProgress.findOne({
      where: { user_id: userId, course_id: topic.course_id }
    });

    if (!userProgress) {
      return false;
    }

    return topic.order_index <= userProgress.last_unlocked_order;
  }
}

module.exports = new TopicService();
