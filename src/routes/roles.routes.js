const router = require('express').Router()
const {
  getRoles,
  updateRole,
  createRole,
  deleteRole
} = require('../controllers/roles.controller')
const { verifyToken } = require('../middlewares/auth')

router.use(verifyToken)

router.get('/', getRoles)
router.post('/', createRole)
router.put('/:id', updateRole)
router.delete('/:id', deleteRole)

module.exports = router
