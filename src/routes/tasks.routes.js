const router = require('express').Router()
const {
  getTasks,
  createTask,
  getTaskById,
  deleteTaskById,
  updateTaskById,
  changeTaskStatusById,
} = require('../controllers/tasks.controller')
const { verifyToken, esProfesor, esProfesorOrAlumno } = require('../middlewares/auth')

router.use(verifyToken)

//ANOTACIÓN: En este paso solo verificamos el role que tenga el usuario
//            pero por otros medios vamos a verificar que solo pueda ver
//            las tareas de las cuales es parte

router.get('/', esProfesorOrAlumno, getTasks)
router.post('/', esProfesor, createTask)

router.patch('/:id',esProfesorOrAlumno,changeTaskStatusById)

router.get('/:id', esProfesor, getTaskById)
router.put('/:id', esProfesor, updateTaskById)
router.delete('/:id', esProfesor, deleteTaskById)

module.exports = router
