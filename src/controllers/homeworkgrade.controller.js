/*
CUIDADO, ESTE ARCHIVO ESTÁ DEPRECADO
CUIDADO, ESTE ARCHIVO ESTÁ DEPRECADO
CUIDADO, ESTE ARCHIVO ESTÁ DEPRECADO
CUIDADO, ESTE ARCHIVO ESTÁ DEPRECADO
CUIDADO, ESTE ARCHIVO ESTÁ DEPRECADO
CUIDADO, ESTE ARCHIVO ESTÁ DEPRECADO
CUIDADO, ESTE ARCHIVO ESTÁ DEPRECADO
*/

const { ne } = require('sequelize/dist/lib/operators')
const HomeworkGrade = require('../models/HomeworkGrade')
const Joi = require('joi')

const getHomeworkGradeSchema = Joi.object({
  homeworkgrade_id: Joi.string().guid().required(),
  value: Joi.string().allow(''),
})

const createHomeworkGradeSchema = Joi.object({
  homeworkgrade_id: Joi.string().guid().required(),
  value: Joi.string().allow(''),
})

const updateHomeworkGradeSchema = Joi.object({
  id: Joi.string().guid().required(),
  value: Joi.string().allow(''),
})

const get_homeworkgrades = async (req, res, next) => {
  try {
    const { value } = req.body

    const { error } = getHomeworkGradeSchema.validate({
      homeworkgrade_id,
      value,
    })
    if (error) return res.status(400).json({ error: error.details[0].message })

    if (value) {
      const findHomeworkGrade = await HomeworkGrade.findAll({
        where: { value },
      })
      return res.json(findHomeworkGrade)
    }
  } catch (error) {
    next(error)
  }
}

const create_homeworkgrade = async (req, res, next) => {
  try {
    const { value } = req.body

    const { error } = createHomeworkGradeSchema.validate({
      value,
      homeworkgrade_id,
    })
    if (error) return res.status(400).json({ error: error.details[0].message })

    const homeworkgradeFound = await HomeworkGrade.findByPk(homeworkgrade_id)
    if (!homeworkgradeFound)
      return res.status(400).json({ error: 'There is not any homeworkgrade' })

    await HomeworkGrade.create({ value })
    res.json({ message: 'create!' })
  } catch (error) {
    next(error)
  }
}

const delete_homeworkgrade = async (req, res, next) => {
  try {
    const { value } = req.params
    await HomeworkGrade.destroy({ where: { value: value } })
    res.json({ message: 'homeworkgrade deleted' })
  } catch (error) {
    next(error)
  }
}

const upDate_homeworkgrade = async (req, res, next) => {
  try {
    const { id } = req.params

    const { error } = updateHomeworkGradeSchema.validate({ id, value })
    if (error) return res.status(400).json({ error: error.details[0].message })

    if (id) {
      await HomeworkGrade.update({ where: { id: id } })
      return res.json({ message: 'homeworkgrade succesfully modified' })
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  get_homeworkgrades,
  create_homeworkgrade,
  delete_homeworkgrade,
  upDate_homeworkgrade,
}
