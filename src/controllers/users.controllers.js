const User = require('../models/User');
const Role = require('../models/Role');
const {
    create_user_sch,
    upDate_user_sch
} = require('./schemas');

//**users**



//get para obtener datos de usuarios
const get_user_info = async (req, res, next) => {
  try {
    const { id } = req.query
    const { role_id, school_id } = req.params
    // Buscamos usuarios por ID (pasado por query) para acceder al detalle de uno en particular
    if (id) {
      //se busca user por id
      const user_found = await User.findByPk(id)

      //se verifica si se encontró coincidencia y se retorna el objeto sino se envia error
      if (!user_found)
        return res
          .status(400)
          .json({ error: "There isn't any user with that id" });

      return res.json(user_found);
    };

    //Buscamos todos los usuarios disponibles
    const users = await User.findAll({
      where: {
        role_id,
        school_id,
      },
    });

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
    
    //se hace la validación de los datos
    await create_user_sch.validateAsync(req.body);

    //se reciben los datos por body
    const { 
        username, 
        first_name, 
        last_name, 
        identification, 
        email, 
        password, 
        avatar } = req.body

    //se crea el nuevo objeto en la BD
    await User.create(
        username, 
        first_name, 
        last_name, 
        identification, 
        email, 
        password, 
        avatar
    )
    //mensaje satisfactorio
    res.json({ message: 'user successfully created' })

    //en caso de haber error es manejado por el catch
  } catch (error) {
    next(error)
  }
}

//put para modificar user
const upDate_user = async (req, res, next) => {
  try {
    const { id } = req.params

    //Manejo de contraseña aparte para validaciones
    const { password } = req.query

    //Manejo de los demas datos por formulario
    const { name, email, avatar } = req.body

    //la password se modifica de forma individual
    if (password) {
      await User.update(
        { password },
        {
          where: {
            id: id,
          },
        }
      )
      //mensaje satisfactorio
      return res.json({ message: 'password succesfully modified' })
    }

    //aca se modifican los demaás datos cuando no sea solicitada la modificación de la password
    await User.update(
      { name, email, avatar },
      {
        where: {
          id: id,
        },
      }
    )

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

    //se elimina el objeto de la BD
    await User.destroy({ where: { id: id } })

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

    //se hace el update en el modelo
    await User.update(
      { role_id },
      {
        where: {
          id: id,
        },
      }
    )
    //mensaje satisfactorio
    res.json({ message: 'user role changed' })

    //en caso de haber error es manejado por el catch
  } catch (error) {
    next(error)
  }
}

//**roles**

//get para obtener roles
const get_roles = async (req, res, next) => {
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

    //se crea el nuevo rol
    await Role.create(name)

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
