const router = require('express').Router()
const { subscription } = require('../controllers/notification.controllers')

router.post('/subscription', subscription)

module.exports = router
