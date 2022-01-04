const express = require('express')
const router = express.Router()

const {
  get_materias,
  get_one_materia,
  create_materia,
  delete_materia,
  update_materia,
} = require('../controllers/materias.controller')
const {
  verifyToken,
  esSuperUserOrAdminOrProfesor,
  esSuperUserOrAdmin,
} = require('../middlewares/auth')

router.use(verifyToken)

router.get('/', esSuperUserOrAdmin, get_materias)
router.get('/:id', esSuperUserOrAdmin, get_one_materia)
router.post('/', esSuperUserOrAdminOrProfesor, create_materia)
router.delete('/:id', esSuperUserOrAdmin, delete_materia)
router.put('/:id', esSuperUserOrAdmin, update_materia)

module.exports = router
