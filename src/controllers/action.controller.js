const Joi = require('joi')
const { Action } = require('../models')

// Schemas
const creaActionSchema = Joi.object({
  name: Joi.string().required(),
  action_param: Joi.string(),
  onclick: Joi.string(),
  icon: Joi.string().required(),
})

const getActions = async (req, res, next) => {
  try {
    const actions = await Action.findAll()

    return res.json(actions)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const createAction = async (req, res, next) => {
  try {
    const { name, action_param, onclick, icon } = req.body

    // Validar datos
    const { error } = creaActionSchema.validate({
      name,
      action_param,
      onclick,
      icon,
    })
    if (error) return res.status(400).json({ error: error.details[0].message })

    await Action.create({
      name,
      action_param,
      onclick,
      icon,
    })

    return res.json({ message: 'Action created successfully' })
  } catch (error) {
    //console.error(error)
    next(error)
  }
}

const getActionById = async (req, res, next) => {
  try {
    const { id } = req.params

    const actionFound = await Action.findByPk(id)

    if (!actionFound) {
      return res
        .status(400)
        .json({ error: 'There is not any action with that id' })
    }

    return res.json(actionFound)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const updateActionById = async (req, res, next) => {
  try {
    // Los unicos parámetros que pueden ser cambiados
    const { name, action_param, onclick, icon } = req.body
    const { id } = req.params

    if (!req.body.name) {
      const updated = await Action.update(
        { status: req.body.status },
        {
          where: {
            id,
          },
        }
      )
      if (updated.length) {
        return res.json({ message: 'Status updated successfully' })
      }
    } else {
      const updated = await Action.update(
        { name, action_param, onclick, icon },
        {
          where: {
            id,
          },
        }
      )
      console.log(updated)
      if (updated.length) {
        return res.json({ message: 'Actions updated successfully' })
      }
    }

    return res
      .status(400)
      .json({ message: 'There is not any action with that ID' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const deleteActionById = async (req, res, next) => {
  try {
    const { id } = req.params

    await Action.destroy({ where: { id } })

    return res.json({ message: 'Action deleted successfully' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

module.exports = {
  getActions,
  createAction,
  getActionById,
  updateActionById,
  deleteActionById,
}
