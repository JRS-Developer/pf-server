const router = require('express').Router()
const { taskCTRL } = require('../controllers')

router.get('/', taskCTRL.getTasks)
router.post('/', taskCTRL.createTask)

router.get('/:id', taskCTRL.getTaskById)
router.put('/:id', taskCTRL.updateTaskById)
router.delete('/:id', taskCTRL.deleteTaskById)

module.exports = router
