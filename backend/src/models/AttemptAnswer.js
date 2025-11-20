 
// ============================================
// FILE: src/models/AttemptAnswer.js
// ============================================
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AttemptAnswer = sequelize.define('attempt_answers', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  attempt_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'quiz_attempts',
      key: 'id'
    }
  },
  question_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'questions',
      key: 'id'
    }
  },
  selected_option_ids: {
    type: DataTypes.JSON,
    allowNull: true
  },
  text_answer: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_correct: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  points_awarded: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  timestamps: false,
  tableName: 'attempt_answers',
  indexes: [
    {
      fields: ['attempt_id']
    },
    {
      fields: ['question_id']
    }
  ]
});

module.exports = AttemptAnswer;
