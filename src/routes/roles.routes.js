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

router.get('/', getRoles) //sUser, admin,
router.get('/:id', getRoleById) //sUser, admin,
router.post('/', createRole) //sUser, admin,
router.put('/:id', updateRole) //sUser, admin,
router.delete('/:id', deleteRole) //sUser, admin,

module.exports = router
