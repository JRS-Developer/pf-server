const { DataTypes } = require('sequelize')
const { conn } = require('../db')
const User = require('./User')

const Notification = conn.define('notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
})

Notification.belongsToMany(User, { through: 'user_notification' })
User.belongsToMany(Notification, { through: 'user_notification' })

module.exports = Notification
