const router = require('express').Router()
const {
  getTasks,
  createTask,
  getTaskById,
  deleteTaskById,
  updateTaskById,
} = require('../controllers/tasks.controller')

router.get('/', getTasks)
router.post('/', createTask)

router.get('/:id', getTaskById)
router.put('/:id', updateTaskById)
router.delete('/:id', deleteTaskById)

module.exports = router
