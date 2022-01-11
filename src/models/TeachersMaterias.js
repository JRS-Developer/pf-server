const { DataTypes } = require('sequelize')
const { conn } = require('../db')

const Schools = require('./Schools')
const Classes = require('./Classes')
const Materias = require('./Materias')
const User = require('./User')
const CicloElectivo = require('./CicloElectivo')

const TeachersMaterias = conn.define('teachers_materias', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  school_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  clase_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  materia_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  teacher_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  ciclo_lectivo_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
})

/****/
TeachersMaterias.belongsTo(Schools, {
  foreignKey: 'school_id',
  sourceKey: 'id',
})
Schools.hasMany(TeachersMaterias, {
  foreignKey: 'school_id',
  sourceKey: 'id',
})

TeachersMaterias.belongsTo(Classes, {
  foreignKey: 'clase_id',
  sourceKey: 'id',
})
Classes.hasMany(TeachersMaterias, {
  foreignKey: 'clase_id',
  sourceKey: 'id',
})

TeachersMaterias.belongsTo(Materias, {
  foreignKey: 'materia_id',
  sourceKey: 'id',
})
Materias.hasMany(TeachersMaterias, {
  foreignKey: 'materia_id',
  sourceKey: 'id',
})

TeachersMaterias.belongsTo(User, {
  foreignKey: 'teacher_id',
  sourceKey: 'id',
})
User.hasMany(TeachersMaterias, {
  foreignKey: 'teacher_id',
  sourceKey: 'id',
})

TeachersMaterias.belongsTo(CicloElectivo, {
  foreignKey: 'ciclo_lectivo_id',
  sourceKey: 'id',
})
CicloElectivo.hasMany(TeachersMaterias, {
  foreignKey: 'ciclo_lectivo_id',
  sourceKey: 'id',
})

module.exports = TeachersMaterias
