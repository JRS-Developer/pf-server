const router = require('express').Router()
const {
  subscription,
  getNotifications,
  createNotification
} = require('../controllers/notification.controllers')
const { verifyToken } = require('../middlewares/auth')

router.post('/subscription', subscription)
<<<<<<< HEAD
router.get('/notifications', getNotifications)
router.post('/notification/:id', createNotification)
=======
router.get('/notifications', verifyToken, getNotifications)
>>>>>>> e16a0aedf74732d9fd68925fa3f2f61bd56f7380

module.exports = router
