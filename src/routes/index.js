const router = require('express').Router()
const tasks = require('./tasks.routes')
const classes = require('./classes.routes')
const users = require('./users.routes')
const schools = require('./schools.routes')
const notes = require('./notes.routes')
const materias = require('./materias.routes')

router.use('/tasks', tasks)
router.use('/users', users)
router.use('/classes', classes)
router.use('/schools', schools)
router.use('/notes', notes)
router.use('/materias', materias)

module.exports = router
