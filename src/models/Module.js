const { DataTypes } = require('sequelize')
const { conn } = require('../db')
const Action = require('./Action')

const Module = conn.define('modules', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  timestamps: false
});

// MODULES
Action.belongsToMany(Module, { through: 'actions_modules' })
Module.belongsToMany(Action, { through: 'actions_modules' })

module.exports = Module
