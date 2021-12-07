const { DataTypes } = require('sequelize')
const { conn: sequelize } = require('../../db')
const Classes = require('../Classes')
const Materias = require('../Materias')
const User = require('../User')
const StudentTask = require('./StudentTask')

const Task = sequelize.define('task', {
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

// Tasks - Classes (one-to-many)
Classes.hasMany(Task)
Task.belongsTo(Classes)

// Tasks - Materias (one-to-many)
Materias.hasMany(Task)
Task.belongsTo(Materias)

// Tasks - Teachers (one-to-many)
User.hasMany(Task, { foreignKey: 'teacher_id' })
Task.belongsTo(User, { foreignKey: 'teacher_id' })
// Tasks - Students (many-to-many)
User.belongsToMany(Task, { through: StudentTask, foreignKey: 'task_id' })
Task.belongsToMany(User, { through: StudentTask, foreignKey: 'student_id' })


module.exports = Task
