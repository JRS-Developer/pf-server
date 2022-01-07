const { Materias, Classes } = require('../models/')
const Joi = require('joi')

const getMateriaSchema = Joi.object({
  name: Joi.string().allow(''),
})

const createMateriaSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(null),
  clase_ids: Joi.array().items(Joi.string().guid()).allow(null),
})

const updateMateriaSchema = Joi.object({
  name: Joi.string().allow(null),
  description: Joi.string().allow(null),
  clase_ids: Joi.array().items(Joi.string().guid()).allow(null),
})

const get_materias = async (req, res, next) => {
  try {
    const materias = await Materias.findAll({
      include: {
        model: Classes,
        through: {
          attributes: [],
        },
      },
    })

    //se envia la respuesta como un arreglo de objetos
    res.json(materias)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

//get para obtener la materia
const get_one_materia = async (req, res, next) => {
  try {
    const { id } = req.params

    const materia_found = await Materias.findByPk(id, {
      include: {
        model: Classes,
        through: {
          attributes: [],
        },
      },
    })

    //se verifica si se encontró coincidencia y se retorna el objeto sino se envia error
    if (!materia_found)
      return res.status(400).json({ error: 'No encontramos la materia' })

    return res.json(materia_found)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

//post para crear la materia
const create_materia = async (req, res, next) => {
  try {
    const { name, description, clase_ids } = req.body //clase_ids es un array de ids de clases

    const { error } = createMateriaSchema.validate({ name, description })
    if (error) return res.status(400).json({ error: error.details[0].message })

    const [nuevaMateria, created] = await Materias.findOrCreate({
      where: { name, description },
    })

    if (!created)
      return res
        .status(400)
        .json({ error: 'Ya hay una materia con ese nombre' })

    await nuevaMateria.addClasses(clase_ids)

    res.json({ message: 'materia successfully created' })
  } catch (error) {
    next(error)
  }
}

const update_materia = async (req, res, next) => {
  try {
    const { id } = req.params // id de materia
    const { name, description, clase_ids } = req.body //name nombre de materia

    const { error } = updateMateriaSchema.validate({
      name,
      description,
      clase_ids,
    })
    if (error) return res.status(400).json({ error: error.details[0].message })

    const [count, updatedMaterias] = await Materias.update(
      { name, description },
      { where: { id }, returning: true }
    )

    updatedMaterias[0].setClasses?.(clase_ids) //classes es un array de id de classes.

    if (count === 0)
      return res
        .status(400)
        .json({ error: 'No se pudo actualizar la materia.' })

    res.json({ message: 'materia updated' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

//delete para eliminar materia
const delete_materia = async (req, res, next) => {
  try {
    const { id } = req.params
    await Materias.update({ status: false }, { where: { id } })
    res.json({ message: 'materia was deleted' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  get_materias,
  get_one_materia,
  create_materia,
  delete_materia,
  update_materia,
}
