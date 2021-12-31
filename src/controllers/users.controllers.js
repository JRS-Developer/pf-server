const { User, Role, Classes, Access } = require('../models/')
const { alumnosAccess } = require('../datos/access')
const Joi = require('joi')
const uploadImage = require('../utils')
const fs = require('fs-extra')
const path = require('path')
const { access } = require('fs')

const NO_USER_FOUND = "There isn't any user with that id"

const createUserSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  userName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  avatar: Joi.string().allow('', null),
  birthdate: Joi.date().required(),
  identification: Joi.string().required(),
  country: Joi.string().required(),
  roleId: Joi.string().guid().allow('', null),
})

const updateUserSchema = Joi.object({
  id: Joi.string().guid(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  userName: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string(),
  avatar: Joi.string().allow('', null),
  birthdate: Joi.date(),
  identification: Joi.string(),
  country: Joi.string(),
  roleId: Joi.string().guid().allow('', null),
})

const deleteUserSchema = Joi.object({
  id: Joi.string().guid(),
  status: Joi.boolean().required(),
})

const setUserRoleSchema = Joi.object({
  id: Joi.string().guid().required(),
  role_id: Joi.string().guid().required(),
})

//**users**
const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      include: {
        model: Role,
      },
      attributes: {
        exclude: ['roleId'],
      },
    })

    //se envia la respuesta como un arreglo de objetos
    res.json(users)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

//get para obtener datos de un usuario
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params
    // Buscamos usuarios por ID (pasado por query) para acceder al detalle de uno en particular
    const user_found = await User.findByPk(id, {
      include: [{ model: Role }],
      attributes: {
        exclude: ['roleId'],
      },
    })

    //se verifica si se encontró coincidencia y se retorna el objeto sino se envia error
    if (!user_found) return res.status(400).json({ error: NO_USER_FOUND })

    return res.json(user_found)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

//get para obtener datos de usuarios por roles
const getUsersByRole = async (req, res, next) => {
  try {
    const { role_id } = req.body

    const { error } = Joi.string().guid().required().validate(role_id)

    if (error) return res.status(400).json({ error: error.details[0].message })

    const users = await User.findAll({ where: { roleId: role_id } })

    res.json(users)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

//post para añadir usuario
const createUser = async (req, res, next) => {
  try {
    //se reciben los datos por body
    const {
      firstName,
      lastName,
      userName,
      email,
      password,
      avatar,
      birthdate,
      identification,
      country,
      role, // El role tiene que ser un Id
    } = req.body

    const data = {
      firstName,
      lastName,
      userName,
      email,
      password,
      avatar,
      birthdate,
      identification,
      country,
      roleId: role,
    }

    // Valido los datos
    const { error } = createUserSchema.validate(data)

    if (error) return res.status(400).json({ error: error.details[0].message })

    //se crea el nuevo objeto en la BD
    const usuario = await User.create(data)
    //mensaje satisfactorio
    res.status(201).json({ message: 'User created successfully' })

    //Si el user es Alumno le genero accesos por default.
    const findrole = await Role.findByPk(data.roleId)

    if (findrole && findrole.dataValues.name === 'Alumno') {
      const alumno = []
      //alumnosaccess es un array con modulos y acciones importado de datos/access.js
      alumnosAccess.forEach((element) =>
        alumno.push({
          user_id: usuario.dataValues.id,
          module_id: element.module_id,
          action_id: element.action_id,
        })
      )
      await Access.bulkCreate(alumno)
    }

    //en caso de haber error es manejado por el catch
  } catch (error) {
    console.error(error)
    next(error)
  }
}

//put para modificar user
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params

    //Manejo de los demas datos por formulario
    const {
      firstName,
      lastName,
      userName,
      email,
      password,
      avatar,
      birthdate,
      identification,
      country,
      role,
    } = req.body

    const data = {
      firstName,
      lastName,
      userName,
      email,
      password,
      avatar,
      birthdate,
      identification,
      country,
      roleId: role,
    }

    // Valido datos, si el body esta vacio, retorno un error
    if (!Object.keys(req.body).length && !req.file)
      return res.status(400).json({ error: 'Please provide some body data' })

    // Valido que los datos del body y el id sean validos
    const { error } = updateUserSchema.validate({
      ...data,
      id,
    })

    // Si hay algun error lo retorno
    if (error) return res.status(400).json({ error: error.details[0].message })

    // YA QUE LA CONTRASEÑA EN LA BASE DE DATOS ESTA ENCRIPTADA, PUES NO PODEMOS AGARRAR LA CONTRASEÑA QUE MANDA EL BODY Y ENCRIPTARLA DE NUEVO, PORQUE NO SERVIRIA, Asi que debo primero buscar en la base de datos, y si la contraseña en la base de datos es la misma que del body, entonces no la encripto
    const user = await User.findByPk(id)

    // Sino hay usuario entonces revuelvo un error
    if (!user) return res.status(400).json({ error: NO_USER_FOUND })

    // Si la contraseña es la misma que la de la base de datos, entonces la borro del objeto data y asi evito volver a encriptarla.
    if (user?.password === password) {
      delete data.password
    }

    // Si se sube una imagen, la guardo en cloudinary y luego en la base de datos
    if (req.file) {
      const ext = path.extname(req.file.path)
      // Si el archivo no es una imagen estatica, entonces devuelve un error
      if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg')
        return res
          .status(400)
          .json({ error: 'Solo se aceptan imagenes estaticas' })

      const image = await uploadImage(req.file.path)
      // Elimino la imagen del almacenamiento
      fs.unlink(req.file.path)
      data.avatar = image.url
    }

    await User.update(data, {
      where: {
        id,
      },
    })

    //mensaje satisfactorio
    res.json({ message: 'User updated successfully' })

    //en caso de haber error es manejado por el catch
  } catch (error) {
    console.error(error)
    next(error)
  }
}

//delete para eliminar usuario
const deleteUser = async (req, res, next) => {
  try {
    //se recibe id por params
    const { id } = req.params
    let { status } = req.body

    if (!status) status = false

    // Valido los datos
    const { error } = deleteUserSchema.validate({ status, id })

    if (error) return res.status(400).json({ error: error.details[0].message })

    // Se actualia el status para determinar si es un usuario activo o no
    const [count] = await User.update({ status: status }, { where: { id: id } })

    if (!count) return res.status(400).json({ error: NO_USER_FOUND })

    //mensaje satisfactorio
    res.json({ message: 'User deleted successfully' })

    //en caso de haber error es manejado por el catch
  } catch (error) {
    console.error(error)
    next(error)
  }
}

//put para cambiar rol de usuario
const setUserRole = async (req, res, next) => {
  try {
    //se trae el nuevo rol por body
    const { role_id } = req.body
    //se busca el id del user a modificar por params
    const { id } = req.params

    const { error } = setUserRoleSchema.validate({ role_id, id })

    if (error) return res.status(400).json({ error: error.details[0].message })

    //se hace el update en el modelo
    const [count] = await User.update(
      { roleId: role_id },
      {
        where: {
          id,
        },
      }
    )

    if (!count) return res.status(400).json({ error: NO_USER_FOUND })

    //mensaje satisfactorio
    res.json({ message: 'user role changed' })

    //en caso de haber error es manejado por el catch
  } catch (error) {
    console.error(error)
    next(error)
  }
}

module.exports = {
  getUsers,
  getUserById,
  getUsersByRole,
  createUser,
  updateUser,
  deleteUser,
  setUserRole,
}
