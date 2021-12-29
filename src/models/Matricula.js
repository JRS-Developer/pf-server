const { DataTypes } = require('sequelize')
const { conn } = require('../db')
const Classes = require("./Classes");
const User = require("./User");
const CicloElectivo = require("./CicloElectivo")
const Schools = require("./Schools");
const Matricula = conn.define('matriculas',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false
    },
    student_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    school_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    clase_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    ciclo_lectivo_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  }
)

/** Relaciones **/
Matricula.belongsTo(User, {
  foreignKey: 'student_id',
  sourceKey: 'id'
})
User.hasMany(Matricula, {
  foreignKey: 'student_id',
  sourceKey: 'id'
})

Matricula.belongsTo(Classes, {
  foreignKey: 'clase_id',
  sourceKey: 'id'
})
Classes.hasMany(Matricula, {
  foreignKey: 'clase_id',
  sourceKey: 'id'
})

Matricula.belongsTo(CicloElectivo, {
  foreignKey: 'ciclo_lectivo_id',
  sourceKey: 'id'
})
CicloElectivo.hasMany(Matricula, {
  foreignKey: 'ciclo_lectivo_id',
  sourceKey: 'id'
})

Matricula.belongsTo(Schools, {
  foreignKey: 'school_id',
  sourceKey: 'id'
})
Schools.hasMany(Matricula, {
  foreignKey: 'school_id',
  sourceKey: 'id'
})

module.exports = Matricula
