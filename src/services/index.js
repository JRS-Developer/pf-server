const router = require('express').Router()
const webpush = require('./webpushConfig')
const { subscription } = require('../controllers/notification.controllers')

router.post('/subscription', subscription)

module.exports = router
