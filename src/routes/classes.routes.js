const router = require('express').Router()
const { aulas } = require('../datos/datos')
const { puedeVerClass, puedeVerClasses, puedeEliminarClass, authUser } = require('../permisos/auths')
const {verifyToken} = require('../middlewares/auth')

const {
  updateClassById,
  deleteClassById,
  getClassById,
  getClasses,
  createClass,
} = require('../controllers/classes.controller')

router.use(verifyToken)

router.get('/', verifyToken, (req, res) =>{
  res.json(getClasses)
})
router.post('/', verifyToken, createClass)

router.get('/:id', verifyToken, getClassById)
router.put('/:id', verifyToken, updateClassById)
router.delete('/:id', verifyToken, deleteClassById)

module.exports = router
