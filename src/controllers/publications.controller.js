const { Publication, Like, File } = require('../models')
const Joi = require('joi')
const path = require('path')
const uploadImage = require('../utils')
const fs = require('fs-extra')

const getPostSchema = Joi.object({
  classId: Joi.string().guid(),
  materiaId: Joi.string().guid(),
})

const createPubliSchema = Joi.object({
  title: Joi.string().required(),
  text: Joi.string().required(),
  publisher_id: Joi.string().uuid().required(),
  classId: Joi.string().guid(),
  materiaId: Joi.string().guid(),
})

const updatePubliSchema = Joi.object({
  title: Joi.string().allow('', null),
  text: Joi.string().allow('', null),
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

    const options = {
      include: [
        {
          association: 'publisher',
          attributes: ['id', 'firstName', 'lastName', 'avatar', 'status'],
        },
        { model: Like },
        {
          model: File,
          as: 'images',
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
        {
          model: File,
          as: 'documents',
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
      ],
    }

    if (materiaId && classId) options.where = { materiaId, classId }

    let publications = await Publication.findAll(options)

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
    const { title, text, publisher_id, materiaId, classId } = req.body
    let data = { title, text, publisher_id }

    if (materiaId && classId)
      data = {
        ...data,
        materiaId,
        classId,
      }

    // Valido datos
    const { error } = createPubliSchema.validate(data)

    if (error) return res.status(400).json({ error: error.details[0].message })

    let images = []
    let documents = []
    // Si hay algun archivo subido entonces la añado
    if (req.files?.length) {
      // Compruebo el tipo de archivo, si es imagen, entonces lo
      // Si es una imagen, lo guardo como una imagen, sino entonces como un documento.
      for (let file of req.files) {
        const ext = path.extname(file.path)
        const name = file.filename
        const type = file.mimetype

        // Si es una imagen, entonces lo guardo en una promesa para subir a cloudinary
        if (
          ext === '.jpg' ||
          ext === '.png' ||
          ext === '.jpeg' ||
          ext === '.svg'
        ) {
          images.push({
            name,
            url: uploadImage(file.path),
            type,
            path: file.path,
          })
        } else {
          // Si es un documento entonces lo guardo en documentos
          documents.push({
            name,
            url: file.path,
            type,
          })
        }
      }
    }

    // Si hay imagenes, los subo a cloudinary para obtener el url
    images = await Promise.all(
      images.map((img) =>
        img.url.then(async ({ url }) => {
          // Elimino el archivo del sistema de archivos y retorno el url de cloudinary
          await fs.unlink(img.path)
          delete img.path
          return { ...img, url }
        })
      )
    )

    // Si al final hubieron imagenes y documentos, entonces lo guardo en la base de datos
    const imgsDB = await File.bulkCreate(images)
    const docsDB = await File.bulkCreate(documents)

		// Creo la publicacion y coloco sus documentos e imagenes
    const newPost = await Publication.create(data)
    await newPost?.setDocuments(docsDB)
		await newPost?.setImages(imgsDB)

    res.json({ message: 'Publication created successfully' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const updatePublication = async (req, res, next) => {
  try {
    const { title, text, image, status } = req.body
    const { id } = req.params

    // Chequeo el body
    if (!Object.keys(req.body).length)
      return res.status(400).json({ error: 'Please provide some body data' })

    // Guardo los datos del body
    const data = { title, text, image, status }

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
