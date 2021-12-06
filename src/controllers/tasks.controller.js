const { Task } = require('../models')

const getTasks = async (req, res) => {
  try {
    // Obtengo las tareas en base de la clase y materia
    const { class_id, materia_id } = req.body
    // TODO: añadir validaciones de datos

    const tasks = await Task.findAll({ where: { class_id, materia_id } })

    return res.json(tasks)
  } catch (error) {
    console.error(error)
  }
}

const createTask = async (req, res) => {
  try {
    const { title, description, end_date, teacher_id, class_id, materia_id } =
      req.body
    // TODO: añadir validaciones de datos

    await Task.create(
      title,
      description,
      end_date,
      teacher_id,
      class_id,
      materia_id
    )

    return res.json({ message: 'Task created successfully' })
  } catch (error) {
    console.error(error)
  }
}

const getTaskById = async (req, res) => {
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
    console.error(error)
  }
}

const updateTaskById = async (req, res) => {
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
    console.error(error)
  }
}

const deleteTaskById = async (req, res) => {
  try {
    const { id } = req.params

    const deleted = await Task.destroy({ where: { id } })

    if (deleted) return res.json({ message: 'Task deleted successfully' })

    return res
      .status(400)
      .json({ message: 'There is not any task with that ID' })
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  getTasks,
  createTask,
  getTaskById,
  updateTaskById,
  deleteTaskById
}
