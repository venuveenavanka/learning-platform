 
// ============================================
// FILE: src/models/User.js
// ============================================
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('users', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  full_name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'users',

  // 👉 simple fix: ONE index only
  indexes: [
    {
      name: 'idx_users_email',   // fixed name → prevents duplicates
      unique: true,
      fields: ['email']
    }
  ]

});

module.exports = User;
