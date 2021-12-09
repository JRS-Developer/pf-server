const { DataTypes } = require('sequelize');
const { conn } = require('../db');

const Action = conn.define('actions', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  action_param: {
    type: DataTypes.STRING,
    allowNull: true
  },
  onclick: {
    type: DataTypes.STRING,
    allowNull: false
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  timestamps: false
});

module.exports = Action
