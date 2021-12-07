
const router = require('express').Router();
const tasksRouter = require('./tasks.routes');
const classesRouter = require('./classes.routes');
const users = require('./users.routes');

router.use('/tasks', tasksRouter);
router.use('/users', users);
router.use('/classes', classesRouter);

module.exports = router
