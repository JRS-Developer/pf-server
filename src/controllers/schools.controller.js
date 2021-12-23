const Joi = require('joi')
const Schools = require('../models/Schools')
const {Role} = require("../models");

const createSchoolSchema = Joi.object({
  name: Joi.string().required(),
  class_ids: Joi.array().items(Joi.string().guid()).allow(null),
})

const updateSchoolSchema = Joi.object({
  id: Joi.string().guid().required(),
  name: Joi.string().allow(''),
  class_ids: Joi.array().items(Joi.string().guid()).allow(null),
})

const validateId = (id) => Joi.string().guid().required().validate(id)

const getSchools = async (_req, res, next) => {
  try {
    const schools = await Schools.findAll()

    res.json(schools)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const getSchoolById = async (req, res, next) => {
  const { id } = req.params
  try {

    const school = await Schools.findByPk(id)

    res.json(school)

  } catch (error) {
    console.error(error)
    next(error)
  }
}


const createSchool = async (req, res, next) => {
  try {
    const { name , class_ids } = req.body

    const { error } = createSchoolSchema.validate({ name , class_ids })

    if (error) return res.status(400).json({ error: error.details[0].message })

    const [ school, created ] = await Schools.findOrCreate({
      where: { name },
      defaults: { name },
    })

    if (!created){
      return res
        .status(400)
        .json({ error: 'There is already a school with that data' })}
    
    if(class_ids){
      school.addClasses(class_ids)
    }

    return res.status(201).json({ message: 'School created successfully' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const updateSchoolById = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name , class_ids } = req.body

    // Si el body esta vacio, entonces retorno un error
    if (!Object.keys(req.body)) {
      return res.status(400).json({ error: 'Please provide some body data' })
    }

    // Valido los parametros mandados por body
    const { error } = updateSchoolSchema.validate({ id, name , class_ids })

    if (error) return res.status(400).json({ error: error.details[0].message })

    //creo condicional por si no me pasan name
    const condicional = {}
    name && (condicional.name = name)

    // Actualizo la escuela
    const [count , updatedSchool] = await Schools.update(condicional, { where: { id },returning:true })

    //si no pasan name entonces updatedSchool es undefineed, entonces busco por id
    const foundSchool = !updatedSchool && (await Schools.findByPk(id))

    class_ids && foundSchool.setClasses?.(class_ids);
    class_ids && updatedSchool && updatedSchool[0]?.setClasses(class_ids)


    if (count === 0)
      return res
        .status(400)
        .json({ error: 'Not found any school with that Id' })

    return res.status(201).json({ message: 'School updated successfully' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const deleteSchoolById = async (req, res, next) => {
  try {
    const { id } = req.params

    const { error } = validateId(id)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    await Schools.destroy({ where: { id } })

    return res.status(201).json({ message: 'School deleted successfully' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

module.exports = {
  getSchools,
  getSchoolById,
  createSchool,
  updateSchoolById,
  deleteSchoolById,
}
