const Joi = require('joi')
const Schools = require('../models/Schools')

const createSchoolSchema = Joi.object({
  name: Joi.string().required(),
})

const updateSchoolSchema = Joi.object({
  id: Joi.string().guid().required(),
  name: Joi.string().allow(''),
})

const validateId = (id) => Joi.string().guid().required().validate(id)

const validateOptionalStr = (string) => Joi.string().allow('').validate(string)

const getSchools = async (req, res, next) => {
  try {
    const { name } = req.body

    const { error } = validateOptionalStr(name)

    if (error) return res.status(400).json({ error: error.details[0].message })

    if (name) {
      const schoolsByName = await Schools.findAll({ where: { name } })
      return res.json(schoolsByName)
    }

    const schools = await Schools.findAll()

    res.json(schools)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const createSchool = async (req, res, next) => {
  try {
    const { name } = req.body

    const { error } = createSchoolSchema.validate({ name })

    if (error) return res.status(400).json({ error: error.details[0].message })

    const [, created] = await Schools.findOrCreate({
      where: { name },
      defaults: { name },
    })

    if (!created)
      return res
        .status(400)
        .json({ error: 'There is already a school with that data' })

    return res.status(201).json({ message: 'School created successfully' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const updateSchoolById = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name } = req.body

    // Si el body esta vacio, entonces retorno un error
    if (!Object.keys(req.body)) {
      return res.status(400).json({ error: 'Please provide some body data' })
    }

    // Valido los parametros mandados por body
    const { error } = updateSchoolSchema.validate({ id, name })

    if (error) return res.status(400).json({ error: error.details[0].message })

    // Actualizo la escuela
    const [count] = await Schools.update({ name }, { where: { id } })

    // Compruebo si hubieron cambios, si no, entonces retorno un error
    if (!count)
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
  createSchool,
  updateSchoolById,
  deleteSchoolById,
}
