// ============================================
// FILE: src/models/Topic.js
// ============================================
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Topic = sequelize.define('topics', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  video_url: {
    type: DataTypes.STRING(1000),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT('medium'),
    allowNull: true
  },
  pass_mark: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 60
  },
  order_index: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  tableName: 'topics',
  indexes: [
    {
      fields: ['course_id', 'order_index']
    }
  ]
});

module.exports = Topic;