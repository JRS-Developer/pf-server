const { DataTypes } = require('sequelize')
const { conn: sequelize } = require('../db')
const Schools = require('./Schools')
const Materias = require('./Materias')

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
})

// School - Class (one-to-many)
Schools.hasMany(Classes, {foreignKey: 'school_id'})
Classes.belongsTo(Schools, {foreignKey: 'school_id'})
// Classes - Materias (many-to-many)
Classes.belongsToMany(Materias, { through: 'materias_classes' })
Materias.belongsToMany(Classes, { through: 'materias_classes' })

module.exports = Classes