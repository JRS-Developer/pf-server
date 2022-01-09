const router = require('express').Router()
const {
  getRoles,
  getRoleById,
  updateRole,
  createRole,
  deleteRole,
} = require('../controllers/roles.controller')
const {
  verifyToken,
  esSuperUser,
  esSuperUserOrAdmin,
} = require('../middlewares/auth')

router.use(verifyToken)

router.get('/', esSuperUserOrAdmin, getRoles)
router.get('/:id', esSuperUserOrAdmin, getRoleById)
router.post('/', esSuperUserOrAdmin, createRole)
router.put('/:id', esSuperUserOrAdmin, updateRole)
router.delete('/:id', esSuperUserOrAdmin, deleteRole)

module.exports = router
