const Task = require('./Task')
const Notes = require('./Notes')
const Schools = require('./Schools')
const Classes = require('./Classes')
const Materias = require('./Materias')

// INFO: Relaciones entre las tablas:

// School - Class (one-to-many)
Schools.hasMany(Classes)
Classes.belongsTo(Schools)

// Classes - Materias (many-to-many)
Classes.belongsToMany(Materias, { through: 'materias_classes' })
Materias.belongsToMany(Classes, { through: 'materias_classes' })

module.exports = {
  Task,
  Notes,
  Classes,
  Schools,
  Materias
}
