const { DataTypes } = require('sequelize')
const { conn } = require('../db')
const Action = require('./Action')
const Module = require('./Module')

const Icon = conn.define(
  'icons',
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
  },
  {
    timestamps: false,
  }
)

// ICON
// Icon - Module
Icon.belongsTo(Module) // belongsTo = Tiene muchos
Module.hasOne(Icon) // hasOne = Tiene uno
// Icon - Action
Icon.belongsTo(Action) // belongsTo = Tiene muchos
Action.hasOne(Icon) // hasOne = Tiene uno

module.exports = Icon
