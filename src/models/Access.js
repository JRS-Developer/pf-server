const { DataTypes } = require('sequelize')
const { conn } = require('../db')
const Module = require("./Module");
const User = require("./User");
const Action = require("./Action")

const Access = conn.define(
  'acceso',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    module_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    action_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: false,
  }
)

/****/
Access.belongsTo(User, {
  foreignKey: 'user_id',
  sourceKey: 'id'
})
User.hasMany(Access, {
  foreignKey: 'user_id',
  sourceKey: 'id'
})

Access.belongsTo(Module, {
  foreignKey: 'module_id',
  sourceKey: 'id'
})
Module.hasMany(Access, {
  foreignKey: 'module_id',
  sourceKey: 'id'
})

Access.belongsTo(Action, {
  foreignKey: 'action_id',
  sourceKey: 'id'
})
Action.hasMany(Access, {
  foreignKey: 'action_id',
  sourceKey: 'id'
})

module.exports = Access
