const router = require('express').Router()
const tasksRouter = require('./tasks.routes')
const classesRouter = require('./classes.routes')

router.use('/tasks', tasksRouter)
router.use('/classes', classesRouter)

module.exports = router
