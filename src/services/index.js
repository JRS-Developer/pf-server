const router = require('express').Router()
const {
  subscription,
  getNotifications,
  createNotification
} = require('../controllers/notification.controllers')

router.post('/subscription', subscription)
router.get('/notifications', getNotifications)
router.post('/notification/:id', createNotification)

module.exports = router
