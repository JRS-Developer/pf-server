const { User, Role } = require('../models/')
const Joi = require('joi')

const NO_USER_FOUND = "There isn't any user with that id"

const createUserSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  userName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  avatar: Joi.string().allow(''),
  birthdate: Joi.date(),
  identification: Joi.string().required(),
  country: Joi.string().required(),
})

const updateUserSchema = Joi.object({
  id: Joi.string().guid(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  userName: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string(),
  avatar: Joi.string(),
  birthdate: Joi.date(),
  identification: Joi.string(),
  country: Joi.string(),
})

const deleteUserSchema = Joi.object({
  id: Joi.string().guid(),
  status: Joi.boolean().required(),
})

//**users**

//get para obtener datos de usuarios
const get_user_info = async (req, res, next) => {
  try {
    const { id } = req.query
    // const { role_id, school_id } = req.params
    // Buscamos usuarios por ID (pasado por query) para acceder al detalle de uno en particular
    if (id) {
      //se busca user por id
      const user_found = await User.findByPk(id)

      //se verifica si se encontró coincidencia y se retorna el objeto sino se envia error
      if (!user_found) return res.status(400).json({ error: NO_USER_FOUND })

      return res.json(user_found)
    }

    //Buscamos todos los usuarios disponibles
    const users = await User.findAll({
      // where: {
      //   role_id,
      //   school_id,
      // },
      include: {
        model: Role,
      },
    })

    //se envia la respuesta como un arreglo de objetos
    res.json(users)

    //manejo del error con try catch pasando mano con next.
  } catch (error) {
    next(error)
  }
}

//get para obtener datos de usuarios por roles
const user_info_by_role = async (req, res) => {
  res.send('se trae la info de usuarios por rol')
}

//post para añadir usuario
const create_user = async (req, res, next) => {
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
    } = req.body

    // Valido los datos
    const { error } = createUserSchema.validate(req.body)

    if (error) return res.status(400).json({ error: error.details[0].message })

    //se crea el nuevo objeto en la BD
    const newUser = await User.create({
      firstName,
      lastName,
      userName,
      email,
      password,
      avatar,
      birthdate,
      identification,
      country,
    })
    //mensaje satisfactorio
    res.json(newUser)

    //en caso de haber error es manejado por el catch
  } catch (error) {
    next(error)
  }
}

//put para modificar user
const upDate_user = async (req, res, next) => {
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
    } = req.body

    // Valido datos, si el body esta vacio, retorno un error
    if (!Object.keys(req.body).length)
      return res.status(400).json({ error: 'Please provide some body data' })

    // Valido que los datos del body y el id sean validos
    const { error } = updateUserSchema.validate({ ...req.body, id })

    // Si hay algun error lo retorno
    if (error) return res.status(400).json({ error: error.details[0].message })

    //la password se modifica de forma individual
    if (password) {
      const [count] = await User.update(
        { password },
        {
          where: {
            id,
          },
        }
      )
      // Checkeo que haya cambios, sino, significa que no hay ningun usuario con ese ID
      if (!count) return res.status(400).json({ error: NO_USER_FOUND })
      //mensaje satisfactorio
      return res.json({ message: 'password succesfully modified' })
    }

    //aca se modifican los demaás datos cuando no sea solicitada la modificación de la password
    const [count] = await User.update(
      {
        firstName,
        lastName,
        userName,
        email,
        avatar,
        birthdate,
        identification,
        country,
      },
      {
        where: {
          id,
        },
      }
    )

    // Checkeo que haya cambios, sino, significa que no hay ningun usuario con ese ID
    if (!count) return res.status(400).json({ error: NO_USER_FOUND })

    //mensaje satisfactorio
    res.json({ message: 'user data modified' })

    //en caso de haber error es manejado por el catch
  } catch (error) {
    next(error)
  }
}

//delete para eliminar usuario
const user_delete = async (req, res, next) => {
  try {
    //se recibe id por params
    const { id } = req.params
    const { status } = req.body

    // Valido los datos
    const { error } = deleteUserSchema.validate({ ...req.body, id })

    if (error) return res.status(400).json({ error: error.details[0].message })

    // Se actualia el status para determinar si es un usuario activo o no
    const [count] = await User.update({ status: status }, { where: { id: id } })

    if (!count) return res.status(400).json({ error: NO_USER_FOUND })

    //mensaje satisfactorio
    res.json({ message: 'user was deleted' })

    //en caso de haber error es manejado por el catch
  } catch (error) {
    next(error)
  }
}

//put para cambiar rol de usuario
const user_role_set = async (req, res, next) => {
  try {
    //se trae el nuevo rol por body
    const { role_id } = req.body
    //se busca el id del user a modificar por params
    const { id } = req.query

    const { error } = Joi.string().guid().required()

    if (error) return res.status(400).json({ error: error.details[0].message })

    //se hace el update en el modelo
    const [count] = await User.update(
      { role_id },
      {
        where: {
          id: id,
        },
      }
    )

    if (!count) return res.status(400).json({ error: NO_USER_FOUND })

    //mensaje satisfactorio
    res.json({ message: 'user role changed' })

    //en caso de haber error es manejado por el catch
  } catch (error) {
    next(error)
  }
}

//**roles**

//get para obtener roles
const get_roles = async (_req, res, next) => {
  try {
    //se traen todos los roles
    const roles = await Role.findAll()

    //se envian como un array de objetos
    res.json(roles)

    //en caso de haber error es manejado por el catch
  } catch (error) {
    next(error)
  }
}

//Post para crear roles
const create_roles = async (req, res, next) => {
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
    next(error)
  }
}

//Put paramodificar roles
const upDate_roles = async (req, res, next) => {
  try {
    //en caso de haber error es manejado por el catch
  } catch (error) {
    next(error)
  }
}

module.exports = {
  get_user_info,
  user_info_by_role,
  create_user,
  upDate_user,
  user_delete,
  user_role_set,
  get_roles,
  create_roles,
  upDate_roles,
}
