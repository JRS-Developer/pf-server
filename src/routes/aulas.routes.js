const router = require('express').Router()
const { classes } = require('../datos/datos')
const {
  puedeVerClass,
  puedeVerClasses,
  puedeEliminarClass,
  authUser,
} = require('../permisos/auths')
const { verifyToken } = require('../middlewares/auth')
const {
  verifyToken,
  esSuperUser,
  esSuperUserOrAdmin,
} = require('../middlewares/auth')

router.get('/', verifyToken, (req, res) => {
  res.json(puedeVerClasses(req.user, classes))
})
// listo

router.get('/:classId', verifyToken, setClass, puedeVerClass, (req, res) => {
  res.json('Puede ver el class señor')
  //mostrar el ula
})

router.delete(
  '/:classId',
  setClass,
  verifyToken,
  puedeEliminarClass,
  (req, res) => {
    res.send('Class eliminada')
  }
)

function setClass(req, res, next) {
  const classId = parseInt(req.params.classId)
  req.class = classes.find((Class) => Class.id === classId)

  if (req.class == null) {
    res.status(404)
    return res.send('Class no encontrada')
  }
  console.log('setClass')
  next()
}

function autorizadoParaVerClass(req, res, next) {
  if (!puedeVerClass(req.user, req.class)) {
    res.status(401)
    return res.send('No tienes el permiso necesario, consulta al administrador')
  }

  next()
}

function autorizadoParaEliminarClass(req, res, next) {
  if (!puedeEliminarClass(req.user, req.class)) {
    res.status(401)
    return res.send('No tienes el permiso necesario, consulta al administrador')
  }

  next()
}

module.exports = router
