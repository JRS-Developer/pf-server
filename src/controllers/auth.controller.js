const { User } = require('../models/')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const { secret } = require('../lib/config')
const Role = require('../models/Role')

const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Valido que el email y password son validos
    const { error } = loginUserSchema.validate({ email, password })

    // Si hay algun error de validacion pues lo retorno
    if (error) return res.status(400).json({ error: error.details[0].message })

    // Busco si el usuario existe
    const userFound = await User.findOne({
      include: {model: Role},
      where: { email }
    })

    // Sino existe le retorno un error
    if (!userFound)
      return res
        .status(401)
        .json({ error: 'There is not any user registered with that email' })

    // Si existe entonces debo comparar las contraseñas.
    // TODO: comparar el password con el password hasheado por temas de seguridad.
    const passwordIsValid = password === userFound.password

    // Si el password no coincide, mando un error
    if (!passwordIsValid)
      return res.status(401).json({ error: 'Invalid password' })

    // Si coincide, entonces el usuario existe, asi que debo obtener sus roles y guardarlos en un json web token.
    const roles =
      (await userFound.getRol) &&
      userFound.getRol().then((roles) => roles.map((r) => r.id))

    // Creo el token almacenandole el id del usuario y sus roles
    // INFO: Lo mas probable es que despues se quiera guardar tambien los access, pero falta gestionar esa tabla.
    console.log(userFound)
    const token = jwt.sign({ id: userFound.id, roles: userFound.roleId, email: userFound.email }, secret, {
      expiresIn: '24h',
    })
    //console.log(tokenData)
    
    res.json({ token })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

module.exports = {
  loginUser,
}
