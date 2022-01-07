const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middlewares/auth')

const {
  getNotas,
  addNotas,
  getExamenNotasById,
  updateExamenNotasById
} = require('../controllers/examenesNotas.controller')

router.use(verifyToken)

router.post('/', addNotas) // Profesores, Admin
router.put('/:id', updateExamenNotasById) // Profesores, Admin
router.post('/notas', getNotas) // Profesores, Alumnos, Admin
router.get('/:id', getExamenNotasById) // Profesores, Admin

module.exports = router
