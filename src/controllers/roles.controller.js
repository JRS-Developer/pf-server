const { Role } = require('../models')
const Joi = require('joi')

const updateRoleSchema = Joi.object({
  id: Joi.string().guid().required(),
  name: Joi.string(),
})

//get para obtener roles
const getRoles = async (_req, res, next) => {
  try {
    //se traen todos los roles
    const roles = await Role.findAll()

    //se envian como un array de objetos
    res.json(roles)

    //en caso de haber error es manejado por el catch
  } catch (error) {
    console.error(error)
    next(error)
  }
}

//Post para crear roles
const createRole = async (req, res, next) => {
  try {
    //se recibe el dato necesario name por body
    const { name } = req.body

    const { error } = Joi.string().required().validate(name)

    if (error) return res.status(400).json({ error: error.details[0].message })

    //se crea el nuevo rol
    await Role.create({ name })

    //mensaje satisfactorio
    res.json({ message: 'role succesfully created' })

    //en caso de haber error es manejado por el catch
  } catch (error) {
    console.error(error)
    next(error)
  }
}

//Put paramodificar roles
const updateRole = async (req, res, next) => {
  try {
    const { name } = req.body
    const { id } = req.params

    // Si el body esta vacio retorno un error
    if (!Object.keys(req.body).length)
      return res.status(400).json({ error: 'Please provide some body data' })

    // Valido los datos
    const { error } = updateRoleSchema.validate({ id, ...req.body })

    if (error) return res.status(400).json({ error: error.details[0].message })

    await Role.update({ name }, { where: { id } })

    res.status(201).json({ message: 'Role updated sucessfully' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const deleteRole = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body

    await Role.update({ status }, { where: { id } })

    res.status(201).json({ message: 'Status updated succesfully' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

module.exports = {
  getRoles,
  createRole,
  updateRole,
  deleteRole
}
