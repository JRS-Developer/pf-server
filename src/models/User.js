const { DataTypes } = require('sequelize')
const { conn } = require('../db')
const Role = require('./Role')
const School = require('./Schools')
const bcrypt = require('bcryptjs')

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
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    // Guardo la contra encriptada
    set(value) {
      this.setDataValue('password', bcrypt.hashSync(value, 10))
    }
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  clase_id: {
    type: DataTypes.UUID,
    allowNull: true
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
