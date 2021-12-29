const { DataTypes } = require('sequelize')
const { Matricula, Materias } = require('.')
const { conn: sequelize } = require('../db')


const ExamenesNotas = sequelize.define('homeworkgrade', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  examenes: {
    type: DataTypes.ARRAY(DataTypes.DECIMAL),
    allowNull: false,
  },
})


Matricula.hasMany(ExamenesNotas)
ExamenesNotas.belongsTo(Matricula)

Materias.hasMany(ExamenesNotas)
ExamenesNotas.belongsTo(Materias)

module.exports = HomeworkGrade
