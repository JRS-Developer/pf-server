const router = require('express').Router();
const tasksRouter = require('./tasks.routes');
const users = require('./users.routes');

router.use('/tasks', tasksRouter);
router.use('/users', users);

module.exports = router;

