const router = require('express').Router()
const tasks = require('./tasks.routes')
const classes = require('./classes.routes')
const users = require('./users.routes')
const schools = require('./schools.routes')

router.use('/tasks', tasks)
router.use('/users', users)
router.use('/classes', classes)
router.use('/schools', schools)

module.exports = router
