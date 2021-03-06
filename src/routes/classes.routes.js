const router = require('express').Router()
const { aulas } = require('../datos/datos')
const {
  verifyToken,
  esSuperUser,
  esSuperUserOrAdmin,
  esSuperUserOrAdminOrProfesor,
} = require('../middlewares/auth')

const {
  updateClassById,
  deleteClassById,
  getClassById,
  getClasses,
  getClassesBySchoolId,
  createClass,
} = require('../controllers/classes.controller')
const { Classes } = require('../models')

router.use(verifyToken)

router.get('/', esSuperUserOrAdmin, getClasses) //sUser, admin y los participantes
router.get('/:school_id', esSuperUserOrAdmin, getClassesBySchoolId) //sUser, admin y los participantes
router.post('/', esSuperUserOrAdmin, createClass)
router.get('/clase/:id', esSuperUserOrAdminOrProfesor, getClassById) //sUser, admin y los participantes
router.put('/:id', esSuperUserOrAdmin, updateClassById) //sUser, admin y los participantes(profesor participante, verificar q sea profesor en el rol)
router.delete('/:id', esSuperUserOrAdmin, deleteClassById)

module.exports = router
