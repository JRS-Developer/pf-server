const router = require('express').Router()
const tasksRouter = require('./tasks')

router.use('/tasks', tasksRouter)

module.exports = router

