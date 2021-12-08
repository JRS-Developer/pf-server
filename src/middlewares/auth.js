const jwt = require('jsonwebtoken')
const { secret } = require('../lib/config')

const verifyToken = (req, res, next) => {
  try {
    // Obtengo el token
    const token = req.headers['x-access-token']

    // Si no manda el token, entonces responde con un error
    if (!token)
      return res.status(403).json({ error: 'A JWT token is required' })

    // Verifico que el token sea valido
    jwt.verify(token, secret)
    return next()
  } catch (error) {
    // Si el token no es valido, entones retorno un error 401
    res.status(401).json({ error: error.message })
  }
}

module.exports = {
  verifyToken,
}
