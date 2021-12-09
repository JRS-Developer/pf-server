const { ROLE, aulas, users } = require('../datos/datos')

function puedeVerClass(req, res, next) {
  const { userId } = req.body

  const aula = aulas.filter((a) => a.id === parseInt(req.params.aulaId))[0]

  if (aula.userId.find((u) => u === userId) || userId === 1) {
    return next()
  }

  res.send('No entraste al if')
}

function puedeVerClasses(user, aulas) {
  if (user.rol === ROLE.sAdmin) return aulas
  return aulas.filter((aula) => aula.userId === user.id)
}

function puedeEliminarClass(user) {
  return user.Id === 1
}

function authUser(req, res, next) {
  if (req.body.userId == null) {
    res.status(403)
    return res.send('Necesitas logearte primero')
  }

  return next()
}

function authRole(rol) {
  return (req, res, next) => {
    if (req.user.rol !== rol) {
      res.status(401)
      return res.send(
        'No tienes el permiso necesario, consulta al administrador'
      )
    }

    next()
  }
}

module.exports = {
  puedeVerClass,
  puedeVerClasses,
  puedeEliminarClass,
  authUser,
  authRole,
}
