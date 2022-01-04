const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middlewares/auth')

const {
  getNotas,
  addNotas,
} = require('../controllers/examenesNotas.controller')

router.use(verifyToken)

router.get('/', getNotas) // aclarar quien puede ver esto
router.post('/', addNotas) // aclarar quien puede ver esto

module.exports = router
