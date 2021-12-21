const { Classes, Schools, Materias } = require('../models/')
const Joi = require('joi')
const { conn: sequelize } = require('../db')
const { materias } = require('../datos/materias')

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
  school_id: Joi.string().guid().required(),
  materia_ids: Joi.array().items(Joi.string().guid()).allow(null),
})

const validateId = (id) => Joi.string().guid().required().validate(id)

const getClassesBySchoolId = async (req, res, next) => {
  try {
    const { school_id } = req.params

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

const getClasses = async (req, res, next) => {
  try {
    const classes = await Classes.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      include: [
        {
          model: Materias,
          through: { attributes: [] },
        },
        {
          model: Schools,
          attributes: ['id', 'name'],
        },
      ],
    })


    let listClases = classes.map((clase) => {
      clase = clase.toJSON()
      return {
        ...clase,
        school: clase.school?.name,
      }
    })

    res.json(listClases)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const createClass = async (req, res, next) => {
  try {
    const { name, school_id, materia_ids } = req.body // materia_ids = [] de ids de materias

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
    const newClase = await Classes.create({ name, school_id })

    newClase.addMaterias(materia_ids)

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
      include: [
        {
          model: Materias,
          through: { attributes: [] },
        },
      ],
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
    const { name, materia_ids, school_id } = req.body //name nombre de clase

    const { error } = updateClassSchema.validate({
      id,
      name,
      materia_ids,
      school_id,
    })
    if (error) return res.status(400).json({ error: error.details[0].message })

    const condicional = {}
    //creo condicional por si no pasan name o school_id
    name && (condicional.name = name)
    school_id && (condicional.school_id = school_id)

    const [count, updatedClasses] = await Classes.update(condicional, {
      where: { id },
      returning: true,
    })

    // si no pasan name entonces updatedClasses es undefined, entonces busco por pk
    const foundClass = !updatedClasses && (await Classes.findByPk(id))

    if (foundClass) {
      foundClass.setMaterias?.(materia_ids)
      return res.json({ message: 'class updated' })
    }

    updatedClasses && updatedClasses[0]?.setMaterias?.(materia_ids) //materia_ids es un array de id de materias.

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
  getClassesBySchoolId,
  createClass,
  getClassById,
  deleteClassById,
  updateClassById,
}
