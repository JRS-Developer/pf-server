const Joi = require('joi')
const Schools = require('../models/Schools')

const createSchoolSchema = Joi.object({
  name: Joi.string().required(),
})

const updateSchoolSchema = Joi.object({
  id: Joi.string().guid().required(),
  naeme: Joi.string().allow(''),
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

    await Schools.create({ name })

    return res.json({ message: 'School created successfully' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const updateSchoolById = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name } = req.body

    const { error } = updateSchoolSchema.validate({ id, name })

    if (error) return res.status(400).json({ error: error.details[0].message })

    await Schools.update({ name }, { where: { id } })

    return res.json({ message: 'School updated successfully' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const deleteSchoolById = async (req, res, next) => {
  try {
    const { id } = req.params

    const { error } = validateId(id)
    if (error) return res.status(400).json({ error: error.details[0].message })

    await Schools.destroy({ where: { id } })

    return res.json({ message: 'School deleted successfully' })
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
