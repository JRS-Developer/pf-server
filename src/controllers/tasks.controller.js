const { Task } = require('../models')

const getTasks = async (req, res, next) => {
  try {
    // Obtengo las tareas en base de la clase y materia
    const { class_id, materia_id } = req.body
    // TODO: añadir validaciones de datos

    const tasks = await Task.findAll({ where: { class_id, materia_id } })

    return res.json(tasks)
  } catch (error) {
    next(error)
  }
}

const createTask = async (req, res, next) => {
  try {
    const { title, description, end_date, teacher_id, class_id, materia_id } =
      req.body
    // TODO: añadir validaciones de datos

    await Task.create({
      title,
      description,
      end_date,
      teacher_id,
      class_id,
      materia_id,
    })

    return res.json({ message: 'Task created successfully' })
  } catch (error) {
    next(error)
  }
}

const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params

    const taskFound = await Task.findByPk(id)

    if (!taskFound) {
      return res
        .status(400)
        .json({ error: 'There is not any task with that id' })
    }

    return res.json(taskFound)
  } catch (error) {
    next(error)
  }
}

const updateTaskById = async (req, res, next) => {
  try {
    // Los unicos parametros que pueden ser cambiados son: title, description, y end_date
    const { title, description, end_date } = req.body
    const { id } = req.params

    const updated = await Task.update(
      { title, description, end_date },
      {
        where: {
          id,
        },
      }
    )
    if (updated.length) {
      return res.json({ message: 'Task updated successfully' })
    }

    return res
      .status(400)
      .json({ message: 'There is not any task with that ID' })
  } catch (error) {
    next(error)
  }
}

const deleteTaskById = async (req, res, next) => {
  try {
    const { id } = req.params

    await Task.destroy({ where: { id } })

    return res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getTasks,
  createTask,
  getTaskById,
  updateTaskById,
  deleteTaskById,
}
