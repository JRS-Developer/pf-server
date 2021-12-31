const { DataTypes } = require('sequelize')
const { conn: sequelize } = require('../db')
const Schools = require('./Schools')
const Materias = require('./Materias')
const User = require ('./User')

const Classes = sequelize.define('classes', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
})

// School - Class (many-to-many)
Schools.belongsToMany(Classes, { through: 'schools_classes' })
Classes.belongsToMany(Schools, { through: 'schools_classes' })
// Classes - Materias (many-to-many)
Classes.belongsToMany(Materias, { through: 'materias_classes' })
Materias.belongsToMany(Classes, { through: 'materias_classes' })
// Classes - User (many-to-many)
Classes.belongsToMany(User, { through: 'users_classes'})
User.belongsToMany(Classes, { through: 'users_classes'})

module.exports = Classes
