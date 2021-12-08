const router = require('express').Router()
const tasks = require('./tasks.routes')
const classes = require('./classes.routes')
const users = require('./users.routes')
const schools = require('./schools.routes')
const aulas = require('./aulas.routes')

router.use('/tasks', tasks)
router.use('/users', users)
// FIX: Aulas y classes son lo mismo? Si es asi hay que decidir cual dejar y cual descartar
router.use('/classes', classes)
router.use('/aulas', aulas)
router.use('/schools', schools)

module.exports = router