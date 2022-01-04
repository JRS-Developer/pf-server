const jwt = require('jsonwebtoken')
const { secret } = require('../lib/config')
const { roles } = require('../datos/roles')

const checkRole = (id, roleToCompare) => {
  const role = roles.find((role) => role.id === id)
  return role.name === roleToCompare
}

const verifyToken = async (req, res, next) => {
  try {
    // Obtengo el token
    const token = req.headers['x-access-token']

    // Si no manda el token, entonces responde con un error
    if (!token)
      return res.status(403).json({ error: 'A JWT token is required' })

    // Verifico que el token sea valido
    const tokenDesencriptado = jwt.verify(token, secret)

    res.locals.userId = tokenDesencriptado.id
    res.locals.roleId = tokenDesencriptado.roleId

    return next()
  } catch (error) {
    // Si el token no es valido, entonces retorno un error 401
    res.status(401).json({ error: error.message })
  }
}

const esSuperUser = async (req, res, next) => {
  try {
    // Obtengo el token desencriptado y el rol
    const roleId = res.locals.roleId
    const isSuperUser = checkRole(roleId, 'sUser')

    if (isSuperUser) {
      return next()
    }

    res.status(403).json({ error: 'No tienes permisos para ingresar' })
  } catch (error) {
    // Si el token no es valido, entonces retorno un error 403
    res.status(403).json({ error: 'No tienes permisos para ingresar' })
  }
}

const esSuperUserOrAdmin = async (req, res, next) => {
  try {
    const isSuperUser = checkRole(res.locals.roleId, 'sUser')
    const isAdmin = checkRole(res.locals.roleId, 'Admin')

    if (isSuperUser || isAdmin) {
      return next()
    }

    res.status(403).json({ error: 'No tienes permisos para ingresar' })
  } catch (error) {
    // Si el token no es valido, entonces retorno un error 403
    res.status(403).json({ error: 'No tienes permisos para ingresar' })
  }
}

const esSuperUserOrAdminOrProfesor = async (req, res, next) => {
  try {
    const isSuperUser = checkRole(res.locals.roleId, 'sUser')
    const isAdmin = checkRole(res.locals.roleId, 'Admin')
    const isProfesor = checkRole(res.locals.roleId, 'Profesor')

    if (isSuperUser || isAdmin || isProfesor) {
      return next()
    }
    res.status(403).json({ error: 'No tienes permisos para ingresar' })
  } catch (error) {
    // Si el token no es valido, entonces retorno un error 403
    res.status(403).json({ error: 'No tienes permisos para ingresar' })
  }
}

const esProfesor = async (req, res, next) => {
  try {
    const isProfesor = checkRole(res.locals.roleId, 'Profesor')

    if (isProfesor) {
      return next()
    }
    res.status(403).json({ error: 'No tienes permisos para ingresar' })
  } catch (error) {
    // Si el token no es valido, entonces retorno un error 403.
    res.status(403).json({ error: 'No tienes permisos para ingresar' })
  }
}

const esProfesorOrAlumno = async (req, res, next) => {
  try {
    const isProfesor = checkRole(res.locals.roleId, 'Profesor')
    const isAlumno = checkRole(res.locals.roleId, 'Alumno')

    if (isProfesor||isAlumno) {
      return next()
    }
    res.status(403).json({ error: 'No tienes permisos para ingresar' })
  } catch (error) {
    // Si el token no es valido, entonces retorno un error 403.
    res.status(403).json({ error: 'No tienes permisos para ingresar' })
  }
}



module.exports = {
  verifyToken,
  esSuperUser,
  esSuperUserOrAdmin,
  esSuperUserOrAdminOrProfesor,
  esProfesor,
  esProfesorOrAlumno,
}
