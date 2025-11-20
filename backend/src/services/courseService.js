 
// ============================================
// FILE: src/services/courseService.js
// ============================================
const { Course, Topic, UserProgress, QuizAttempt } = require('../models');
const { sequelize } = require('../models');

class CourseService {
  async getAllCourses() {
    const courses = await Course.findAll({
      attributes: ['id', 'title', 'description', 'created_at'],
      order: [['id', 'ASC']]
    });

    return courses;
  }

  async getCourseById(courseId) {
    const course = await Course.findByPk(courseId);
    
    if (!course) {
      throw new Error('Course not found');
    }

    return course;
  }

  async getCourseTopics(courseId, userId) {
    const course = await this.getCourseById(courseId);

    let userProgress = await UserProgress.findOne({
      where: { user_id: userId, course_id: courseId }
    });

    if (!userProgress) {
      userProgress = await UserProgress.create({
        user_id: userId,
        course_id: courseId,
        last_unlocked_order: 1
      });
    }

    const topics = await Topic.findAll({
      where: { course_id: courseId },
      attributes: ['id', 'title', 'summary', 'order_index', 'pass_mark'],
      order: [['order_index', 'ASC']]
    });

    const topicsWithStatus = await Promise.all(
      topics.map(async (topic) => {
        const isUnlocked = topic.order_index === 1 || 
                          topic.order_index <= userProgress.last_unlocked_order;

        const attempts = await QuizAttempt.findAll({
          where: { user_id: userId, topic_id: topic.id },
          attributes: ['score_percent', 'passed'],
          order: [['score_percent', 'DESC']]
        });

        const attemptCount = attempts.length;
        const bestScore = attempts.length > 0 ? attempts[0].score_percent : null;
        const hasPassed = attempts.some(a => a.passed);

        let status = 'locked';
        if (isUnlocked) {
          if (hasPassed) {
            status = 'completed';
          } else if (attemptCount > 0) {
            status = 'in_progress';
          } else {
            status = 'unlocked';
          }
        }

        return {
          id: topic.id,
          title: topic.title,
          summary: topic.summary,
          order_index: topic.order_index,
          pass_mark: topic.pass_mark,
          is_unlocked: isUnlocked,
          attempt_count: attemptCount,
          best_score: bestScore,
          status
        };
      })
    );

    return {
      course: {
        id: course.id,
        title: course.title,
        description: course.description
      },
      topics: topicsWithStatus,
      progress: {
        last_unlocked_order: userProgress.last_unlocked_order,
        total_topics: topics.length
      }
    };
  }
}

module.exports = new CourseService();
