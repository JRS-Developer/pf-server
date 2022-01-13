const { DataTypes } = require('sequelize')
const { conn } = require('../../db')
const User = require('../User')
const UserNotification = require('./UserNotification')

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

// Sender TODO: Agregar esta relacion para tener la info del quien lo encia
User.hasMany(Notification, { as: 'sender', foreignKey: 'senderId' })
Notification.belongsTo(User, { as: 'sender', foreignKey: 'senderId' })

// Receivers
Notification.belongsToMany(User, { through: UserNotification })
User.belongsToMany(Notification, { through: UserNotification })

module.exports = Notification
