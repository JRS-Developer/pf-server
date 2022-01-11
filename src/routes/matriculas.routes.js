const express = require('express')
const router = express.Router()

const {
  getMatriculas,
  getMatriculaById,
  createMatricula,
  updateMatriculaById,
  getMatriculaByUserId,
  getDatosMatricula,
  getStudentMatricula,
} = require('../controllers/matricula.controller')

const {
  verifyToken,
  esSuperUser,
} = require('../middlewares/auth')

router.use(verifyToken)

router.get('/',  getMatriculas)
router.get('/:id', getMatriculaById)
router.get('/user/:id', getMatriculaByUserId)
router.post('/', esSuperUser, createMatricula)
router.put('/:id', esSuperUser, updateMatriculaById)
router.get('/datos/matricula', getDatosMatricula)
router.post('/students/matricula', getStudentMatricula)


module.exports = router
