const express = require('express')
const router = express.Router()
const { verifyToken} = require('../middlewares/auth');

const {
  getNotas,
  addNotas
} = require("../controllers/examenesNotas.controller");

router.use(verifyToken)

router.get('/', getNotas)
router.post('/', addNotas)

module.exports = router