const express = require('express')
const router = express.Router()
const { verifyToken} = require('../middlewares/auth');
const {
  getAccess,
  createAccess
} = require('../controllers/access.controller')

router.use(verifyToken)

router.get('/', getAccess)
router.post('/', createAccess)

module.exports = router


//No hace falta verificar esto, nadie podrá acceder a esto