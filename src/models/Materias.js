const { DataTypes } = require('sequelize')
const { conn: sequelize } = require('../db')

const Materias = sequelize.define('materias', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
})

module.exports = Materias
