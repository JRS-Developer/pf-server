const express = require('express')
const router = express.Router()

const {
  verifyToken
} = require('../middlewares/auth')

const {
  getAccess,
  createAccess,
  getActionsByModulo,
  getAccessUser,
} = require('../controllers/access.controller')

router.use(verifyToken)

router.post('/', createAccess)
router.get('/', getAccess)
router.get('/:moduleId', getActionsByModulo)
router.get('/user/:userId', getAccessUser)

module.exports = router