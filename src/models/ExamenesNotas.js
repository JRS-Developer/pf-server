const { DataTypes, STRING} = require('sequelize')
const Matricula = require('./Matricula')
const Materias = require('./Materias')
const { conn: sequelize } = require('../db')
const User = require("./User");


const ExamenesNotas = sequelize.define('examenes_notas', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  nota: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  examen : {
    type: DataTypes.STRING,
    allowNull: false,
  },
  materia_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  periodo: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

Matricula.hasMany(ExamenesNotas)
ExamenesNotas.belongsTo(Matricula)

ExamenesNotas.belongsTo(Materias, {
  foreignKey: 'materia_id',
  sourceKey: 'id'
})
Materias.hasMany(ExamenesNotas, {
  foreignKey: 'materia_id',
  sourceKey: 'id'
})

module.exports = ExamenesNotas
