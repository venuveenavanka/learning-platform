 
// ============================================
// FILE: src/models/index.js
// ============================================
const sequelize = require('../config/database');
const User = require('./User');
const Course = require('./Course');
const Topic = require('./Topic');
const Question = require('./Question');
const Option = require('./Option');
const QuizAttempt = require('./QuizAttempt');
const AttemptAnswer = require('./AttemptAnswer');
const UserProgress = require('./UserProgress');

// Define relationships

// User relationships
User.hasMany(QuizAttempt, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasMany(UserProgress, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// Course relationships
Course.hasMany(Topic, { foreignKey: 'course_id', onDelete: 'CASCADE' });
Course.hasMany(UserProgress, { foreignKey: 'course_id', onDelete: 'CASCADE' });

// Topic relationships
Topic.belongsTo(Course, { foreignKey: 'course_id' });
Topic.hasMany(Question, { foreignKey: 'topic_id', onDelete: 'CASCADE' });
Topic.hasMany(QuizAttempt, { foreignKey: 'topic_id', onDelete: 'CASCADE' });

// Question relationships
Question.belongsTo(Topic, { foreignKey: 'topic_id' });
Question.hasMany(Option, { foreignKey: 'question_id', onDelete: 'CASCADE' });
Question.hasMany(AttemptAnswer, { foreignKey: 'question_id', onDelete: 'CASCADE' });

// Option relationships
Option.belongsTo(Question, { foreignKey: 'question_id' });

// QuizAttempt relationships
QuizAttempt.belongsTo(User, { foreignKey: 'user_id' });
QuizAttempt.belongsTo(Topic, { foreignKey: 'topic_id' });
QuizAttempt.hasMany(AttemptAnswer, { foreignKey: 'attempt_id', onDelete: 'CASCADE' });

// AttemptAnswer relationships
AttemptAnswer.belongsTo(QuizAttempt, { foreignKey: 'attempt_id' });
AttemptAnswer.belongsTo(Question, { foreignKey: 'question_id' });

// UserProgress relationships
UserProgress.belongsTo(User, { foreignKey: 'user_id' });
UserProgress.belongsTo(Course, { foreignKey: 'course_id' });

module.exports = {
  sequelize,
  User,
  Course,
  Topic,
  Question,
  Option,
  QuizAttempt,
  AttemptAnswer,
  UserProgress
};