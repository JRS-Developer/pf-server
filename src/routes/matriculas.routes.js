const express = require('express')
const router = express.Router()

const {
  getMatriculas,
  getMatriculaById,
  createMatricula,
  updateMatriculaById,
  getDatosMatricula
} = require('../controllers/matricula.controller')

const { verifyToken, esSuperUser, esSuperUserOrAdmin } = require('../middlewares/auth');

router.use(verifyToken)

router.get('/', esSuperUserOrAdmin, getMatriculas)
router.get('/:id', esSuperUserOrAdmin, getMatriculaById)
router.post('/', esSuperUser, createMatricula)
router.put('/:id', esSuperUser, updateMatriculaById)
router.get('/datos/matricula', getDatosMatricula)

module.exports = router