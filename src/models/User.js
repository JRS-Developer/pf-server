const { DataTypes } = require('sequelize')
const { conn } = require('../db')
const Role = require('./Role')
const School = require('./Schools')

const User = conn.define('users', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birthdate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  identification: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
  //El estado es para cuando se lo "borre" al usuario cuando queremos dar de baja. Lo ponemos en estado "inactivo"
  status:{
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  avatar: DataTypes.STRING, // Opcional
})

//Relaciones
// Roles
User.belongsTo(Role)
Role.hasMany(User)
// School - OPCIONAL PORQUE DEPENDE DEL ROL
School.hasMany(User)
User.belongsTo(School)

module.exports = User
