const router = require('express').Router()
const {
  subscription,
  getNotifications,
} = require('../controllers/notification.controllers')

router.post('/subscription', subscription)
router.get('/notifications', getNotifications)

module.exports = router
