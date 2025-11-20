 
// ============================================
// FILE: src/models/QuizAttempt.js
// ============================================
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const QuizAttempt = sequelize.define('quiz_attempts', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  topic_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'topics',
      key: 'id'
    }
  },
  score_percent: {
    type: DataTypes.TINYINT,
    allowNull: false
  },
  passed: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  total_points: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  earned_points: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  tableName: 'quiz_attempts',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['topic_id']
    }
  ]
});

module.exports = QuizAttempt;