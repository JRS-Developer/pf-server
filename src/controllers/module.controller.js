const Joi = require('joi')
const { Module, Action } = require('../models')

// Schemas
const creaModuleSchema = Joi.object({
  name: Joi.string().required(),
  url: Joi.string(),
  icon: Joi.string(),
  module_id: Joi.string(),
})

const getModules = async (req, res, next) => {
  try {

    const modules = await Module.findAll()

    return res.json(modules)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const createModule = async (req, res, next) => {
  try {
    const { name, url, icon, module_id, action_id } =
      req.body

    // Validar datos
    const { error } = creaModuleSchema.validate({
      name,
      url,
      icon,
      module_id
    })

    if (error) return res.status(400).json({ error: error.details[0].message })

    let newModule = await Module.create({
      name,
      url,
      icon,
      module_id
    })
    newModule.addActions(action_id)
    return res.json({ message: 'Module created successfully' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const getModuleById = async (req, res, next) => {
  try {
    const { id } = req.params

    const moduleFound = await Module.findOne({
      where: {
        id: id
      },
      include: {
        model: Action
      }
    })

    if (!moduleFound) {
      return res
        .status(400)
        .json({ error: 'There is not any Module with that id' })
    }

    return res.json(moduleFound)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const updateModuleById = async (req, res, next) => {
  try {
    // Los unicos parámetros que pueden ser cambiados
    const { name, url, icon, module_id, action_id } = req.body
    const { id } = req.params

    if( !name ){
      let [count, updatedModule] = await Module.update(
        { status: req.body.status },
        {
          where: {
            id
          }
        }
      )

      if (count) {
        return res.json({ message: 'Module updated successfully' })
      }
    }else{
      let [count, updateModule] = await Module.update(
        { name, url, icon, module_id, action_id },
        {
          where: {
            id,
          },
          returning :true
        }
      )

      updateModule[0].setActions && updateModule[0].setActions(action_id)
      if (count) {
        return res.json({ message: 'Module updated successfully' })
      }
    }

    return res
      .status(400)
      .json({ message: 'There is not any Module with that ID' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const deleteModuleById = async (req, res, next) => {
  try {
    const { id } = req.params

    await Module.destroy({ where: { id } })

    return res.json({ message: 'Module deleted successfully' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

module.exports = {
  getModules,
  createModule,
  getModuleById,
  updateModuleById,
  deleteModuleById,
}
