const router = require('express').Router()
const {
  subscription,
  getNotifications,
  createNotification
} = require('../controllers/notification.controllers')
const { verifyToken } = require('../middlewares/auth')

router.post('/subscription', subscription)
router.get('/notifications', verifyToken, getNotifications)


module.exports = router
