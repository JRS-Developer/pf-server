const { DataTypes } = require('sequelize')
const { conn: sequelize } = require('../../db')
const Classes = require('../Classes')
const Materias = require('../Materias')
const Matricula = require('../Matricula')
const StudentTask = require('./StudentTask')

const Task = sequelize.define('task', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {type:DataTypes.STRING},
  end_date: {type:DataTypes.DATE},
})

// Tasks - Classes (one-to-many)
Classes.hasMany(Task, {foreignKey: 'class_id'})
Task.belongsTo(Classes, {foreignKey: 'class_id'})

// Tasks - Materias (one-to-many)
Materias.hasMany(Task, {foreignKey: 'materia_id'})
Task.belongsTo(Materias, {foreignKey: 'materia_id'})

// Tasks - Students (many-to-many)
Matricula.belongsToMany(Task, { through: StudentTask, foreignKey: 'task_id' })
Task.belongsToMany(Matricula, { through: StudentTask, foreignKey: 'student_id' })


module.exports = Task
