const { DataTypes } = require('sequelize')
const { conn: sequelize } = require('../db')

const Materias = sequelize.define('materias', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
})

module.exports = Materias
