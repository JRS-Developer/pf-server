const { DataTypes } = require('sequelize')
const { conn } = require('../db')
const Action = require('./Action')

const Module = conn.define(
  'modules',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    module_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
}, {
  timestamps: true
});

// MODULES
Action.belongsToMany(Module, { through: 'actions_modules' })
Module.belongsToMany(Action, { through: 'actions_modules' })

module.exports = Module
