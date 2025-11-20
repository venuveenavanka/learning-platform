// ============================================
// FILE: src/models/UserProgress.js
// ============================================
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserProgress = sequelize.define('user_progress', {
  user_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  course_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id'
    }
  },
  last_unlocked_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  timestamps: true,
  createdAt: false,
  updatedAt: 'last_updated',
  tableName: 'user_progress'
});

module.exports = UserProgress;