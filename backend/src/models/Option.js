 
// ============================================
// FILE: src/models/Option.js
// ============================================
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Option = sequelize.define('options', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  question_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'questions',
      key: 'id'
    }
  },
  label: {
    type: DataTypes.STRING(1000),
    allowNull: false
  },
  is_correct: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: false,
  tableName: 'options',
  indexes: [
    {
      fields: ['question_id']
    }
  ]
});

module.exports = Option;
