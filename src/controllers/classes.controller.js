const Classes = require('../models/Classes');

const getClasses = async (req, res, next) => {
  try {
    const { school_id, name } = req.body

    // Si pasa el parametro name, entonces filtrara por nombre e id de la escuela.
    if(name) {
      const classesByName = await Classes.findAll({where: {school_id, name}})
      return res.json(classesByName)
    }

    // Sino solo le mandamos todos los de la escuela
    const classes = await Classes.findAll({ where: { school_id } })

    res.json(classes)
  } catch (error) {
    next(error)
  }
}

const createClass = async (req, res, next) => {
  try {
    const { name } = req.body

    await Classes.create({ name })

    return res.json({ message: 'Classs created successfully' })
  } catch (error) {
    next(error)
  }
}

const getClassById = async (req, res, next) => {
  try {
    const { id } = req.params

    const foundClass = await Classes.findByPk(id)

    if (foundClass) return res.json(foundClass)

    return res
      .status(400)
      .json({ message: 'There is not any class with that id' })
  } catch (error) {
    next(error)
  }
}

const updateClassById = async (req, res, next) => {
  try {
    const { name } = req.body
    const { id } = req.params

    await Classes.update({ name }, { where: id })

    return res.json({ message: 'Class updated successfully' })
  } catch (error) {
    next(error)
  }
}

const deleteClassById = async (req, res, next) => {
  try {
    const { id } = req.params

    await Classes.destroy({ where: { id } })

    return res.json({ message: 'Class deleted successfully' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getClasses,
  createClass,
  getClassById,
  deleteClassById,
  updateClassById,
}
