const { DataTypes } = require('sequelize')
const { conn: sequelize } = require('../db')

const Schools = sequelize.define('schools', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: DataTypes.STRING
})

<<<<<<< HEAD
// console.log('hola soy: ',Schools)

=======
>>>>>>> 8b94092019dec422ac98f1b5ac16091cb7d17fd3
module.exports = Schools
