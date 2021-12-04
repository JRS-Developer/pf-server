const router = require('express').Router()

router.get('/hola', (req, res) => {
  res.json({ message: 'hola' })
})

module.exports = router
