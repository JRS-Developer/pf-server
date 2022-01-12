const Task = require('./Task/Task')
const StudentTask = require('./Task/StudentTask')
const Schools = require('./Schools')
const Classes = require('./Classes')
const Materias = require('./Materias')
const User = require('./User')
const Access = require('./Access')
const Module = require('./Module')
const Action = require('./Action')
const Role = require('./Role')
const Publication = require('./Publication')
const Like = require('./Like')
const CicloElectivo = require('./CicloElectivo')
const Matricula = require('./Matricula')
const ExamenesNotas = require('./ExamenesNotas')

const TeachersMaterias = require('./TeachersMaterias')

const File = require('./File')
const Subscription = require('./Subscriptions')
const Notification = require('./Notification')

module.exports = {
  Task,
  Classes,
  Schools,
  Materias,
  Module,
  Action,
  Access,
  User,
  StudentTask,
  Role,
  Publication,
  Like,
  CicloElectivo,
  Matricula,
  TeachersMaterias,
  File,
  ExamenesNotas,
  Subscription,
  Notification,
}
