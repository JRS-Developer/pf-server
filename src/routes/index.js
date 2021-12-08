
const router = require('express').Router();
const tasksRouter = require('./tasks.routes');
const classesRouter = require('./classes.routes');
const users = require('./users.routes');
const notes = require('./notes.routes');
const materias = require('./materias.routes')

router.use('/tasks', tasksRouter);
router.use('/users', users);
router.use('/classes', classesRouter);
router.use('/notes', notes)
router.use('/materias', materias)

module.exports = router
