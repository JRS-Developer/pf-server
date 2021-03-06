const Joi = require('joi')
const { Task, Matricula, StudentTask, User, File } = require('../models')
const crearRuta = require('../utils/crearRutaDoc')
const { createNotification } = require('../services/notifications')

// Schemas
const getTasksSchema = Joi.object({
  class_id: Joi.string().guid().required(),
  materia_id: Joi.string().guid().required(),
  ciclo_lectivo_id: Joi.string().guid().required(),
  school_id: Joi.string().guid().required(),
})

const createTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  end_date: Joi.date(),
  school_id: Joi.string().guid().required(),
  class_id: Joi.string().guid().required(),
  materia_id: Joi.string().guid().required(),
  ciclo_lectivo_id: Joi.string().guid().required(),
})

const getTasks = async (req, res, next) => {
  try {
    // Obtengo las tareas en base de la clase y materia
    const { class_id, materia_id, ciclo_lectivo_id, school_id } = req.query

    // Validar los datos
    const { error } = getTasksSchema.validate({
      class_id,
      materia_id,
      ciclo_lectivo_id,
      school_id,
    })

    if (error) return res.status(400).json({ error: error.details[0].message })

    const tasks = await Task.findAll({
      where: { class_id, materia_id, ciclo_lectivo_id, school_id },
    })

    return res.json(tasks)
  } catch (error) {
    console.error(error)
    next(error)
  }
}
const alumnoGetTasks = async (req, res, next) => {
  try {
    // Obtengo las tareas en base de la clase, materia, ciclo lectivo, school
    const { class_id, materia_id, ciclo_lectivo_id, school_id } = req.query
    const userId = res.locals.userId

    // Validar los datos
    const { error } = getTasksSchema.validate({
      class_id,
      materia_id,
      ciclo_lectivo_id,
      school_id,
    })

    if (error) return res.status(400).json({ error: error.details[0].message })

    const tasks = await Task.findAll({
      where: { class_id, materia_id, ciclo_lectivo_id },
      include: {
        model: Matricula,
        where: { student_id: userId },
        attributes: ['id'],
      },
    })

    return res.json(tasks)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const createTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      end_date,
      school_id,
      class_id,
      materia_id,
      ciclo_lectivo_id,
    } = req.body

    // Validar datos
    const { error } = createTaskSchema.validate({
      title,
      description,
      end_date,
      school_id,
      class_id,
      materia_id,
      ciclo_lectivo_id,
    })

    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const task = await Task.create({
      title,
      description,
      end_date,
      school_id,
      class_id,
      materia_id,
      ciclo_lectivo_id,
    })

    const matriculas = await Matricula.findAll({
      where: {
        school_id: school_id,
        clase_id: class_id,
        ciclo_lectivo_id: ciclo_lectivo_id,
      },
    })
    //Le asigno la tarea a los estudiantes mediante su matricula
    task.setMatriculas(matriculas)

    // Envio la notificacion a los estudiantes
    const students = [...new Set(matriculas.map((m) => m.student_id))]

    const notification = {
      title: 'Nueva Tarea',
      message: `Tarea ${title} asignada por el profesor`,
      url: `/tareas/${task.id}`,
      receivers: students,
      senderId: res.locals.userId,
    }

    createNotification(notification)

    return res.json({ message: 'Task created successfully' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const profesorGetStudentsTask = async (req, res, next) => {
  try {
    const { id } = req.params

    const taskFound = await Task.findByPk(id, {
      include: {
        model: Matricula,
        attributes: ['id'],
        include: {
          model: User,
          attributes: ['id', 'firstName', 'lastName'],
        },
      },
    })
    if (!taskFound) {
      return res.status(400).json({ error: 'Task not found' })
    }

    const file_ids = taskFound?.matriculas?.map((matricula) => {
      return {
        matricula_id: matricula.id,
        file_id: matricula.student_tasks.file_id,
      }
    })

    let tasks = taskFound.toJSON()
    let promises = tasks.matriculas.map(async (matricula) => {
      let file_id = file_ids.filter(
        (file_id) => file_id.matricula_id === matricula.id
      )[0]

      return File.findByPk(file_id.file_id, {
        attributes: ['id', 'name', 'url'],
      })
    })

    await Promise.all(promises).then((respuestas) => {
      // Agrego el file a cada student task
      tasks.matriculas.forEach((matricula, index) => {
        matricula.student_tasks.file = respuestas[index]
          ? respuestas[index].toJSON()
          : null
      })
    })

    return res.json(tasks)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const alumnoGetTaskById = async (req, res, next) => {
  const userId = res.locals.userId
  try {
    const { id } = req.params

    const taskFound = await Task.findByPk(id, {
      include: {
        model: Matricula,
        where: { student_id: userId },
        attributes: ['id'],
      },
    })

    const file_id = taskFound?.matriculas[0]?.student_tasks?.file_id

    const fileFound = await File.findByPk(file_id)

    const task = taskFound.toJSON()

    task.file = fileFound

    if (!taskFound) {
      return res
        .status(400)
        .json({ error: 'There is not any task with that id' })
    }

    return res.json(task)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const updateTaskById = async (req, res, next) => {
  try {
    // Los unicos parametros que pueden ser cambiados son: title, description, y end_date
    const { title, description, end_date } = req.body
    const { id } = req.params

    const [count] = await Task.update(
      { title, description, end_date },
      {
        where: {
          id,
        },
      }
    )
    if (count) {
      return res.json({ message: 'Task updated successfully' })
    }

    return res
      .status(400)
      .json({ message: 'There is not any task with that ID' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const profesorUpdateStudentTaskById = async (req, res, next) => {
  try {
    const { devolucion, observation, grade } = req.body
    const { matricula_id, id } = req.params //(task_id)

    const [count] = await StudentTask.update(
      { devolucion, observation, grade },
      {
        where: {
          matricula_id,
          task_id: id,
        },
      }
    )
    if (count) {
      return res.json({ message: 'Task updated successfully' })
    }

    return res
      .status(400)
      .json({ message: 'There is not any task with that ID' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}
const deleteTaskById = async (req, res, next) => {
  try {
    const { id } = req.params

    await Task.destroy({ where: { id } })

    return res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const changeTaskStatusById = async (req, res, next) => {
  const userId = res.locals.userId
  try {
    const { id } = req.params
    const matriculaId = await Matricula.findOne({
      where: { student_id: userId },
    })
    const date = new Date()

    const [count] = await StudentTask.update(
      { status: 'submitted', fecha_entregada: date },

      {
        where: { task_id: id, matricula_id: matriculaId.dataValues.id },
        returning: true,
      }
    )

    if (count === 0) return res.status(400).json({ error: 'Task not found' })

    return res.status(201).json({ message: 'Homework submitted' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const subirTarea = async (req, res, next) => {
  const file = req.file
  const { task_id, matricula_id } = req.body
  try {
    const filepath = file && crearRuta(req, file.filename)
    const tareaAlumno = await StudentTask.findOne({
      where: { task_id, matricula_id },
    })

    if (!tareaAlumno)
      return res.status(400).json({ error: 'Tarea no encontrada.' })

    const newFile =
      filepath &&
      (await File.create({
        url: filepath,
        name: file.filename,
        type: file.mimetype,
      }))
    tareaAlumno.setFile(newFile)

    return res.status(201).json({ message: 'Tarea cargada' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const eliminarFile = async (req, res, next) => {
  const { task_id, matricula_id } = req.body
  try {
    const tareaAlumno = await StudentTask.findOne({
      where: { task_id, matricula_id },
    })

    if (!tareaAlumno)
      return res.status(400).json({ error: 'Tarea no encontrada.' })

    tareaAlumno.setFile(null)

    return res.status(201).json({ message: 'Tarea eliminada' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

module.exports = {
  getTasks,
  createTask,
  updateTaskById,
  deleteTaskById,
  changeTaskStatusById,
  alumnoGetTaskById,
  alumnoGetTasks,
  profesorGetStudentsTask,
  profesorUpdateStudentTaskById,
  subirTarea,
  eliminarFile,
}
