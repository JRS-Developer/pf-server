const { DataTypes } = require('sequelize')
const { conn } = require('../db')
const User = require('./User')

const Notification = conn.define('publication', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    message: {
        type: String,
        allowNull: false
    },
    url: {
        type: String,
        allowNull: false
    },
    status: {
        type: Boolean,
        defaultValue: true,
    }
})

Notification.belongsToMany(User, { through: 'user_notification' })
User.belongsToMany(Notification, { through: 'user_notification' })

module.exports = Notification