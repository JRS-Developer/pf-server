const { conn } = require('../db')
const User = require('./User')
const { DataTypes } = require('sequelize')

const Subscription = conn.define('subscription', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  endpoint: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expirationTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  keys: {
    type: DataTypes.JSON,
    allowNull: false,
  },
})

User.hasMany(Subscription)

Subscription.belongsTo(User)

module.exports = Subscription
