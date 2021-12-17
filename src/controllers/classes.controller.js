const { Classes, Schools, Materias } = require('../models/')
const Joi = require('joi')
const { conn: sequelize } = require('../db')

const getClassesSchema = Joi.object({
  school_id: Joi.string().guid().required(),
  // name: Joi.string().allow(''),
})

const createClassSchema = Joi.object({
  school_id: Joi.string().guid().required(),
  name: Joi.string().required(),
})

const updateClassSchema = Joi.object({
  id: Joi.string().guid(),
  name: Joi.string().allow(''),
  materias: Joi.array().items(Joi.string().guid()).allow(null),
})

const validateId = (id) => Joi.string().guid().required().validate(id)

const getClasses = async (req, res, next) => {
  try {
    const { school_id } = req.body

    // Valido datos
    const { error } = getClassesSchema.validate({ school_id })

    if (error) return res.status(400).json({ error: error.details[0].message })

    const classes = await Classes.findAll({
      where: { school_id },
      include: { model: Materias, through: { attributes: [] } },
    })

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

    const foundClass = await Classes.findByPk(id, {
      include: { model: Materias, through: { attributes: [] } },
    })

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
    const { id } = req.params // id de clase
    const { name, materias } = req.body //name nombre de clase

    const { error } = updateClassSchema.validate({ id, name, materias })
    if (error) return res.status(400).json({ error: error.details[0].message })

    const condicional = {}
    //creo condicional por si no pasan name
    name && (condicional.name = name)

    const [count, updatedClasses] = await Classes.update(condicional, {
      where: { id },
      returning: true,
    })

    // si no pasan name entonces updatedClasses es undefined, entonces busco por pk
    const foundClass = !updatedClasses && (await Classes.findByPk(id))

    if (foundClass) {
      foundClass.setMaterias?.(materias)
      return res.json({ message: 'class updated' })
    }

    updatedClasses && updatedClasses[0]?.setMaterias?.(materias) //materias es un array de id de materias.

    if (count === 0)
      return res.status(400).json({ error: 'No se pudo actualizar la clase.' })

    res.json({ message: 'class updated' })
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
