const { DataTypes } = require('sequelize')
const { conn: sequelize } = require('../db')
const User = require('./User')

const Like = sequelize.define('likes', {
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

User.hasMany(Like, { foreignKey: 'user_id' })
Like.belongsTo(User, { foreignKey: 'user_id' })

module.exports = Like
