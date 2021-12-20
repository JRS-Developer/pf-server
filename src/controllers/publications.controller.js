const { Publication, Like } = require('../models')
const Joi = require('joi')

const getPostSchema = Joi.object({
  classId: Joi.string().guid(),
  materiaId: Joi.string().guid(),
})

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

const userMadeLike = (userId, post) =>
  post.likes.some((like) => like.user_id === userId && like.status)

const getPublications = async (req, res, next) => {
  try {
    const userId = res.locals.userId
    const { materiaId, classId } = req.query

    const { error } = getPostSchema.validate()

    if (error) return res.status(400).json({ error: error.details[0].message })

    let publications = await Publication.findAll({
      where: { classId, materiaId },
      include: [
        {
          association: 'publisher',
          attributes: ['id', 'firstName', 'lastName', 'avatar', 'status'],
        },
        { model: Like },
      ],
    })

    // Aqui compruebo que el usuario dio like
    publications = publications.map((post) => {
      post = post.toJSON()
      return {
        ...post,
        madeLike: userMadeLike(userId, post),
      }
    })

    res.json(publications)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const getOnePublication = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = res.locals.userId

    let post = await Publication.findByPk(id, {
      include: Like,
    })

    post = post.toJSON()

    // Aqui compruebo si el usuario dio like o no
    post.madeLike = userMadeLike(userId, post)

    return res.json(post)
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
    const userId = res.locals.userId

    const publication = await Publication.findByPk(id)

    if (!publication)
      return res
        .status(400)
        .json({ error: 'There is not any publication with that ID' })

    const [like, created] = await Like.findOrCreate({
      where: { user_id: userId, post_id: publication.id },
    })

    // Si crea el like entonces devuelvo un mensaje de creado
    if (created) {
      await publication.addLike?.(like)
      return res.json({ message: 'Publication liked' })
    }

    // Sino lo crea entonces actualizo su status a false si ya esta seteado y si pues a true
    if (like.status) {
      await like.update({ status: false })
      return res.json({ message: 'Publication disliked' })
    }

    await like.update({ status: true })

    return res.json({ message: 'Publication liked' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

module.exports = {
  getPublications,
  getOnePublication,
  createPublication,
  updatePublication,
  deletePublication,
  likePublication,
}
