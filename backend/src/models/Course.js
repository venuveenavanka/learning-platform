 
// ============================================
// FILE: src/models/Course.js
// ============================================
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('courses', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  tableName: 'courses'
});

module.exports = Course;