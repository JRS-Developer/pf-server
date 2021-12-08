const router = require('express').Router();
const tasksRouter = require('./tasks.routes');
const classesRouter = require('./classes.routes');
const users = require('./users.routes');
const aulas = require('./aulas.routes')
const auth = require('./auth.routes')

router.use('/tasks', tasksRouter);
router.use('/users', users);

// FIX: Aulas y classes son lo mismo? Si es asi hay que decidir cual dejar y cual descartar
router.use('/classes', classesRouter);
router.use('/aulas', aulas)
router.use('/auth', auth)

module.exports = router
