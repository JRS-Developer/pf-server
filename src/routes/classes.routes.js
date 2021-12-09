const router = require('express').Router()
const {
  updateClassById,
  deleteClassById,
  getClassById,
  getClasses,
  createClass,
} = require('../controllers/classes.controller')
const { verifyToken } = require('../middlewares/auth')

router.use(verifyToken)

router.get('/', getClasses)
router.post('/', createClass)

router.get('/:id', getClassById)
router.put('/:id', updateClassById)
router.delete('/:id', deleteClassById)

module.exports = router
