const { Classes, Schools } = require('../models/')
const Joi = require('joi')

const getClassesSchema = Joi.object({
  school_id: Joi.string().guid().required(),
  name: Joi.string().allow(''),
})

const createClassSchema = Joi.object({
  school_id: Joi.string().guid().required(),
  name: Joi.string().required(),
})

const updateClassSchema = Joi.object({
  id: Joi.string().guid(),
  name: Joi.string().allow(''),
})

const validateId = (id) => Joi.string().guid().required().validate(id)

const getClasses = async (req, res, next) => {
  try {
    const { school_id, name } = req.body

    // Valido datos
    const { error } = getClassesSchema.validate({ school_id, name })

    if (error) return res.status(400).json({ error: error.details[0].message })

    // Si pasa el parametro name, entonces filtrara por nombre e id de la escuela.
    if (name) {
      const classesByName = await Classes.findAll({
        where: { school_id, name },
      })
      return res.json(classesByName)
    }

    // Sino solo le mandamos todos los de la escuela
    const classes = await Classes.findAll({ where: { school_id } })

    res.json(classes)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const createClass = async (req, res, next) => {
  try {
    const { name, school_id } = req.body

    // Validacion de los parametros del body
    const { error } = createClassSchema.validate({ name, school_id })

    if (error) return res.status(400).json({ error: error.details[0].message })

    // Valido que la escuela exista.
    const schoolFound = await Schools.findByPk(school_id)

    if (!schoolFound)
      return res
        .status(400)
        .json({ error: 'There is not any school with that ID' })

    // Creo la clase
    await Classes.create({ name, school_id })

    return res.json({ message: 'Classs created successfully' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const getClassById = async (req, res, next) => {
  try {
    const { id } = req.params

    // Validacion del ID
    const { error } = validateId(id)

    if (error) return res.status(400).json({ error: error.details[0].message })

    const foundClass = await Classes.findByPk(id)

    if (foundClass) return res.json(foundClass)

    return res
      .status(400)
      .json({ message: 'There is not any class with that id' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const updateClassById = async (req, res, next) => {
  try {
    const { name } = req.body
    const { id } = req.params

    // Valido
    const { error } = updateClassSchema.validate({ id, name })

    if (error) return res.status(400).json({ error: error.details[0].message })

    // Actualizo la clase
    await Classes.update({ name }, { where: { id } })

    return res.json({ message: 'Class updated successfully' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const deleteClassById = async (req, res, next) => {
  try {
    const { id } = req.params

    const { error } = validateId(id)

    if (error) return res.status(400).json({ error: error.details[0].message })

    await Classes.destroy({ where: { id } })

    return res.json({ message: 'Class deleted successfully' })
  } catch (error) {
    console.error(error)
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
