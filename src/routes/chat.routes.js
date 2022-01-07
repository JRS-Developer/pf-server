const router = require('express').Router()
const { getUsersOfChat } = require('../controllers/chat.controller')

router.get('/', getUsersOfChat)

module.exports = router
