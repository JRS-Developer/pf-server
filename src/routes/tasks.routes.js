const router = require('express').Router()
const {
  getTasks,
  createTask,
  // getTaskById,
  deleteTaskById,
  updateTaskById,
  changeTaskStatusById,
  alumnoGetTaskById,
  alumnoGetTasks,
  profesorUpdateStudentTaskById,
  profesorGetStudentsTask,
  subirTarea,
  eliminarFile,
} = require('../controllers/tasks.controller')
const {
  verifyToken,
  esProfesor,
  esProfesorOrAlumno,
} = require('../middlewares/auth')
const { file } = require('../utils/multer')
router.use(verifyToken)

//ANOTACIÓN: En este paso solo verificamos el role que tenga el usuario
//            pero por otros medios vamos a verificar que solo pueda ver
//            las tareas de las cuales es parte

router.get('/', esProfesorOrAlumno, getTasks)
router.post('/', esProfesor, createTask)

router.patch('/alumno/:id', esProfesorOrAlumno, changeTaskStatusById)
router.get('/alumno/:id', esProfesorOrAlumno, alumnoGetTaskById)
router.get('/alumno', esProfesorOrAlumno, alumnoGetTasks)
router.post('/alumno', [esProfesorOrAlumno, file], subirTarea)
// router.get('/:id', esProfesor, getTaskById)
router.put('/:id', esProfesor, updateTaskById)
router.put('/:matricula_id/:id', esProfesor, profesorUpdateStudentTaskById)
router.get('/:id', esProfesorOrAlumno, profesorGetStudentsTask)
router.delete('/:id', esProfesor, deleteTaskById)
router.patch('/alumno',esProfesorOrAlumno, eliminarFile) //pongo patch porque si es delete me tira error de permisos (rarisimo)

module.exports = router
