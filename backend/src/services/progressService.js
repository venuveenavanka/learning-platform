// ============================================
// FILE: src/services/progressService.js (FIXED)
// ============================================
const {
  User,
  Course,
  Topic,
  QuizAttempt,
  UserProgress,
  sequelize,
} = require("../models");

class ProgressService {
  
  async getUserDashboard(userId) {
  // 1) Get UserProgress rows (courses the user is enrolled/tracked in)
  const userProgressRows = await UserProgress.findAll({
    where: { user_id: userId },
    attributes: ['course_id', 'last_unlocked_order'],
    include: [{
      model: Course,
      attributes: ['id', 'title', 'description']
    }]
  });

  // 2) Get all quiz attempts by user including the Topic->Course reference
  const attemptsWithTopic = await QuizAttempt.findAll({
    where: { user_id: userId },
    include: [{
      model: Topic,
      attributes: ['id', 'course_id', 'title', 'order_index'],
      include: [{
        model: Course,
        attributes: ['id', 'title']
      }]
    }],
    attributes: ['id', 'topic_id', 'score_percent', 'passed', 'created_at']
  });

  // 3) Build set of courseIds to show:
  //    - courses from userProgress
  //    - courses inferred from attempts (even if UserProgress missing)
  const courseIdSet = new Set();
  const userProgressByCourse = {}; // map courseId -> progress row
  userProgressRows.forEach(up => {
    if (up.course_id != null) {
      courseIdSet.add(up.course_id);
      userProgressByCourse[up.course_id] = up;
    }
  });

  attemptsWithTopic.forEach(at => {
    if (at.topic && at.topic.course_id != null) {
      courseIdSet.add(at.topic.course_id);
    }
  });

  const courseIds = Array.from(courseIdSet);
  if (courseIds.length === 0) {
    // nothing to show
    return {
      courses: [],
      recent_activity: attemptsWithTopic.slice(0, 10).map(a => ({
        attempt_id: a.id,
        topic_title: a.topic ? a.topic.title : 'Unknown',
        course_title: a.topic && a.topic.course ? a.topic.course.title : 'Unknown',
        score_percent: a.score_percent,
        passed: a.passed,
        created_at: a.created_at
      })),
      stats: {
        total_attempts: attemptsWithTopic.length,
        total_passed: attemptsWithTopic.filter(a => a.passed).length,
        average_score: attemptsWithTopic.length > 0
          ? Math.round(attemptsWithTopic.reduce((s, a) => s + a.score_percent, 0) / attemptsWithTopic.length)
          : 0
      },
      next_recommended: await this.getNextRecommendedTopic(userId)
    };
  }

  // 4) Fetch course basic info for these courseIds
  const courses = await Course.findAll({
    where: { id: courseIds },
    attributes: ['id', 'title', 'description'],
    order: [['id', 'ASC']]
  });

  // 5) For efficiency, fetch all topics for these courses in one query
  const topics = await Topic.findAll({
    where: { course_id: courseIds },
    attributes: ['id', 'course_id', 'order_index', 'title'],
    order: [['course_id', 'ASC'], ['order_index', 'ASC']]
  });

  // group topic ids by course
  const topicIdsByCourse = {};
  const topicsByCourse = {};
  topics.forEach(t => {
    topicsByCourse[t.course_id] = topicsByCourse[t.course_id] || [];
    topicsByCourse[t.course_id].push(t);
    topicIdsByCourse[t.course_id] = topicIdsByCourse[t.course_id] || [];
    topicIdsByCourse[t.course_id].push(t.id);
  });

  // 6) Precompute passed topic ids for this user (distinct)
  const passedAttempts = attemptsWithTopic.filter(a => a.passed && a.topic && a.topic.course_id != null);
  const passedTopicIdsSet = new Set(passedAttempts.map(a => a.topic_id));

  // 7) Build course progress array
  const courseProgress = courses.map(course => {
    const courseId = course.id;
    const topicIds = topicIdsByCourse[courseId] || [];
    const totalTopics = topicIds.length;

    // count completed topics that belong to this course
    const completedTopics = topicIds.filter(tid => passedTopicIdsSet.has(tid)).length;

    const progress_percent = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);
    const is_completed = totalTopics > 0 && completedTopics === totalTopics;

    // current topic & last_unlocked_order from userProgress if exists
    const upRow = userProgressByCourse[courseId];
    let last_unlocked_order = upRow ? upRow.last_unlocked_order : 1;
    // find current topic from topicsByCourse where order_index === last_unlocked_order
    const currentTopic = (topicsByCourse[courseId] || []).find(t => t.order_index === last_unlocked_order) || null;

    // average score for this course using attemptsWithTopic filtered by course
    const courseAttempts = attemptsWithTopic.filter(a => a.topic && a.topic.course_id === courseId);
    const average_score = courseAttempts.length > 0
      ? Math.round(courseAttempts.reduce((s, a) => s + a.score_percent, 0) / courseAttempts.length)
      : 0;

    return {
      course_id: courseId,
      course_title: course.title,
      course_description: course.description,
      total_topics: totalTopics,
      completed_topics: completedTopics,
      progress_percent,
      is_completed,
      current_topic: currentTopic ? { id: currentTopic.id, title: currentTopic.title, order_index: currentTopic.order_index } : null,
      average_score,
      last_unlocked_order
    };
  });

  // 8) Recent activity and stats (reuse attemptsWithTopic)
  const recentActivity = attemptsWithTopic
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 10)
    .map(a => ({
      attempt_id: a.id,
      topic_title: a.topic ? a.topic.title : 'Unknown',
      course_title: a.topic && a.topic.course ? a.topic.course.title : 'Unknown',
      score_percent: a.score_percent,
      passed: a.passed,
      created_at: a.created_at
    }));

  const allAttempts = attemptsWithTopic; // already fetched
  const stats = {
    total_attempts: allAttempts.length,
    total_passed: allAttempts.filter(a => a.passed).length,
    average_score: allAttempts.length > 0
      ? Math.round(allAttempts.reduce((sum, a) => sum + a.score_percent, 0) / allAttempts.length)
      : 0
  };

  const nextRecommendedTopic = await this.getNextRecommendedTopic(userId);

  return {
    courses: courseProgress,
    recent_activity: recentActivity,
    stats,
    next_recommended: nextRecommendedTopic
  };
}


  async getNextRecommendedTopic(userId) {
    const userProgresses = await UserProgress.findAll({
      where: { user_id: userId },
    });

    for (const progress of userProgresses) {
      const nextTopic = await Topic.findOne({
        where: {
          course_id: progress.course_id,
          order_index: {
            [sequelize.Sequelize.Op.lte]: progress.last_unlocked_order,
          },
        },
        include: [
          {
            model: Course,
            attributes: ["title"],
          },
        ],
        order: [["order_index", "ASC"]],
      });

      if (nextTopic) {
        const hasPassed = await QuizAttempt.findOne({
          where: {
            user_id: userId,
            topic_id: nextTopic.id,
            passed: true,
          },
        });

        if (!hasPassed) {
          return {
            topic_id: nextTopic.id,
            topic_title: nextTopic.title,
            course_title: nextTopic.Course ? nextTopic.Course.title : "Unknown",
            order_index: nextTopic.order_index,
          };
        }
      }
    }

    return null;
  }

  async getUserProgress(userId, courseId) {
    const progress = await UserProgress.findOne({
      where: { user_id: userId, course_id: courseId },
    });

    if (!progress) {
      return null;
    }

    const totalTopics = await Topic.count({
      where: { course_id: courseId },
    });

    const completedTopics = await QuizAttempt.count({
      where: {
        user_id: userId,
        passed: true,
      },
      include: [
        {
          model: Topic,
          where: { course_id: courseId },
          attributes: [],
        },
      ],
      distinct: true,
      col: "topic_id",
    });

    return {
      course_id: courseId,
      last_unlocked_order: progress.last_unlocked_order,
      total_topics: totalTopics,
      completed_topics: completedTopics,
      progress_percent:
        totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0,
    };
  }
}

module.exports = new ProgressService();
