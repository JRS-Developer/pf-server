const router = require('express').Router()
const {
  getRoles,
  getRoleById,
  updateRole,
  createRole,
  deleteRole
} = require('../controllers/roles.controller')
const { verifyToken } = require('../middlewares/auth')

router.use(verifyToken)

router.get('/', getRoles)
router.get('/:id', getRoleById)
router.post('/', createRole)
router.put('/:id', updateRole)
router.delete('/:id', deleteRole)

module.exports = router
