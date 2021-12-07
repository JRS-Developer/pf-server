const { DataTypes } = require('sequelize')
const { conn: sequelize } = require('../db')

const Schools = sequelize.define('schools', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  name: DataTypes.STRING
})

console.log(Schools)

module.exports = Schools