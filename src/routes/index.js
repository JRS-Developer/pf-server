const tasksRouter = require('./tasks.routes')
const express = require('express')
const router = express.Router()

const { aulas } = require('../datos/datos')
const { puedeVerAula, puedeVerAulas, puedeEliminarAula, authUser } = require('../permisos/auths')

//router.use('/tasks', tasksRouter) // dejo esto como estaba, no lo uso todavía, lo de abajo es mio.Nico



router.get('/aulas', authUser, (req, res) => {
  res.json(puedeVerAulas(req.user, aulas))
})


router.get('/aulas/:aulaId', authUser, setAula, puedeVerAula, (req, res) => {

    res.json("Puede ver el aula señor")
    //mostrar el ula
  
})

router.delete('/aulas/:aulaId', setAula, authUser, puedeEliminarAula, (req, res) => {
  res.send('Aula eliminada')
})

function setAula(req, res, next) {
  const aulaId = parseInt(req.params.aulaId)
  req.aula = aulas.find(aula => aula.id === aulaId)
  
  if (req.aula == null) {
    res.status(404)
    return res.send('Aula no encontrada')
  }
  console.log("setAula")
  next()
}

function autorizadoParaVerAula(req, res, next) {
  if (!puedeVerAula(req.user, req.aula)) {
    res.status(401)
    return res.send('No tienes el permiso necesario, consulta al administrador')
  }

  next()
}

function autorizadoParaEliminarAula(req, res, next) {
  if (!puedeEliminarAula(req.user, req.aula)) {
    res.status(401)
    return res.send('No tienes el permiso necesario, consulta al administrador')
  }

  next()
}

module.exports = router

