const router = require('express').Router()
const users = require('./users.routes')

router.get('/hola', (req, res) => {
  res.json({ message: 'hola' })
})

router.use('/users', users);

module.exports = router;
