const { conn } = require('../db')
const User = require('./User')
const { DataTypes } = require('sequelize')

const Subscription = conn.define('subscriptions', {
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
    allowNull: false,
  },
  keys: {
    type: DataTypes.JSON,
    allowNull: false,
  },
})

User.belongsTo(Subscription, { foreignKey: 'userId', sourceKey: 'id' })
Subscription.hasMany(User, { foreignKey: 'userId', sourceKey: 'id' })

module.exports = Subscription
