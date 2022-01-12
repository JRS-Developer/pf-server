const router = require('express').Router()
const {
  subscription,
  getNotifications,
  createNotification,
} = require('../controllers/notification.controllers')

router.post('/subscription', subscription)
router.get('/notifications', getNotifications)
router.post('/notifications', createNotification)

module.exports = router
