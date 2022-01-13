const router = require('express').Router()
const {
  subscription,
  getNotifications,
  removeNotifications,
} = require('../controllers/notification.controllers')
const { verifyToken } = require('../middlewares/auth')

router.post('/subscription', subscription)
router.get('/notifications', verifyToken, getNotifications)
router.delete('/notifications', verifyToken, removeNotifications)


module.exports = router
