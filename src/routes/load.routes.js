const express = require('express')
const router = express.Router()
const imagen = require('../utils')

router.get('/', async (req, res, next) => {
  const img = await imagen('logo2.png')
  res.json(img)
})

module.exports = router
