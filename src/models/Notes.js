const { DataTypes } = require('sequelize')
const { conn: sequelize } = require('../db')
const StudentTask = require('./Task/StudentTask')

const Notes = sequelize.define('notes', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
})

// NOTES
// Notes - StudentsTasks (one-to-one)
Notes.hasOne(StudentTask)
StudentTask.belongsTo(Notes)

module.exports = Notes
