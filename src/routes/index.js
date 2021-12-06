const router = require('express').Router()
const tasksRouter = require('./tasks.routes')

router.use('/tasks', tasksRouter)

module.exports = router

