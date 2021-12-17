const { DataTypes } = require('sequelize')
const { conn } = require('../db')
const Classes = require("./Classes");
const User = require("./User");
const CicloElectivo = require("./CicloElectivo")

const Matricula = conn.define('matriculas',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    student_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    clase_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    ciclo_electivo_id: {
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
  foreignKey: 'ciclo_electivo_id',
  sourceKey: 'id'
})
CicloElectivo.hasMany(Matricula, {
  foreignKey: 'ciclo_electivo_id',
  sourceKey: 'id'
})

module.exports = Matricula
