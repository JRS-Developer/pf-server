const express = require('express')
const router = express.Router()

const {
  verifyToken,
  esSuperUserOrAdminOrProfesor,
  esSuperUserOrAdmin,
} = require('../middlewares/auth')
const {
  getTeachersMaterias,
  asignarMaterias,
} = require('../controllers/teacherMaterias.controller')

router.use(verifyToken)

router.post('/materias', esSuperUserOrAdmin, getTeachersMaterias)
router.post('/', esSuperUserOrAdmin, asignarMaterias)

module.exports = router
