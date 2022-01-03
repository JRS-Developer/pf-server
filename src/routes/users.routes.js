const express = require('express')
const router = express.Router()

const user = require('../controllers/users.controllers')
const {
  verifyToken,
  esSuperUser,
  esSuperUserOrAdmin,
} = require('../middlewares/auth')
const { file } = require('../utils/multer')

router.use(verifyToken)

// User

router.get('/', esSuperUserOrAdmin, user.getUsers)
router.post('/', esSuperUserOrAdmin, user.createUser)
router.get('/:id', user.getUserById)
router.put('/:id', file, user.updateUser)
router.delete('/:id', esSuperUser, user.deleteUser)

// User Role
router.post('/role', esSuperUserOrAdmin, user.getUsersByRole)
router.put('/role/:id', esSuperUserOrAdmin, user.setUserRole)

module.exports = router
