const { DataTypes } = require('sequelize')
const { conn: sequelize } = require('../db')

const Schools = sequelize.define('schools', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: DataTypes.STRING
})

module.exports = Schools
