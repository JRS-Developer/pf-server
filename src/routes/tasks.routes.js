const router = require('express').Router()
const {
  getTasks,
  createTask,
  getTaskById,
  deleteTaskById,
  updateTaskById,
} = require('../controllers/tasks.controller')
const { verifyToken, esProfesor } = require('../middlewares/auth')

router.use(verifyToken)

//ANOTACIÓN: En este paso solo verificamos el role que tenga el usuario
//            pero por otros medios vamos a verificar que solo pueda ver
//            las tareas de las cuales es parte

router.get('/', esProfesor, getTasks)
router.post('/', esProfesor, createTask)

router.get('/:id', esProfesor, getTaskById)
router.put('/:id', esProfesor, updateTaskById)
router.delete('/:id', esProfesor, deleteTaskById)

module.exports = router
