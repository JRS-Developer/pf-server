const Task = require('./Task')
const Notes = require('./Notes')
const Schools = require('./Schools')
const Classes = require('./Classes')
const Materias = require('./Materias')

// INFO: Relaciones entre las tablas:

// Classes
// School - Class (one-to-many)
Schools.hasMany(Classes)
Classes.belongsTo(Schools)
// Classes - Materias (many-to-many)
Classes.belongsToMany(Materias, { through: 'materias_classes' })
Materias.belongsToMany(Classes, { through: 'materias_classes' })

// Tasks
// Tasks - Notes (one-to-one)
Task.hasOne(Notes)
Notes.belongsTo(Task)
// Tasks - Classes (one-to-many)
Classes.hasMany(Task)
Task.belongsTo(Classes)
// Tasks - Materias (one-to-many)
Materias.hasMany(Task)
Task.belongsTo(Materias)
// TODO: Añadir relaciones de tasks a students y teachers. (many-to-many)

module.exports = {
  Task,
  Notes,
  Classes,
  Schools,
  Materias
}
