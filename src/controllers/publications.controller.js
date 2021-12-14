const { Publication } = require('../models')
const { Op } = require('sequelize')
const Joi = require('joi')

const createPubliSchema = Joi.object({
  title: Joi.string().required(),
  text: Joi.string().required(),
  images: Joi.array().items(Joi.string()),
  files: Joi.array().items(Joi.string()),
  publisher_id: Joi.string().uuid().required(),
})

const updatePubliSchema = Joi.object({
  title: Joi.string().allow('', null),
  text: Joi.string().allow('', null),
  images: Joi.array().items(Joi.string().allow(null)).allow(null),
  files: Joi.array().items(Joi.string().allow(null)).allow(null),
  status: Joi.bool(),
})

const getPublications = async (req, res, next) => {
  try {
    const publications = await Publication.findAll({
      include: {
        association: 'publisher',
        attributes: ['id', 'firstName', 'lastName', 'avatar', 'status'],
      },
    })

    res.json(publications)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const createPublication = async (req, res, next) => {
  try {
    // Obtengo la data del body
    const { title, text, images, files, publisher_id } = req.body
    const data = { title, text, images, files, publisher_id }

    // Valido datos
    const { error } = createPubliSchema.validate(data)

    if (error) return res.status(400).json({ error: error.details[0].message })

    // Creo la publicacion
    await Publication.create(data)

    res.json({ message: 'Publication created successfully' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const updatePublication = async (req, res, next) => {
  try {
    const { title, text, images, files, status } = req.body
    const { id } = req.params

    // Chequeo el body
    if (!Object.keys(req.body).length)
      return res.status(400).json({ error: 'Please provide some body data' })

    // Guardo los datos del body
    const data = { title, text, images, files, status }

    // Valido los datos
    const { error } = updatePubliSchema.validate(data)

    // Retorno errores de validacion
    if (error) return res.status(400).json({ error: error.details[0].message })

    // Actualizo
    const [count] = await Publication.update(data, { where: { id } })

    // Cheque que haya cambios, sino entonces no existe la publi
    if (!count)
      return res
        .status(400)
        .json({ error: 'Not found any publication with that ID' })

    return res.json({ message: 'Publication updated sucessfully' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const deletePublication = async (req, res, next) => {
  try {
    // Obtengo el id y status, si estatus no esta definido, entonces le seteo como false por default
    const { id } = req.params
    let { status = false } = req.body

    // Actualizo la publicacion
    const [count] = await Publication.update({ status }, { where: { id } })

    // Si count es 0 entonces la publicacion no existe
    if (!count)
      return res
        .status(400)
        .json({ error: 'Not found any publication with that ID' })

    return res.json({ message: 'Publication deleted sucessfully' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const likePublication = async (req, res, next) => {
  try {
    const { id } = req.params
    const { like = true } = req.body

    const { error } = Joi.boolean().required().validate(like)

    if (error) return res.status(400).json({ error: error.details[0].message })

    // Incremento o disminuyo por 1 los likes, si los likes son mayores o iguales a 0
    let conditional = {
      where: {
        id,
        likes: {
          // Si like es true entonces busca una publicacion con >= 0 likes, sino >= 1 likes. Esto es para evitar likes = -1
          [Op.gte]: like ? 0 : 1,
        },
      },
      // Si like es false entones resto 1
      by: like ? 1 : -1,
    }

    await Publication.increment('likes', conditional)

    return like
      ? res.json({ message: 'Publication liked' })
      : res.json({ message: 'Publication disliked' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

module.exports = {
  getPublications,
  createPublication,
  updatePublication,
  deletePublication,
  likePublication,
}
