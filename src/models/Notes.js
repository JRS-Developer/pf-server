const { DataTypes } = require('sequelize')
const { conn: sequelize } = require('../db')

const Notes = sequelize.define('notes', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
})

module.exports = Notes
