const { User } = require('../models/')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const { secret } = require('../lib/config')
const Role = require('../models/Role')
const bcrypt = require('bcryptjs')

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
    if (error)
      return res.status(400).json({ message: error.details[0].message })

    // Busco si el usuario existe
    const userFound = await User.findOne({
      include: { model: Role },
      where: { email },
    })
    // Sino existe le retorno un error
    if (!userFound)
      return res
        .status(400)
        .json({ message: 'No hay ningún usuario registrado con ese correo' })

    // Si existe entonces debo comparar las contraseñas.
    const passwordIsValid = bcrypt.compareSync(password, userFound.password)

    // Si el password no coincide, mando un error
    if (!passwordIsValid)
      return res.status(400).json({ message: 'Contraseña inválida' })

    // Creo el token almacenandole el id del usuario y sus roles
    // INFO: Lo mas probable es que despues se quiera guardar tambien los access, pero falta gestionar esa tabla.
    const token = jwt.sign(
      { id: userFound.id, roleId: userFound.roleId, email: userFound.email },
      secret,
      {
        expiresIn: '24h',
      }
    )

    res.json({
      token,
      user: userFound.id,
      message: 'Sesión iniciada correctamente',
      role: userFound.role.name,
    })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

module.exports = {
  loginUser,
}
