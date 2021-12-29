const { DataTypes } = require('sequelize')
const { conn: sequelize } = require('../db')
const StudentTask = require('./Task/StudentTask')

const HomeworkGrade = sequelize.define('homeworkgrade', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
})

// HomeworkGrade
// HomeworkGrade - StudentsTasks (one-to-one)
HomeworkGrade.hasOne(StudentTask)
StudentTask.belongsTo(HomeworkGrade)

module.exports = HomeworkGrade
