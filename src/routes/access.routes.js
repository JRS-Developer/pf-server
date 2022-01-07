const express = require('express')
const router = express.Router()
const { verifyToken, esSuperUser } = require('../middlewares/auth')

const {
  getAccess,
  createAccess,
  getActionsByModulo,
  getAccessUser,
} = require('../controllers/access.controller')

router.use(verifyToken)

router.post('/', esSuperUser, createAccess)
//router.get('/', esSuperUser, getAccess)
router.get('/', getAccess)
//router.get('/:moduleId', esSuperUser, getActionsByModulo)
router.get('/:moduleId', getActionsByModulo)
router.get('/user/:userId', esSuperUser, getAccessUser)

module.exports = router

//No hace falta verificar esto, nadie podrá acceder a esto
