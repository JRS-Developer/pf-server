const { DataTypes } = require('sequelize')
const { conn: sequelize } = require('../../db')
const Classes = require('../Classes')
const Materias = require('../Materias')
// const User = require('../User')
const StudentTask = require('./StudentTask')
const CicloElectivo = require('../CicloElectivo')
const Schools = require('../Schools')
const Matricula = require('../Matricula')

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
  description: { type: DataTypes.STRING },
  end_date: { type: DataTypes.DATE },
  class_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  materia_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  ciclo_lectivo_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  school_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
})

// Tasks - Classes (one-to-many)
Classes.hasMany(Task, { foreignKey: 'class_id', sourceKey: 'id' })
Task.belongsTo(Classes, { foreignKey: 'class_id', sourceKey: 'id' })

// Tasks - Materias (one-to-many)
Materias.hasMany(Task, { foreignKey: 'materia_id', sourceKey: 'id' })
Task.belongsTo(Materias, { foreignKey: 'materia_id', sourceKey: 'id' })

// Tasks - CicloLectivo (one-to-many)
CicloElectivo.hasMany(Task, { foreignKey: 'ciclo_lectivo_id', sourceKey: 'id' })
Task.belongsTo(CicloElectivo, {
  foreignKey: 'ciclo_lectivo_id',
  sourceKey: 'id',
})

// Tasks - School (one-to-many)
Schools.hasMany(Task, { foreignKey: 'school_id', sourceKey: 'id' })
Task.belongsTo(Schools, { foreignKey: 'school_id', sourceKey: 'id' })

// Tasks - Students (many-to-many)
Matricula.belongsToMany(Task, {
  through: StudentTask,
  foreignKey: 'matricula_id',
})
Task.belongsToMany(Matricula, { through: StudentTask, foreignKey: 'task_id' })

module.exports = Task
