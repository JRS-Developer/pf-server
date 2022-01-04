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
  getTeacherMaterias
} = require("../controllers/teacherMaterias.controller")

router.use(verifyToken)

router.post('/materias', getTeachersMaterias)
router.post('/getMaterias', getTeacherMaterias)
router.post('/', esSuperUserOrAdmin, asignarMaterias)

module.exports = router
