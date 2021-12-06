const { DataTypes } = require('sequelize')
const { conn: sequelize } = require('../db')

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: DataTypes.STRING,
  end_date: DataTypes.DATE,
})

// TODO: Añadir relaciones de clases y profesores

module.exports = Task
