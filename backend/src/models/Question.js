 
// ============================================
// FILE: src/models/Question.js
// ============================================
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('questions', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  topic_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'topics',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('mcq_single', 'mcq_multi', 'true_false', 'short'),
    allowNull: false
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  explanation: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  tableName: 'questions',
  indexes: [
    {
      fields: ['topic_id']
    }
  ]
});

module.exports = Question;