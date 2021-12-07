const { DataTypes } = require('sequelize')
const { conn: sequelize } = require('../db')
const { Schools } = require('./')

const Classes = sequelize.define('classes', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
})

module.exports = Classes
