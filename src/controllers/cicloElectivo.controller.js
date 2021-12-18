const Joi = require('joi')
const { CicloElectivo } = require('../models')

// Schemas
const creaCicloElectivoSchema = Joi.object({
  name: Joi.string().required(),
})

const getCicloElectivos = async (req, res, next) => {
  try {

    const cicloElectivos = await CicloElectivo.findAll()

    return res.json(cicloElectivos);

  } catch (error) {
    console.error(error)
    next(error)
  }
}

const createCicloElectivo = async (req, res, next) => {
  try {
    const { name } = req.body

    // Validar datos
    const { error } = creaCicloElectivoSchema.validate({
      name
    })
    if (error) return res.status(400).json({ error: error.details[0].message })

    await CicloElectivo.create({
      name
    })

    return res.json({ message: 'Ciclo Electivo created successfully' })
  } catch (error) {
    //console.error(error)
    next(error)
  }
}

const getCicloElectivoById = async (req, res, next) => {
  try {
    const { id } = req.params

    const CicloElectivoFound = await CicloElectivo.findByPk(id)

    if (!CicloElectivoFound) {
      return res
        .status(400)
        .json({ error: 'There is not any Ciclo Electivo with that id' })
    }

    return res.json(CicloElectivoFound)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const updateCicloElectivoById = async (req, res, next) => {
  try {
    // Los unicos parámetros que pueden ser cambiados
    const { name } = req.body
    const { id } = req.params

    if( !req.body.name ){
      const updated = await CicloElectivo.update(
        { status: req.body.status },
        {
          where: {
            id
          }
        }
      )
      if (updated.length) {
        return res.json({ message: 'Status updated successfully' })
      }
    }else{
      const updated = await CicloElectivo.update(
        { name },
        {
          where: {
            id,
          },
        }
      )
      console.log(updated);
      if (updated.length) {
        return res.json({ message: 'Ciclo Electivos updated successfully' })
      }
    }

    return res
      .status(400)
      .json({ message: 'There is not any Ciclo Electivo with that ID' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const deleteCicloElectivoById = async (req, res, next) => {
  try {
    const { id } = req.params

    await CicloElectivo.destroy({ where: { id } })

    return res.json({ message: 'Ciclo Electivo deleted successfully' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

module.exports = {
  getCicloElectivos,
  createCicloElectivo,
  getCicloElectivoById,
  updateCicloElectivoById,
  deleteCicloElectivoById,
}
