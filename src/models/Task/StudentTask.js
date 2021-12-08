const { DataTypes } = require('sequelize')
const { conn: sequelize } = require('../../db')
const Task = require('./Task')
const User = require('../User')

const StudentTask = sequelize.define('student_tasks', {
  task_id: {
    type: DataTypes.UUID,
    references: {
      model: Task,
      key: 'id'
    }
  },
  student_id: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id'
    }
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending'
  },
})

module.exports = StudentTask
