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
  images: Joi.alternatives(
    Joi.array().items(Joi.string().guid()).allow(null),
    Joi.string().guid()
  ),
  documents: Joi.alternatives(
    Joi.array().items(Joi.string().guid()).allow(null),
    Joi.string().guid()
  ),
})

const userMadeLike = (userId, post) =>
  post.likes.some((like) => like.user_id === userId && like.status)

const separateImgsAndDocs = (files, req) => {
  const images = []
  const documents = []
  // Si files es undefined o es === 0 entonces retorno los array vacios
  if (!files?.length) return [images, documents]

  // Compruebo el tipo de archivo
  // Si es una imagen, lo guardo como una imagen, sino entonces como un documento.

  for (let file of files) {
    const ext = path.extname(file.path)
    const name = file.filename
    const type = file.mimetype

    // Si es una imagen, entonces lo guardo en una promesa para subir a cloudinary
    if (ext === '.jpg' || ext === '.png' || ext === '.jpeg' || ext === '.svg') {
      images.push({
        name,
        url: uploadImage(file.path),
        type,
        path: file.path,
      })
    } else {
      const filePath = encodeURI(
        `${req.protocol}://${req.get('host')}/files/${file.filename}`
      )
      // Si es un documento entonces lo guardo en documentos
      documents.push({
        name,
        url: filePath,
        type,
      })
    }
  }
  // Retorno los resultados
  return [images, documents]
}

const uploadImagesAndUnlink = async (images) => {
  // Si hay imagenes, los subo a cloudinary para obtener el url
  return await Promise.all(
    images.map((img) =>
      img.url.then(async ({ url }) => {
        // Elimino el archivo del sistema de archivos y retorno el url de cloudinary
        await fs.unlink(img.path)
        delete img.path
        return { ...img, url }
      })
    )
  )
}

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
        {
          model: Like,
          where: {
            status: true,
          },
          required: false,
        },
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
      where: {
        status: true,
      },
    }

    if (materiaId && classId)
      options.where = { ...options.where, materiaId, classId }

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
      include: [
        {
          association: 'publisher',
          attributes: ['id', 'firstName', 'lastName', 'avatar', 'status'],
        },
        {
          model: Like,
          where: {
            status: true,
          },
          required: false,
        },
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

    // Separo los archivos
    let [images, documents] = separateImgsAndDocs(req.files, req)

    images = await uploadImagesAndUnlink(images)

    // Si al final hubieron imagenes y documentos, entonces lo guardo en la base de datos
    const imgsDB = await File.bulkCreate(images)
    const docsDB = await File.bulkCreate(documents)

    // Creo la publicacion y coloco sus documentos e imagenes
    const newPost = await Publication.create(data)
    await newPost?.setDocuments?.(docsDB)
    await newPost?.setImages?.(imgsDB)

    res.json({ message: 'Publication created successfully' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const updatePublication = async (req, res, next) => {
  try {
    let { title, text, images, documents, status } = req.body // Images y documents deben ser un array de ids
    const { id } = req.params

    // Chequeo el body
    if (!Object.keys(req.body).length)
      return res.status(400).json({ error: 'Please provide some body data' })

    // Guardo los datos del body
    const data = { title, text, images, documents, status }

    // Valido los datos
    const { error } = updatePubliSchema.validate(data)

    // Retorno errores de validacion
    if (error) return res.status(400).json({ error: error.details[0].message })

    // Actualizo
    let [count, post] = await Publication.update(data, {
      where: { id },
      returning: true,
    })

    // Cheque que haya cambios, sino entonces no existe la publi
    if (!count)
      return res
        .status(400)
        .json({ error: 'Not found any publication with that ID' })

    let [imgsReq, docsReq] = separateImgsAndDocs(req.files, req)
    imgsReq = await uploadImagesAndUnlink(imgsReq)

    // Si imgSReq y docsReq tienen valores entonces los añado al DB
    const imgsDB = await File.bulkCreate(imgsReq)
    const docsDB = await File.bulkCreate(docsReq)

    // Si imgSReq y docsReq tienen valores entonces los añado al array images y documents
    if (imgsDB.length) {
      // Si images no es mandado, da un error de que no es array, asi que debo hacer una comprobacion
      if (Array.isArray(images)) images = [...images, ...imgsDB]
      else {
        // Ya que images puede ser un string, si es un string entonces lo guardo en un array junto a imgsDB e igual con los documentos
        images = images ? [images, ...imgsDB] : imgsDB
      }
    }
    if (docsDB.length) {
      if (Array.isArray(documents)) documents = [...documents, ...docsDB]
      else {
        documents = documents ? [documents, ...docsDB] : docsDB
      }
    }

    await post[0]?.setImages?.(images)
    await post[0]?.setDocuments?.(documents)

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
