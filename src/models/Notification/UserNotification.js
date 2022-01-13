const { DataTypes } = require('sequelize')
const { conn } = require('../../db')

const UserNotification = conn.define('user_notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
})

module.exports = UserNotification
