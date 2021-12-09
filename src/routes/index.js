const router = require('express').Router()
const tasks = require('./tasks.routes')
const classes = require('./classes.routes')
const users = require('./users.routes')
const schools = require('./schools.routes')
const notes = require('./notes.routes')
const materias = require('./materias.routes')
const aulas = require('./aulas.routes')
const auth = require('./auth.routes')
const actions = require('./actions.routes')
const modules = require('./modules.routes')

router.use('/tasks', tasks)
router.use('/users', users)
// FIX: Aulas y classes son lo mismo? Si es asi hay que decidir cual dejar y cual descartar 
// Nos quedamos con classes, ahora pasamos el codig de aulas a classes
router.use('/classes', classes)
// router.use('/aulas', aulas)
router.use('/auth', auth)
router.use('/schools', schools)
router.use('/notes', notes)
router.use('/materias', materias)
router.use('/actions', actions)
router.use('/modules', modules)

module.exports = router
