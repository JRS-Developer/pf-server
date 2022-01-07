const { DataTypes } = require('sequelize')
const { conn: sequelize } = require('../../db')
const Task = require('./Task')
// const User = require('../User')
const { Matricula } = require('../Matricula')

const StudentTask = sequelize.define('student_tasks', {
  task_id: {
    type: DataTypes.UUID,
    references: {
      model: Task,
      key: 'id',
    },
  },
  matricula_id: {
    type: DataTypes.UUID,
    references: {
      model: Matricula,
      key: 'id',
    },
  },
  status: {//la tarea puede estar pendiente o entregada
    type: DataTypes.STRING,
    defaultValue: 'Pendiente',
  },
  fecha_entregada: {type: DataTypes.DATE},
  devolucion: { type: DataTypes.STRING }, //la tarea puede estar rechazada, aprobada, rehacer, etc.
  observation: { type: DataTypes.TEXT },
  grade: { type: DataTypes.INTEGER },
})

module.exports = StudentTask
